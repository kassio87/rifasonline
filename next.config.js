/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuração para permitir imagens de domínios externos se necessário
  images: {
    domains: [],
  },
  
  // Redirecionamentos para o Install Wizard se não estiver instalado
  async redirects() {
    return [
      {
        source: '/',
        destination: '/install',
        permanent: false,
        has: [
          {
            type: 'query',
            key: 'not-installed',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
