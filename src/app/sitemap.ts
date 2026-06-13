import { MetadataRoute } from 'next';
import { universities } from '@/lib/universities/registry';
import { guideTypes } from '@/lib/guides/content';

export default function sitemap(): MetadataRoute.Sitemap {
  // Uses your environment variable, or defaults to cgpacalculator.xyz
  const baseUrl = 'https://cgpacalculator.xyz';
  const sitemapUrls: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // Core Pages
  const pageTypes = [
    "cgpa-calculator",
    "sgpa-calculator",
    "cgpa-to-percentage",
    "percentage-to-cgpa-calculator",
    "sgpa-to-cgpa-calculator",
    "gpa-to-cgpa-calculator",
    "marks-to-cgpa-calculator",
    "grade-calculator",
    "grading-system"
  ];

  sitemapUrls.push({
    url: `${baseUrl}/`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1,
  });

  sitemapUrls.push({
    url: `${baseUrl}/dashboard`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  sitemapUrls.push({
    url: `${baseUrl}/university-hub`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // New MPA Legal & Contact Pages
  const staticPages = ['privacy-policy', 'terms-and-conditions', 'faq', 'contact', 'help-center'];
  for (const page of staticPages) {
    sitemapUrls.push({
      url: `${baseUrl}/${page}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Informational Guides
  for (const guide of guideTypes) {
    sitemapUrls.push({
      url: `${baseUrl}/${guide}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Generic Tools
  for (const type of pageTypes) {
    sitemapUrls.push({
      url: `${baseUrl}/${type}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Generate for ALL universities (~9,000 links total, well under Google's 50,000 limit)
  for (const uni of universities) {
    const slugPrefix = uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id;
    for (const type of pageTypes) {
      sitemapUrls.push({
        url: `${baseUrl}/${slugPrefix}-${type}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      // Optionally index the ID one if it differs
      if (slugPrefix !== uni.id) {
        sitemapUrls.push({
          url: `${baseUrl}/${uni.id}-${type}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return sitemapUrls;
}
