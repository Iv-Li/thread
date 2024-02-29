import { Types } from 'mongoose';

export interface IUserRes {
  _id: string
  authId: string
  username: string
  name: string
  image: string
  bio: string
  threads: string[]
  onboarded: Boolean
  communities: string[]
}

export interface IThreadRes {
  _id: string
  text: string
  author: string
  community: string | null
  path: string
  parentId?: string
  children?: string[]
  createdAt: string
  updatedAt: string
}

type Author = Pick<IUserRes, '_id' | 'authId' | 'image' | 'name'>

type Community = {
  _id: string
  authOrganizationId: string
  name: string
  image: string
}
export interface IThreadWithChildren extends Omit<IThreadRes, 'author' | 'community' | 'children'> {
  author: Author
  community: Community
  children: {
    author: Author & { parentId: string },
    community: Community
  }[]
}


export interface ICommunityRes {
  _id: string
  authOrganizationId: string
  username: string
  name: string
  image: string
  bio: string
  createdBy: string
  threads: string[]
  members: IUserRes[]
}
