'use client'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MouseEvent } from 'react';
import { useChangeSearchParams } from '@/lib/utils';

interface IPagination {
  totalPages: number
  activePage: number
  path: string

}

export const Pagination = ({ totalPages, activePage, path }: IPagination) => {
  const router = useRouter()
  const updateSearchParams = useChangeSearchParams()
  const handleNavigation = (type: 'prev' | 'next') => (e: MouseEvent<HTMLButtonElement>) => {

    if(type === 'prev') {
      const updatedParams = updateSearchParams({ query: 'page', value: `${activePage - 1}`, type: 'update' })
      router.push(`${path}?${updatedParams}`)
    }

    if(type === 'next') {
      const updatedParams = updateSearchParams({ query: 'page', value: `${activePage + 1}`, type: 'update' })
      router.push(`${path}?${updatedParams}`)
    }
  }

  return (
    <div className='pagination'>
      <Button
        onClick={handleNavigation('prev')}
        disabled={activePage === 1}
        className='!text-small-regular text-bg-reverse-2'
      >
        Prev
      </Button>
      <p className='text-small-semibold text-bg-reverse-1'>{activePage}</p>
      <Button
        onClick={handleNavigation('next')}
        disabled={activePage === totalPages}
        className='!text-small-regular text-bg-reverse-2'
      >
        Next
      </Button>
    </div>
  )
}