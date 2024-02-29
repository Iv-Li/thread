'use client'
import { Pages } from '@/consts';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ICardButton {
  isCommunity: boolean
  pathId: string
  className?:string
}
export const CardButton = ({ isCommunity, pathId, className }: ICardButton) => {
  const router = useRouter()

  return (
    <Button
      className={cn([className])}
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