"use client"

//it is a client component that executes client side because we use hooks such as useSearchParams/useRouter

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

//only purpose of the page is to make sure user is synced to the database! 

const Page = () => {
  //router from nextnavigation not nextrouter.
  //trpc makes backend type safety automatic. 
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')


  //onsettled vs onsuccess property sometimes

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ data,error}) => {
      if (data?.success) {
        // user is synced to db
        router.push(origin ? `/${origin}` : '/dashboard')
      }
      else if (error?.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  })
  
  /*
  1. onsuccess has no overload that matches 
  2.binding element success implicity has any type, as well as err
  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // user is synced to db
        router.push(origin ? `/${origin}` : '/dashboard')
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  })*/

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page