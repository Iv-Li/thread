'use client'
import { Pages } from '@/consts';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface IUserCardButton {
  isCommunity: boolean
  pathId: string
}
export const UserCardButton = ({ isCommunity, pathId }: IUserCardButton) => {
  const router = useRouter()
  return (
    <Button
      className='user-card_btn'
      onClick={() => {
        if (isCommunity) {
          router.push(`${Pages.COMMUNITIES}/${pathId}`);
        } else {
          router.push(`${Pages.PROFILE}/${pathId}`);
        }
      }}
    >
      View
    </Button>
  )
}