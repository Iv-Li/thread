import { ICommunityDetailsRes, ICommunityRes, IUserRes } from '@/types';
import { connectToDb } from '@/db/connectToDb';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { Community, User, Thread } from '@/models';
import { handleError } from '@/lib/handleError';
import { Models } from '@/consts';


interface IFetchCommunities {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy: SortOrder
}
export const fetchCommunities = handleError(async ({ searchString = '', pageNumber = 1, pageSize = 1, sortBy = 'desc' }: IFetchCommunities): Promise<{
  communities: ICommunityRes[], totalAmount: number, page: number, totalPages: number
}>  => {
  await connectToDb()

  const skipAmount = (pageNumber - 1 ) * pageSize
  const regex = new RegExp(searchString, 'i')

  const query: FilterQuery<typeof Community> = {}

  if(searchString?.trim()) {
    query.$or = [
      { username: { $regex: regex } },
      { name:  { $regex: regex } },
    ]
  }

  const sortOption = { createdAt: sortBy }
  const communities: ICommunityRes[] = await Community.find(query).sort(sortOption).skip(skipAmount).limit(pageSize).populate('members').lean()
  const totalUsersAmount = await Community.countDocuments(query)
  const totalPages = Math.ceil(totalUsersAmount / pageSize)

  return { communities, totalAmount: totalUsersAmount, page: pageNumber, totalPages }
},
  () => 'Failed to fetch communities')



interface IFetchCommunityDetails {
  id: string
}
export const fetchCommunityDetails = handleError(async ({ id }: IFetchCommunityDetails): Promise<ICommunityDetailsRes> => {
  await connectToDb()
  const communityDetails = await Community.findOne({ id }).populate([
    'createdBy',
    {
      path: "members",
      model: Models.USER,
      select: 'name username image _id authId image',
    },
  ])

  return communityDetails.toObject()
},
  () => 'Failed to fetch community details')


export interface ICreateCommunity {
  id: string
  name: string
  username: string
  image: string
  bio: string
  createdById: string
}
export const createCommunity = handleError(async ({ createdById, name, username, id, image, bio  }: ICreateCommunity): Promise<ICommunityRes> => {
  await connectToDb()
  const user = await User.findOne({ authId: createdById })
  if(!user) throw new Error('No user to create community')

  const newCommunity = await Community.create({
    authOrganizationId: id, name, username, image, bio, createdBy: user._id
  })

  /* communities id into user is added via webhook 'organizationMembership.created' */
  return newCommunity

},
  () => 'Failed to create community')


export interface IAddMemberToCommunity {
  communityId: string
  memberId: string
}

export const addMemberToCommunity = handleError(async ({ communityId, memberId  }: IAddMemberToCommunity): Promise<ICommunityRes> => {
    await connectToDb()
    const community = await Community.findOne({ authOrganizationId: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    const user = await User.findOne({ authId: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    community.members.push(user._id);
    await community.save();

    user.communities.push(community._id);
    await user.save();

    return community;
  },
  () => 'Failed to add member community')


export interface IDeleteMemberFromCommunity {
  communityId: string
  userId: string
}

export const deleteMemberFromCommunity = handleError(async ({ communityId, userId }: IDeleteMemberFromCommunity): Promise<void> => {
  await connectToDb()

  const session = await mongoose.startSession()
  session.startTransaction()
  try {

    const user = await User.findOne({ auth: userId }).select('_id')
    const community = await Community.findOne({ authOrganizationId: communityId }).select('_id')

    if(!user) throw new Error('Member not found')
    if (!community) throw new Error('Community not found')


    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    ).session(session)


    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    ).session(session)

    await session.commitTransaction()
    await session.endSession()

  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw err
  }
})


export interface IUpdateCommunityInfo {
  communityId: string
  name: string
  username: string
  image: string
}
export const updateCommunityInfo = handleError(async ({ communityId, name, username, image }: IUpdateCommunityInfo) => {
  await connectToDb()

  const updatedCommunity = await Community.findOneAndUpdate(
    { authOrganizationId: communityId },
    { name, username, image }
  );

  if (!updatedCommunity) {
    throw new Error("Community not found");
  }

  return updatedCommunity;
})


export const deleteCommunity = handleError(async (communityId: string): Promise<void> => {
  await connectToDb()

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedCommunity = await Community.findOneAndDelete(
      { authOrganizationId: communityId },
      { new: true }).session(session)

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    await Thread.deleteMany({ community: deletedCommunity?._id }).session(session)

    await User.updateMany(
      { communities: deletedCommunity?._id },
      { $pull: { communities: deletedCommunity?._id }}
    ).session(session)


    await session.commitTransaction()
    await session.endSession()

    return deletedCommunity;

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error
  }

})