import Link from 'next/link';
import Image from 'next/image';
import {  SignedIn, SignOutButton } from '@clerk/nextjs';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const Topbar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/logo.svg' alt='logo' width={28} height={28}/>
        <p className='text-heading3-bold text-bg-reverse-1 hidden sm:block'>Threads</p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* TODO: fix visibility of switcher btn */}
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
        }} />
      </div>
    </nav>
  )
}