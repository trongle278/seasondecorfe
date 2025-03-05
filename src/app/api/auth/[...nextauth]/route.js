import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import BaseRequest from "../../../lib/api/config/Axios-config";

export const authOptions = {
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await BaseRequest.Post(`/api/Auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          console.log("API Response:", response);


          return {
            accessToken: response.token,
            roleId: response.roleId,
            accountId: response.accountId,
          };
        } catch (error) {
          console.error("Login error:", error?.response?.data || error.message);
          throw new Error(error?.response?.data?.message || "Login failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      //console.log("Google data:", account )
      try {
        if (user) {
          // ✅ Save credentials login token
          token.accessToken = user.accessToken;
          token.roleId = user.roleId;
          token.accountId = user.accountId !== undefined ? user.accountId : null;
        }
        if (account?.id_token) {
          console.log("Google Login Token:", account.id_token);
          const response = await BaseRequest.Post("/api/Auth/google-login", {
            idToken: account.id_token,
          });

          if (!response?.success || !response.token) {
            throw new Error("Google login failed.");
          }

          token.accessToken = response.token;
          token.roleId = response.roleId;
          token.accountId = response.accountId !== undefined ? response.accountId : null;
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken || null; // Store accessToken in session
      session.roleId = token.roleId || null; // Store roleId in session
      session.accountId = token.accountId !== undefined ? token.accountId : null;

      if (!session.accessToken) {
        session.error = "There is problem with our sever.";
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
