import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      role?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
            include: { role: true },
          })

          if (!user || !user.password) return null

          const isValidPassword = await bcrypt.compare(parsed.data.password, user.password)
          if (!isValidPassword) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role?.name ?? "USER",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub
        session.user.role = token.role as string | undefined
      }
      return session
    },
    async authorized({ auth: authState, request }) {
      const isLoggedIn = !!authState?.user
      const { pathname } = request.nextUrl
      const isOnLoginPage = pathname.startsWith("/login")
      const isOnAdminPage = pathname.startsWith("/admin")
      const isPublicPage = ["/", "/frames", "/quests"].some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      )
      const isApiRoute = pathname.startsWith("/api")
      const isStaticAsset = pathname.includes(".")

      if (isApiRoute || isStaticAsset) return true
      if (isLoggedIn && isOnLoginPage) return Response.redirect(new URL("/dashboard", request.nextUrl))
      if (isPublicPage) return true
      if (isOnAdminPage) return isLoggedIn && authState?.user?.role === "ADMIN"
      return isLoggedIn
    },
  },
})
