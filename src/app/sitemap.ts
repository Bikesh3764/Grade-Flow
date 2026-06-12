import { MetadataRoute } from 'next';
import { universities } from '@/lib/universities/registry';
import { guideTypes } from '@/lib/guides/content';

const ITEMS_PER_SITEMAP = 2000;

export async function generateSitemaps() {
  const count = Math.ceil(universities.length / ITEMS_PER_SITEMAP);
  return Array.from({ length: count }).map((_, i) => ({ id: i }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const baseUrl = 'https://gradeflow.app';
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

  if (id === 0) {
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
  }

  // Slice the universities for this specific chunk
  const start = id * ITEMS_PER_SITEMAP;
  const end = start + ITEMS_PER_SITEMAP;
  const chunkedUniversities = universities.slice(start, end);

  for (const uni of chunkedUniversities) {
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
