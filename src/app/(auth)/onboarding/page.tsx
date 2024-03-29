import { AccountProfile } from '@/components/forms/AccountProfile';
import { checkExistedUser } from '@/lib/utils';

export default async function Onboard() {
  const user = await checkExistedUser(false)
  if (!user) return null

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-bg-bg-reverse-2'>
        Complete your profile now, to use Threads.
      </p>

      <section className='mt-9 bg-bg-2 p-10'>
        <AccountProfile btnTitle='Continue' user={user} />
      </section>
    </main>
  );
}
