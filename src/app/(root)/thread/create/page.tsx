import { checkExistedUser } from '@/lib/utils';
import { ThreadForm } from '@/components/forms/ThreadForm';

export default async function CreateThread () {
  const user = await checkExistedUser()
  if(!user) return null

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>
      <ThreadForm authorId={user.authId}/>
    </>
  )
}