import { useSearchParams } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { redirect } from 'next/navigation'

const Page = async () => {
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

  const searchParams = useSearchParams()
  const origin = searchParams?.get('origin') || '/dashboard'

  return redirect(origin)
}

export default Page