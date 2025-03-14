import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/app/_trpc'


//the angle brackets are a dynamic catch all folder. 
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }