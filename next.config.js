module.exports = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_SOCKET_IO_URL: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  },
  images: {
    domains: [
      'maps.googleapis.com', 
      'tailwindui.com', 
      'www.thaitravelcenter.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/public/uploads/**',
      },
    ],
    unoptimized: true,
  },
};
