import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access to Next.js HMR /dev assets (e.g. phone or another device).
  allowedDevOrigins: ["192.168.178.25"],
};

export default nextConfig;
