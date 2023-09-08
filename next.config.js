const siteUrl = new URL(process.env.NEXT_PUBLIC_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: siteUrl.protocol.slice(0, -1), hostname: siteUrl.hostname },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "**.scdn.co" },
      { protocol: "https", hostname: "**.spotifycdn.com" },
    ],
  },
};

module.exports = nextConfig;
