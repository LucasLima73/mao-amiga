import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mao-amiga.site';
  
  // Define all available languages from the i18n configuration
  const languages = ['pt', 'en', 'es', 'fr', 'ar'];
  
  // Define all main pages
  const mainRoutes = [
    '',
    '/trilhaDireitosHumanos',
    '/trilhaDocumentacao',
    '/trilhaSocioeconomica',
    '/chat',
  ];

  // Generate sitemap entries for all pages in all languages
  const sitemap: MetadataRoute.Sitemap = [];

  // Add main routes in all languages
  for (const route of mainRoutes) {
    // Default route (Portuguese)
    sitemap.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
    });
    
    // Routes for other languages
    for (const lang of languages) {
      if (lang !== 'pt') { // Skip Portuguese as it's the default
        sitemap.push({
          url: `${baseUrl}/${lang}${route}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: route === '' ? 0.9 : 0.7,
        });
      }
    }
  }

  return sitemap;
}
