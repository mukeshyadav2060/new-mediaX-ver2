/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  agentRules: false,
  // This app sits inside the old site's folder; keep it to its own lockfile.
  turbopack: { root: __dirname },
}
