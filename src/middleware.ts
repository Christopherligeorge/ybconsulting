import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/auth-callback'],
}

export default withAuth
//instead of export default authMiddleware we use withAuth 