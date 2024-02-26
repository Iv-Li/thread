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