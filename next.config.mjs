/** @type {import('next').NextConfig} */

//need custom webpack in nextConfig to render pdfs(b/c cant render like images.)
const nextConfig = {
  
  images: {
    domains: ['gravatar.com'],
  },
    async redirects() {
      return [
        {
          source: '/sign-in',
          destination: '/api/auth/login',
          permanent: true,
        },
        {
          source: '/sign-up',
          destination: '/api/auth/register',
          permanent: true,
        },
      ];
    },
  
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, webpack }
    ) => {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      return config;
    },
  };
  
  export default nextConfig;