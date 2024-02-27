'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ThreadValidation } from '@/lib/validations';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createThread } from '@/services/thread';
import { usePathname } from 'next/navigation';

export const ThreadForm = ({ authorId }: { authorId: string }) => {
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      authorId
    }
  })

  const pathname = usePathname()

  const onSubmit: SubmitHandler<z.infer<typeof ThreadValidation>> = async (value) => {
    /* TODO: add community id from clerk */
    const data = {
      text: value.thread,
      author: value.authorId,
      path: pathname
    }
    await createThread(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-bg-reverse-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-bg-3 text-bg-reverse-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500 ml-auto mr-0 flex max-w-max mt-3'>
          Post Thread
        </Button>
      </form>
    </Form>
  )
}