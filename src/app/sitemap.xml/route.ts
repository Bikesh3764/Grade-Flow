import { NextResponse } from 'next/server';
import { universities } from '@/lib/universities/registry';
import { guideTypes } from '@/lib/guides/content';

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

function getUrlsCount(): number {
  let count = 3; // core pages
  count += 5; // static pages
  count += guideTypes.length;
  count += pageTypes.length;
  
  for (const uni of universities) {
    const slugPrefix = uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id;
    count += pageTypes.length;
    if (slugPrefix !== uni.id) {
      count += pageTypes.length;
    }
  }
  return count;
}

export async function GET() {
  const totalUrls = getUrlsCount();
  const totalSitemaps = Math.ceil(totalUrls / URLS_PER_SITEMAP);

  let sitemapIndexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapIndexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (let i = 0; i < totalSitemaps; i++) {
    sitemapIndexXml += `  <sitemap>\n    <loc>${baseUrl}/sitemap/${i}.xml</loc>\n  </sitemap>\n`;
  }

  sitemapIndexXml += '</sitemapindex>';

  return new NextResponse(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate'
    }
  });
}
