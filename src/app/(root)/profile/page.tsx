import { checkExistedUser } from '@/lib/utils'
import { ProfileData } from '@/components/shared/ProfileData'

export default async function Profile () {
  const user = await checkExistedUser()
  if(!user) return null

  return (
    <ProfileData currentUser={user} userId={user.authId}/>
  )
}