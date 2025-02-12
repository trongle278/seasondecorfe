import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import BaseRequest from "../../../lib/api/config/Axios-config";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const response = await BaseRequest.Post("/api/Auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response?.message) {
            throw new Error(response.message);
          }

          return response || null;
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.id_token) {
        try {
          const response = await BaseRequest.Post("/api/Auth/google-login", {
            idToken: account.id_token,
          });

          if (response?.success && response.token) {
            token.accessToken = response.token; // Store backend's token
          } else {
            throw new Error(response?.message || "Google login failed.");
          }
        } catch (error) {
          console.error("Google Login Error:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken || null; // Store accessToken in session
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
