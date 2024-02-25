import { UserButton } from '@clerk/nextjs';
import { Pages } from '@/consts';

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl={Pages.SIGN_IN}/>
    </div>
  );
}
