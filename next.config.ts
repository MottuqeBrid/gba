import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["img.daisyui.com"],
    remotePatterns: [
      {
        protocol: "https", // Enforces HTTPS for security
        hostname: "**", // Allows any domain
        port: "",
        pathname: "**", // Allows any path
      },
    ],
  },
};

export default nextConfig;
