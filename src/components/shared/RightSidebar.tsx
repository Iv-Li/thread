export const RightSidebar = () => {
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-bg-reverse-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {/* TODO: add suggested Communities */}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-bg-reverse-1'>Suggested Users</h3>
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {/* TODO: add suggested Users */}
        </div>
      </div>
    </section>
  )
}