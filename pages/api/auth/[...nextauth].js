import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// import GithubProvider from "next-auth/providers/github";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            /**
             * !! Google only provides Refresh Token to an application the first time a user signs in. !!
             * If you need access to the RefreshToken or AccessToken for a Google account
             * and you are not using a database to persist user accounts,
             * this may be something you need to do.
             */
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        // ...add more providers here
        // GithubProvider({
        // 	clientId: process.env.GITHUB_ID,
        // 	clientSecret: process.env.GITHUB_SECRET,
        // }),
    ],
    secret: process.env.JWT_SECRET,

    // session: {
    // 	strategy: "jwt",
    // 	maxAge: 2 * 24 * 60 * 60, // 2 days
    // 	updateAge: 24 * 60 * 60, // 24 hours
    // },
    // jwt: {
    // 	secret: process.env.JWT_SECRET,
    // 	maxAge: 2 * 24 * 60 * 60,
    // 	async encode({ secret, token, maxAge }) {},
    // 	async decode({ secret, token }) {},
    // },

    /**
     * CUSTOM PAGES:
     */
    //  pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //   },

    // callbacks: {
    //     async signIn({ user, account, profile, email, credentials }) {
    //       return true
    //     },
    //     async redirect({ url, baseUrl }) {
    //       return baseUrl
    //     },
    //     async session({ session, token, user }) {
    //       return session
    //     },
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //       return token
    //     }
    //   }
});
