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
        try {
          const response = await BaseRequest.Post("/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response && response.token) {
            return { ...response, token: response.token };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Invalid email or password");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        try {
          const response = await BaseRequest.Post("/api/Auth/google-login", {
            credential: profile.sub, // Google User ID
            roleId: 0, // Mặc định gửi roleId nếu backend yêu cầu
          });

          if (response && response.token) {
            return { ...response, token: response.token };
          } else {
            throw new Error("Google login failed");
          }
        } catch (error) {
          console.error("Google Login Error:", error);
          throw new Error("Google authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/authen/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
