'use server'
import { connectToDb } from '@/db/connectToDb';
import { User } from '@/models';
import { IUserRes } from '@/types';
import { FilterQuery, SortOrder } from 'mongoose';

interface IUserUpdate {
  authId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}
export const updateUser = async (userData: IUserUpdate): Promise<IUserRes>  => {
  console.log({ userData })
  try {
    await connectToDb()
    const user = await User.findOneAndUpdate(
      { authId: userData.authId },
      {
        username: userData.username.toLowerCase(),
        name: userData.name,
        bio: userData.bio,
        image: userData.image,
        onboarded: true,
      },
      { upsert: true, new: true }
    )
    console.log({ user: user.toObject()})

    const plainUser: IUserRes = user.toObject()
    return plainUser
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to create/update user: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to create/update user: ${err}`)
    }

    throw err
  }

}


interface IUserDelete {
  userId: string;
}
export const deleteUser = async ({ userId }: IUserDelete): Promise<void>  => {
  try {
    await connectToDb()

    await User.deleteOne({ authId: userId })
  } catch (err: unknown) {

    if (err instanceof Error) {
      throw new Error(`Failed to delete user: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to delete user: ${err}`)
    }

    throw err
  }
}


export const fetchUser = async (userId: string): Promise<IUserRes | null>  => {
  try {
    await connectToDb()

    let userDoc = await User.findOne({ authId: userId })
    const user: IUserRes | null = userDoc?.toObject() || null
    return user
  } catch (err: unknown) {

    if (err instanceof Error) {
      throw new Error(`Failed to fetch user: ${err.message}`)
    }

    if (typeof err === 'string') {
      throw new Error(`Failed to fetch user: ${err}`)
    }

    throw err
  }
}

interface IFetchUsers {
  currentUserId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy: SortOrder
}
export const fetchUsers = async ({ currentUserId, searchString = '', pageNumber = 1, pageSize = 1, sortBy = 'desc' }: IFetchUsers): Promise<{
  users: IUserRes[], totalAmount: number, page: number, totalPages: number
}>  => {
  try {
    await connectToDb()

    const skipAmount = (pageNumber - 1 ) * pageSize
    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      authId: { $ne: currentUserId}
    }

    if(searchString?.trim()) {
      query.$or = [
        { userName: { $reqex: regex } },
        { name:  { $reqex: regex } },
      ]
    }

    const sortOption = { createdAt: sortBy }
    const users: IUserRes[] = await User.find(query).sort(sortOption).skip(skipAmount).limit(pageSize).lean()
    const totalUsersAmount = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsersAmount / pageSize)

    return { users, totalAmount: totalUsersAmount, page: pageNumber, totalPages }
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