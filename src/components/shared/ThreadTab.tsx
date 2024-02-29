import { ThreadCard } from '@/components/cards/ThreadCard';
import { IUserWithThreadsRes, ICommunityThreadsRes, IPopulatedThread } from '@/types';
import { fetchCommunityThreads, fetchUserThreads } from '@/services';

interface IThreadTabProps {
  ownerId: string
  accountType: 'community' | 'user'
}
export const ThreadTab = async ({ ownerId, accountType }: IThreadTabProps) => {
  let result: IUserWithThreadsRes | ICommunityThreadsRes | undefined

  if(accountType === 'community') {
    result = await fetchCommunityThreads({ authOrganizationId: ownerId })
  } else {
    result = await fetchUserThreads({userId: ownerId})
  }

  if(!result) return null


  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread) => (
        <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={ownerId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === 'user'
                ? { name: result!.name, image: result!.image, authId: (result as IUserWithThreadsRes).authId }
                : {
                  name: thread.author.name,
                  image: thread.author.image,
                  authId: thread.author.authId
                }
            }
            community={
              accountType === 'community'
                ? {
                  name: result!.name,
                  authOrganizationId: (result as ICommunityThreadsRes).authOrganizationId,
                  image: result!.image
                }
                : (thread as IPopulatedThread).community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
      ))}
    </section>
  )
}