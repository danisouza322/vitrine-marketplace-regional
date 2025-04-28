import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../../../../lib/db';
import { users } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).then(res => res[0]);
        if (!user) return null;
        const valid = await compare(credentials.password, user.password_hash);
        if (!valid) return null;
        return { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenant_id = user.tenant_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.tenant_id = token.tenant_id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST }; 