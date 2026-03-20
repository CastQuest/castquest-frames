import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { z } from "zod"

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
        
        if (!parsed.success) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
            include: { role: true },
          })

          if (!user) {
            return null
          }

          // TODO: In production, use bcrypt to verify password
          // const isValidPassword = await bcrypt.compare(parsed.data.password, user.password)
          // if (!isValidPassword) return null
          
          // For demo/development ONLY - accept password if it matches or if no password is set
          // This will NOT run in production mode for security
          if (process.env.NODE_ENV === "production") {
            // In production, require proper password verification
            // For now, reject all logins until bcrypt is implemented
            console.error("Password verification not implemented. Implement bcrypt before production use.")
            return null
          }
          
          if (user.password && user.password !== parsed.data.password) {
            // In development, this is plain-text comparison
            return null
          }

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
        session.user.role = token.role
      }
      return session
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = request.nextUrl.pathname.startsWith("/login")
      const isOnAdminPage = request.nextUrl.pathname.startsWith("/admin")
      const isPublicPage = ["/", "/frames", "/quests"].some(path => 
        request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/")
      )
      const isApiRoute = request.nextUrl.pathname.startsWith("/api")
      const isStaticAsset = request.nextUrl.pathname.includes(".")

      // Allow API routes and static assets
      if (isApiRoute || isStaticAsset) {
        return true
      }

      // Redirect logged-in users away from login page
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL("/dashboard", request.nextUrl))
      }

      // Allow public pages
      if (isPublicPage) {
        return true
      }

      // Admin pages require ADMIN role
      if (isOnAdminPage) {
        return isLoggedIn && auth?.user?.role === "ADMIN"
      }

      // Protected pages require authentication
      return isLoggedIn
    },
  },
})
