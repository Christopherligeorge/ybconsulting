"use client"

//it is a client component that executes client side because we use hooks such as useSearchParams/useRouter

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'
import { error } from 'console'
import router from 'next/router'
import { useEffect } from 'react'
import {useQuery} from 'react-query'

//only purpose of the page is to make sure user is synced to the database! 

const Page = () => {
  //router from nextnavigation not nextrouter.
  //trpc makes backend type safety automatic. 
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')


  //onsettled vs onsuccess property sometimes
/*
  trpc.authCallback.useQuery(undefined);
  
    useEffect(()=>{ 
      //error code unauthorized
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')}
      else if(!isLoading){
        router.push(origin ? `/${origin}` : '/dashboard')
      }


    })
    
    
    ({ data,error}) => {
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
  
  
  1. onsuccess has no overload that matches 
  2.binding element success implicity has any type, as well as err*/


//can trigger the onSuccess side-effects from inside the query function as well, like this:
/*
async function fetchPosts() {
    const resp = await axios.get<TPost[]>("/postss");
    yourSideEffect();
    return resp.data;
  }
  const query = useQuery(["posts"], fetchPosts); */
  

  async function authCallback() {

    try{
    // Simulate an API call
    const response = await { data: { success: true } }; // Simulated response without using axios.get
  
    if (response.data.success) {
      // Trigger onSuccess side-effect
      router.push(origin ? `/${origin}` : '/dashboard');
    } else {
      throw new Error('UNAUTHORIZED'); // This will be caught by onError
    }
    return response.data;
  }

    catch (err:any) {
      if (err.message === 'UNAUTHORIZED') {
        // Trigger onError side-effect
        router.push('/sign-in');
      }
      throw err; // Re-throw the error for the query to handle it if needed
    }
  }

  const { isError, error, data, refetch, isFetching } = trpc.authCallback.useQuery(undefined, {
    queryFn: authCallback,
    retry: true,
    retryDelay: 500,
  });
  


/*
 trpc.authCallback.useQuery(undefined, {
    onSuccess: (data:{success:boolean}) => {
      if (data.success) {
        // user is synced to db
        router.push(origin ? `/${origin}` : '/dashboard')
      }
    },
    onError: (err:any) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  }) */

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