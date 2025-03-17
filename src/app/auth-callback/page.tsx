'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] }
}) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id || !user.email) {
    console.log('No user found in auth-callback, redirecting to sign-in')
    return redirect('/sign-in')
  }

  // Check if user exists in database
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) {
    // Create user in database
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    })
  }

  // Get the origin from the URL search params
  const origin = typeof searchParams?.origin === 'string' 
    ? searchParams.origin 
    : '/dashboard'
    
  return redirect(origin)
}