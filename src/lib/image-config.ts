// Image optimization settings
export const IMAGE_CONFIG = {
  quality: 80,
  formats: ['webp', 'avif'] as const,
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  minimumCacheTTL: 60,
};
// WebP format delivery
