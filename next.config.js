/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [
    'page.tsx', 
    'api.ts', 
    'api.tsx',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: {
    buildActivity: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/seguranca', // automatically handles all locales
        destination: '/Seguranca/Departamentos', // automatically passes the locale on
        locale: false,
        permanent: false,
      },     
    ]
  },
}

module.exports = nextConfig
