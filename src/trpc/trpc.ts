import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'

//auth procedure, only someone who is authenticated can call and use
const t = initTRPC.create()
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  //takes context(ctx) and returns it 
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  })
})

//publicprocedure allows anyone, regardless of authentication, to access.
//can destructure from the context. whatever we pass into context middleware we can access in index.ts and in our api. 
export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)