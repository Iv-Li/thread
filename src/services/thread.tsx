'use server'
import { Types } from 'mongoose';
import { ICommunityThreadsRes, IThreadRes, IThreadWithChildren, IUserWithThreadsRes } from '@/types';
import Thread, {IThread } from '@/models/thread';
import Community from '@/models/community';
import { connectToDb } from '@/db/connectToDb';
import { revalidatePath } from 'next/cache';
import { Models } from '@/consts';
import { User } from '@/models';
import { handleError } from '@/lib/handleError';

interface ICreateThread {
  text: string
  author: string
  communityId?: string
  path: string
}
export const createThread = handleError(async (param: ICreateThread): Promise<IThreadRes> => {
  await connectToDb()
  const user = await User.findOne({ authId: param.author })
  if(!user) throw 'user not found'

  const threadData: Partial<IThread> = {
    text: param.text,
    author: user._id,
  }
  param.communityId && (threadData.community = new Types.ObjectId(param.communityId))

  const threadDoc = await Thread.create(threadData)
  const thread: IThreadRes = threadDoc.toObject()
  revalidatePath(param.path)

  return thread
},
  () => 'Failed to create thread')



interface IUpdateThread {
  threadId: string
  text: string
  author: string
  communityId: string | null
  path: string
}
export const updateThread = handleError(async (params: IUpdateThread): Promise<IThreadRes | null> => {
  const { threadId, text, author, communityId, path } = params
  await connectToDb()

  const community = communityId && await Community.findOne({ _id: new Types.ObjectId(communityId!)})

  const updatedField: Partial<IThread> = { text, author: new Types.ObjectId(author)}
  community?._id && (updatedField.community = community?._id )


  const threadDoc = await Thread.findOneAndUpdate(
    { _id: new Types.ObjectId(threadId) },
    updatedField,
    { new: true }
  )
  const thread: IThreadRes | null = threadDoc?.toObject() || null
  return thread
},
() => 'Failed to update thread')



export const deleteThread = handleError(async ({ id }: { id: string }): Promise<void> => {
  await connectToDb()
  await Thread.deleteOne({ _id: new Types.ObjectId(id)})
},
  () => 'Failed to delete thread')

export const getThreadById = handleError(async (id: string): Promise<IThreadWithChildren | undefined> => {
  await connectToDb()
  const thread = await Thread.findById(id)
    .populate({
      path: 'author',
      model: Models.USER,
      select: '_id authId name image'
    })
    .populate({
      path: 'community',
      model: Models.COMMUNITY,
      select: '_id authOrganizationId name image'
    })
    .populate({
      path: 'children',
      populate: [
        {
          path: "author",
          model: Models.USER,
          select: "_id authId name parentId image",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: Models.USER,
            select: "_id authId name parentId image",
          },
        },
      ],
    }).exec()

  return thread?.toObject()
},
  () => 'Failed to delete thread')

interface IThreadComment {
  threadId: string
  comment: string
  userId: string
  path: string
}

export const addCommentToThread = handleError(async (params: IThreadComment): Promise<void> => {
  await connectToDb()

  const commentedThread = await Thread.findOne({ _id: params.threadId })
  if(!commentedThread) throw 'No thread to comment'

  const author = await User.findOne({ authId: params.userId })
  if(!author) throw 'No user to comment'

  const commentToThread = await Thread.create({
    text: params.comment,
    author: author._id,
    parentId: commentedThread._id
  })

  commentedThread.children.push(commentToThread._id)
  await commentedThread.save()

  revalidatePath(params.path)

},
  () => 'Failed to add comment to thread')


interface IFetchUserThreads {
  userId: string
}
export const fetchUserThreads = handleError(async ({ userId }: IFetchUserThreads): Promise<IUserWithThreadsRes | undefined> => {
  await connectToDb()
  const userWithThreads = await User.findOne({ authId: userId }).populate({
    path: 'threads',
    model: Models.THREAD,
    populate: [
      {
        path: 'community',
        model: Models.COMMUNITY,
        select: "name authOrganizationId image _id",
      },
      {
        path: 'children',
        model: Models.THREAD,
        populate: {
          path: 'author',
          model: Models.USER,
          select: 'name image authId _id'
        }
      }]
  })

  const user: IUserWithThreadsRes | undefined = userWithThreads?.toObject()

  return user
},
  () => 'Failed fetch user`s threads')


interface IFetchCommunityThreads {
  authOrganizationId: string
}
export const fetchCommunityThreads = handleError(async ({ authOrganizationId }: IFetchCommunityThreads): Promise<ICommunityThreadsRes | undefined> => {
    await connectToDb()
    const communityWithThreads = await Community.findOne({ authOrganizationId: authOrganizationId }).populate({
      path: 'threads',
      model: Models.THREAD,
      populate: [
        {
          path: 'author',
          model: Models.USER,
          select: 'name image authId',
        },
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: Models.USER,
            select: 'image authId',
          },
        },
      ],
    })

    const community: ICommunityThreadsRes | undefined = communityWithThreads?.toObject()

    return community
  },
  () => 'Failed fetch community`s threads')