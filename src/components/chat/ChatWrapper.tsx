'use client'

import { trpc } from '@/app/_trpc/client'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'
import { PLANS } from '@/config/stripe'

//import { UploadStatus } from 'path/to/module';


//Purpose of the chatwrapper here is 1. handles all the loading states for us, and all in this one component. 
//2. need context, 3. define the layout of the chat. 

//loading states in the chatwrapper depend on 


interface ChatWrapperProps {
  fileId: string
  isSubscribed: boolean
}


//useQuery isntead of mutation. want the function to trigger as soon as the page loads. 
//need to include refetchinterval that passes in the data, and the api route returns what is accessible in the data. 
//so, poll until the file has a certain status. 
const ChatWrapper = ({
  fileId,
  isSubscribed,
}: ChatWrapperProps) => {
  const { data, isLoading } =
    trpc.getFileUploadStatus.useQuery(
      {
        fileId,
      },
      {
        //stated data:any so it doesnt throw ts2339 error,
        //return (oldObj as any).someProperty;
        refetchInterval: (data:any) =>
          data?.status === 'SUCCESS' ||
          data?.status /*as UploadStatus*/ === 'FAILED'
            ? false
            : 500,
      }
    )

  if (isLoading)
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
            <p className='text-zinc-500 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'PROCESSING')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Processing PDF...
            </h3>
            <p className='text-zinc-500 text-sm'>
              This won&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'FAILED')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <h3 className='font-semibold text-xl'>
              Too many pages in PDF
            </h3>
            <p className='text-zinc-500 text-sm'>
              Your{' '}
              <span className='font-medium'>
                {isSubscribed ? 'Pro' : 'Free'}
              </span>{' '}
              plan supports up to{' '}
              {isSubscribed
                ? PLANS.find((p) => p.name === 'Pro')
                    ?.pagesPerPdf
                : PLANS.find((p) => p.name === 'Free')
                    ?.pagesPerPdf}{' '}
              pages per PDF.
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}>
              <ChevronLeft className='h-3 w-3 mr-1.5' />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 justify-between flex flex-col mb-28'>
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper