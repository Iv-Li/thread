import { User } from '@/models';
import { connectToDb } from '@/db/connectToDb';
const mockUsers = [
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdqwe",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "anstom"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdjkl",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "andrew"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdiop",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "alic"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdbnm",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "artur"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdwer",
    bio: "hjkl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "anton"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdrty",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "amar"
  },
  {
    authId: "user_2crS3BXVKGeOnQqI9EhlCcgdyui",
    bio: "hjl",
    image: '',
    name: "Ощлт",
    onboarded: true,
    username: "akul"
  }
]


export const populate = async () => {
  await connectToDb()
  await User.insertMany(mockUsers)
}