/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['s3.amazonaws.com', 'images.unsplash.com', 'assets.aceternity.com', 'hespruce.com', 'lh3.googleusercontent.com'],
  },

  async headers() {
    return [
      {
        source: "/api/:path*", // Match all API routes
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Change this to your specific domain if needed
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
