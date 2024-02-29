import { ICommunityRes, IUserRes } from '@/types';
import { connectToDb } from '@/db/connectToDb';
import { FilterQuery, SortOrder } from 'mongoose';
import { Community } from '@/models';


interface IFetchCommunities {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy: SortOrder
}
export const fetchCommunities = async ({ searchString = '', pageNumber = 1, pageSize = 1, sortBy = 'desc' }: IFetchCommunities): Promise<{
  communities: ICommunityRes[], totalAmount: number, page: number, totalPages: number
}>  => {
  try {
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
  } catch (err: unknown) {

    if (err instanceof Error) {
      throw new Error(`Failed to fetch users: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to fetch users: ${err}`)
    }

    throw err
  }
}