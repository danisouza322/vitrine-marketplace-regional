import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../../../../lib/db';
import { users } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

// Adicionar tipagem customizada para o User
interface CustomUser {
  id: string;
  email: string;
  role: string;
  tenant_id?: string;
}

export const authOptions: NextAuthOptions = {
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
        if (!user || !user.password_hash) return null;
        const valid = await compare(credentials.password, user.password_hash);
        if (!valid) return null;
        return { 
          id: user.id, 
          email: user.email, 
          role: user.role || 'tenant', 
          tenant_id: user.tenant_id 
        } as CustomUser;
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: any }) {
      if (user) {
        // O cast para CustomUser nos permite acessar role e tenant_id
        const customUser = user as CustomUser;
        token.role = customUser.role;
        token.tenant_id = customUser.tenant_id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.tenant_id = token.tenant_id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Garantir que o redirecionamento funcione corretamente
      if (url.startsWith('/')) {
        // URL relativa - adicionar baseUrl
        return `${baseUrl}${url}`
      } else if (new URL(url).origin === baseUrl) {
        // URL interna - manter como está
        return url
      }
      // URL externa - redirecionar para painel por padrão
      return `${baseUrl}/painel`
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 