import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SALT_ROUND,
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });

        if (
          !existingUser ||
          !(await compare(credentials.password, existingUser.password))
        ) {
          return null;
        }

        return {
          id: String(existingUser.id),
          username: existingUser.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if(account){
        token.id = user.id
      }
      if (user) {
        return {
          ...token,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {  
        ...session,
        user: {
          ...session.user,
          username: token.username,
          id: token.id
        },
      };
    },
  },
};

export default NextAuth(authOptions);
