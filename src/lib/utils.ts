import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/services';
import { redirect } from 'next/navigation';
import { Pages } from '@/consts';
import { IUserRes } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkExistedUser = async (): Promise<Pick<IUserRes, 'username' | 'name' | 'bio' | 'image' | 'authId'> | null> => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect(Pages.ONBOARDING);

  const userData = {
    authId: user.id,
    username: userInfo ? userInfo?.username : user.username ?? '',
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl
  }

  return userData
}