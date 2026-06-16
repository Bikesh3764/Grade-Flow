import { NextResponse } from 'next/server';
import { universities } from '@/lib/universities/registry';
import { guideTypes } from '@/lib/guides/content';

export const runtime = 'edge';

const baseUrl = 'https://cgpacalculator.xyz';
const URLS_PER_SITEMAP = 1000;

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

function getAllUrls() {
  const sitemapUrls: any[] = [];
  const currentDate = new Date().toISOString();

  // Core Pages
  sitemapUrls.push({ url: `${baseUrl}/`, lastmod: currentDate, changefreq: 'weekly', priority: 1 });
  sitemapUrls.push({ url: `${baseUrl}/dashboard`, lastmod: currentDate, changefreq: 'weekly', priority: 0.9 });
  sitemapUrls.push({ url: `${baseUrl}/university-hub`, lastmod: currentDate, changefreq: 'weekly', priority: 0.9 });

  // Static Pages
  const staticPages = ['privacy-policy', 'terms-and-conditions', 'faq', 'contact', 'help-center'];
  for (const page of staticPages) {
    sitemapUrls.push({ url: `${baseUrl}/${page}`, lastmod: currentDate, changefreq: 'monthly', priority: 0.6 });
  }

  // Informational Guides
  for (const guide of guideTypes) {
    sitemapUrls.push({ url: `${baseUrl}/${guide}`, lastmod: currentDate, changefreq: 'monthly', priority: 0.8 });
  }

  // Generic Tools
  for (const type of pageTypes) {
    sitemapUrls.push({ url: `${baseUrl}/${type}`, lastmod: currentDate, changefreq: 'monthly', priority: 0.8 });
  }

  // Universities
  for (const uni of universities) {
    const slugPrefix = uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id;
    for (const type of pageTypes) {
      sitemapUrls.push({
        url: `${baseUrl}/${slugPrefix}-${type}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      });
      if (slugPrefix !== uni.id) {
        sitemapUrls.push({
          url: `${baseUrl}/${uni.id}-${type}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        });
      }
    }
  }

  return sitemapUrls;
}

export async function generateStaticParams() {
  const allUrls = getAllUrls();
  const totalSitemaps = Math.ceil(allUrls.length / URLS_PER_SITEMAP);
  const params = [];
  for (let i = 0; i < totalSitemaps; i++) {
    params.push({ filename: `${i}.xml` });
  }
  return params;
}

export async function GET(
  request: Request,
  props: { params: Promise<{ filename: string }> }
) {
  const { filename } = await props.params;

  // Expect filename like "0.xml", "1.xml", etc.
  if (!filename.endsWith('.xml')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const idStr = filename.replace('.xml', '');
  const id = parseInt(idStr, 10);

  if (isNaN(id) || id < 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const allUrls = getAllUrls();
  const start = id * URLS_PER_SITEMAP;
  const end = start + URLS_PER_SITEMAP;

  if (start >= allUrls.length) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const chunk = allUrls.slice(start, end);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of chunk) {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate'
    }
  });
}
