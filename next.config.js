/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["raw.githubusercontent.com"],
    unoptimized: true, // Required for static export
  },
  experimental: {
    esmExternals: "loose",
  },
  // Enable static export for Netlify deployment
  output: "export",
  // Disable server-side features that don't work with static export
  trailingSlash: true,
  distDir: "out", // Output to 'out' directory instead of '.next'
};

export default config;
