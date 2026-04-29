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
};

export default nextConfig;
