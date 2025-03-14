import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    console.log('No authenticated user found, redirecting to auth-callback')
    redirect('/auth-callback?origin=/dashboard')
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  })

  if (!dbUser) {
    console.log('User not found in database, redirecting to auth-callback')
    redirect('/auth-callback?origin=/dashboard')
  }

  return <Dashboard />
}


 // Usually, webhooks are used to sync users to a database. 
  //user logs in to kinde, kinde returns jwt to user verifying login, while sending webhook to our app telling it user logged in. 
  //app then goes to database, and syncs. 