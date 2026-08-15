import { MetadataRoute } from 'next';

const BASE_URL = 'https://smdmedicare.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/checkout/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
