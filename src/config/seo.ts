export const SEO = {
  siteName: 'DHV-Lingoo',
  siteUrl: 'https://dhv-lingoo.vercel.app',
  description: 'Nen tang hoc tieng Anh thong minh',
  ogImage: '/og-image.png',
  locale: 'vi_VN',
} as const;

export function generatePageMeta(title: string, description?: string) {
  return {
    title: title + ' | ' + SEO.siteName,
    description: description || SEO.description,
  };
}