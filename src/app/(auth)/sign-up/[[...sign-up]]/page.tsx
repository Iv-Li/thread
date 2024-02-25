import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className='mx-auto flex-center max-w-3xl px-10 py-20'>
      <SignUp/>
    </section>
)
  ;
}
