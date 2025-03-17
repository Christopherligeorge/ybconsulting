import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { redirect } from 'next/navigation'

export default async function Page() {
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

  // Default to dashboard if no origin is specified
  return redirect('/dashboard')
}