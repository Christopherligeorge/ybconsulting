import Dashboard from '@/components/Dashboard'
import { db } from '@/db'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
    //get the current login status/session of the user 
  const { getUser } = getKindeServerSession()

  //needs to be await, because variable 'user' is a promise that resolves to a kindeuser object or null, but not the object itself. 
  const user = await getUser()

  //have to sync user to the db, make sure that it is a user in the DB
 

  //if user not logged in, nextredirects right back to where they where
  //user directed to dashboard,
  // if logged in then can use services, if not, syncs user to the database. 
  //if not, that means its new user and user synced to db in auth-callback

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id
    }
  })

  if(!dbUser) redirect('/auth-callback?origin=dashboard')

  const subscriptionPlan = await getUserSubscriptionPlan()

  return <Dashboard subscriptionPlan={subscriptionPlan} />
}

export default Page


 // Usually, webhooks are used to sync users to a database. 
  //user logs in to kinde, kinde returns jwt to user verifying login, while sending webhook to our app telling it user logged in. 
  //app then goes to database, and syncs. 