import { UserButton } from '@clerk/nextjs';
import { Pages } from '@/consts';
import { checkExistedUser } from '@/lib/utils';

export default async function Home() {
  const user = await checkExistedUser()
  if (!user) return null

  return (
    <div>
      <UserButton afterSignOutUrl={Pages.SIGN_IN}/>
    </div>
  );
}
