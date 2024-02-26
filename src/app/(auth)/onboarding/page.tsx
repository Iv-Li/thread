import { AccountProfile } from '@/components/forms/AccountProfile';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/services';
import { Pages } from '@/consts';
import { redirect } from 'next/navigation';

export default async function Onboard() {
  const user = await currentUser()
  if (!user || !user?.id) return null

  const userInfo = await fetchUser(user?.id)
  if (userInfo?.onboarded) redirect(Pages.HOME);

  const userData = {
    id: user.id,
    username: userInfo ? userInfo?.username : user.username ?? '',
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-bg-bg-reverse-2'>
        Complete your profile now, to use Threads.
      </p>

      <section className='mt-9 bg-bg-2 p-10'>
        <AccountProfile btnTitle='Continue' user={userData} />
      </section>
    </main>
  );
}
