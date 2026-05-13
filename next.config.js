/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    return [
      {
        // Proxy Firebase auth handler through our own domain so signInWithRedirect
        // uses same-origin storage. Without this, Safari ITP blocks cross-origin
        // IndexedDB between firebaseapp.com and this domain, losing the redirect
        // state and breaking sign-in.
        source: '/__/auth/:path*',
        destination: `https://${projectId}.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
