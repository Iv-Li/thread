import { ThreadCard } from '@/components/cards/ThreadCard';
import { checkExistedUser } from '@/lib/utils';
import { getThreadById } from '@/services/thread';

export default async function Thread ( { params } : {params:  { id: string } }) {
  const user = await checkExistedUser()
  const thread = await getThreadById(params.id)

  if(!user || !thread) {
    return <>Thread not found</>
  }

  return (
    <>
      <ThreadCard
        id={thread._id}
        currentUserId={user?.authId}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        isComment
      />
    </>
  )
}