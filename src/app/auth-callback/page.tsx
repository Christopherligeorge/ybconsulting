'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Record<string, never>
  searchParams: { [key: string]: string | string[] | undefined }
}

async function Page({ searchParams }: PageProps) {
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

  const originParam = searchParams?.origin
  const origin = typeof originParam === 'string' ? originParam : '/dashboard'
  return redirect(origin)
}

export default Page