import { checkExistedUser } from '@/lib/utils';
import { fetchUsers } from '@/services';
import { SortOrder } from 'mongoose';
import { UserCard } from '@/components/cards/UserCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { Pagination } from '@/components/shared/Pagination';
import { Pages } from '@/consts';

interface SearchParams {
  search: string
  page: string
  perPage: string
  sortBy: SortOrder
}

export default async function Search ({ searchParams }: { searchParams: SearchParams }) {
  const currentUser = await checkExistedUser()
  if (!currentUser) return null

  const result = await fetchUsers({
    currentUserId: currentUser.authId,
    searchString: searchParams.search,
    pageNumber: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: 1,
    sortBy: 'desc'
  })

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>

      <SearchBar placeholder='Search user' search={searchParams.search} />

      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.users.map((u) => (
              <UserCard
                key={u.authId}
                id={u.authId}
                name={u.name}
                username={u.username}
                imgUrl={u.image}
                personType='user'
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        totalPages={Number(result.totalPages)}
        activePage={Number(result.page)}
        path={Pages.SEARCH}
      />
    </section>
  )
}