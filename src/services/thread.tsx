'use server'
import { Types } from 'mongoose';
import { IThreadRes, IThreadWithChildren } from '@/types';
import Thread, {IThread } from '@/models/thread';
import Community from '@/models/community';
import { connectToDb } from '@/db/connectToDb';
import { revalidatePath } from 'next/cache';
import { Models } from '@/consts';
import { User } from '@/models';

interface ICreateThread {
  text: string
  author: string
  communityId?: string
  path: string
}
export const createThread = async (param: ICreateThread): Promise<IThreadRes> => {
  try {
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

  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to create thread: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to create thread: ${err}`)
    }

    throw err
  }
}


interface IUpdateThread {
  threadId: string
  text: string
  author: string
  communityId: string | null
  path: string
}
export const updateThread = async (params: IUpdateThread): Promise<IThreadRes | null> => {
  const { threadId, text, author, communityId, path } = params
  try {
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
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to update thread: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to update thread: ${err}`)
    }

    throw err
  }
}


export const deleteThread = async ({ id }: { id: string }): Promise<void> => {
  try {
    await connectToDb()
    await Thread.deleteOne({ _id: new Types.ObjectId(id)})

  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to update thread: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to update thread: ${err}`)
    }

    throw err
  }
}



export const getThreadById = async (id: string): Promise<IThreadWithChildren | undefined> => {
  try {
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
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to update thread: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to update thread: ${err}`)
    }

    throw err
  }
}