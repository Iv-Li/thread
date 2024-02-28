'use client'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface ISearchBarProps {
  placeholder: string,
  search?: string
}

export const SearchBar = (props: ISearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(props.search || searchParams.get('search') || '')

  useEffect(() => {
    let debounce: NodeJS.Timeout | undefined

    if(searchParams.get('search') !== search) {
      debounce = setTimeout(() => {
        router.push(`${pathname}?search=${search}`)
      }, 300)
    }

    return () => clearTimeout(debounce)
  }, [search])

  return (
    <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={props.placeholder}
        className='no-focus searchbar_input'
      />
    </div>
  )
}