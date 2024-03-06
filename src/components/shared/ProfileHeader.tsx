import Image from 'next/image';
import Link from 'next/link';
import { Pages } from '@/consts';

interface IProfileHeader {
  currentUserId: string
  authUserId: string
  name: string
  username: string
  imgUrl: string
  bio: string
  type?: 'community' | 'user'
}

export const ProfileHeader = ({ currentUserId, authUserId, name, username, imgUrl, bio, type }: IProfileHeader) => {
  return (
    <div className='flex w-full flex-col justify-start'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={imgUrl}
              alt='logo'
              fill
              sizes="100%"
              className='rounded-full object-cover shadow-2xl'
            />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-bg-reverse-1'>
              {name}
            </h2>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>
        {currentUserId === authUserId && type !== "community" && (
          <Link href={`${Pages.PROFILE}/edit`}>
            <div className='flex cursor-pointer gap-3 rounded-lg bg-bg-3 px-4 py-2'>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={16}
                height={16}
              />

              <p className='text-bg-reverse-2 hidden md:block'>Edit</p>
            </div>
          </Link>
        )}
      </div>

      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

      <div className='mt-12 h-0.5 w-full bg-dark-3'/>
    </div>
  )
}