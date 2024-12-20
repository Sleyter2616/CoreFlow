import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workouts/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
}
