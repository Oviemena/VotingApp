// export const dynamic = 'force-dynamic'

/**
 *  An array of routes that are accessible to the public
 * Thses routes do not require authentication
 * @type { string[]}
 */

export const publicRoutes: string[] = [
    '/auth/login',
    '/auth/register',
    // '/auth/new-verification'
]


/**
 *  An array of routes that are used for authentication
 * Thses routes will redirect logged in users to the homepage
 * @type { string[]}
 */ 
export const authRoutes: string[] = [
    '/auth/login',
   
]


/**
 *  The default redirect after logging in
 * @type { string }
 */ 
export const DEFAULT_LOGIN_REDIRECT: string = '/'
