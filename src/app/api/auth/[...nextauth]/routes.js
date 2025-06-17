import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../lib/prisma";  // Verifique o caminho correto do prisma
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),  // Usando PrismaAdapter
  session: {
    strategy: "jwt",  // Usando JWT para gerenciar a sessão
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais", // Usando o provedor de credenciais
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Verifica se o usuário existe
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("❌ Usuário não encontrado");
            return null;
          }

          // Verifica se a senha é válida
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.log("❌ Senha incorreta");
            return null;
          }

          // Retorna as informações do usuário
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            whatsapp: user.whatsapp,
          };
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Configuração do JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.whatsapp = user.whatsapp;
      }
      return token;
    },
    // Configuração da sessão
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.whatsapp = token.whatsapp;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",  // Nome do cookie de sessão
      options: {
        httpOnly: true,  // Garante que o cookie não seja acessível via JavaScript
        sameSite: "lax",  // Protege contra CSRF
        path: "/",  // Cookie estará disponível para todo o site
        secure: process.env.NODE_ENV === "production",  // Define secure em produção
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  // Chave secreta
};

export default NextAuth(authOptions);
