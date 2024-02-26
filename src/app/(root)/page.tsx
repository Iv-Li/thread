import { UserButton } from '@clerk/nextjs';
import { Pages } from '@/consts';
import { fetchUser } from '@/services';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect(Pages.ONBOARDING);

  return (
    <div>
      <UserButton afterSignOutUrl={Pages.SIGN_IN}/>
    </div>
  );
}
