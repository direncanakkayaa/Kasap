import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Giriş Yap",
      credentials: {
        phone: { label: "Telefon No", type: "text", placeholder: "05XX1234567" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        
        // Clean phone number input
        const cleanPhone = credentials.phone.replace(/[^0-9]/g, '');

        const user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
        if (!user || !user.passwordHash) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          role: user.role 
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "kasap_secret_key_123456",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
