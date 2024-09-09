module.exports = {
    env: {
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    images: {
      domains: [
        'maps.googleapis.com', 
        'tailwindui.com', 
        'www.thaitravelcenter.com'
      ],
      unoptimized: true,
    },
  };
  