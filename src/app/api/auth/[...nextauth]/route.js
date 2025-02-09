import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import BaseRequest from "../../../lib/api/config/Axios-config";
import jwt from "jsonwebtoken"; 

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
        
          if (response?.token) {
            // Giải mã JWT token
            const decoded = jwt.decode(response.token);
            console.log("Decoded JWT Token:", decoded); // Log thông tin người dùng từ token
        
            // Trả về thông tin người dùng và token để sử dụng trong NextAuth
            return { 
              email: decoded?.email, 
              name: decoded?.name, 
              role: decoded?.role,
              id: decoded?.id, // Thêm ID vào
              token: response.token 
            };
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
            credential: profile.sub,
            roleId: 0, // Nếu backend yêu cầu roleId
          });

          if (response?.token) {
            // 🔥 Giải mã token của Google để lấy thông tin user
            const decodedToken = jwt.decode(response.token);

            if (!decodedToken) throw new Error("Invalid token");

            return {
              email: decodedToken?.email,
              name: decodedToken?.name,
              role: decodedToken?.role,
              id: decodedToken?.id, // Thêm ID vào
              accessToken: response.token, // Lưu access token vào
            };
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
        token.accessToken = user.accessToken; // Lưu accessToken vào JWT
        token.user = user; // Lưu toàn bộ thông tin user vào token
        token.id = user.id; // Lưu ID vào token
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken; // Truy xuất accessToken từ JWT
      session.user = token.user; // Thêm user vào session để frontend có thể truy xuất
      session.user.id = token.id; // Thêm ID vào session
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Đảm bảo bảo mật
  session: {
    strategy: "jwt", // Dùng JWT thay vì session trên server
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
