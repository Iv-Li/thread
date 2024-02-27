'use client'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ISearchBarProps {
  placeholder: string,
  currentRoute: string
}

export const SearchBar = (props: ISearchBarProps) => {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      router.push(`${props.currentRoute}?search=${search}`)
    }, 300)

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