try {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch {
  // Allow local development before Cloudflare dependencies are installed.
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/spring-into-service', destination: '/dog-poop-cleanup', permanent: true },
      { source: '/fr/printemps-en-service', destination: '/fr/ramassage-dejections', permanent: true },
    ];
  },
};

export default nextConfig;
