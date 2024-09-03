import PostgresAdapter from '@auth/pg-adapter';
import ky from 'ky';
import NextAuth, { AuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import { Pool } from 'pg';

type UserCreateResponseData = {
  status: string;
};

const pool = new Pool({
  host: process.env.STEAGO_DATABASE_HOST,
  user: process.env.STEAGO_DATABASE_USER,
  password: process.env.STEAGO_DATABASE_PASSWORD,
  database: process.env.STEAGO_DATABASE_NAME,
  port: parseInt(process.env.STEAGO_DATABASE_PORT ?? '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Post-sign-in logic
      // console.log('User signed in:', user);
      const superAdminEmails = JSON.parse(
        process.env.STEAGO_SUPER_ADMIN_EMAILS ?? '[]'
      );

      // Inform API to create a new user if needed
      const userCreateResponse: UserCreateResponseData = await ky
        .post(
          `${process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL}/platform/auth/user`,
          {
            json: {
              ...user,
              isSuperAdmin: superAdminEmails.includes(user.email),
            },
          }
        )
        .json();

      if (userCreateResponse.status === 'success') {
        return true; // Return true to continue sign-in, false to abort
      } else {
        return false;
      }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      const superAdminEmails = JSON.parse(
        process.env.STEAGO_SUPER_ADMIN_EMAILS ?? '[]'
      );
      // session.user.
      return {
        ...session,
        user: {
          ...session.user,
          isSuperAdmin: superAdminEmails.includes(session.user?.email),
        },
      };
    },
  },
  pages: {
    // signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '#119746', // Hex color code
    logo: '/images/steago-logo.png', // Absolute URL to image
    // buttonText: "", // Hex color code for button text
  },
};
export default NextAuth(authOptions);
