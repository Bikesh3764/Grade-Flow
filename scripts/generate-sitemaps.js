/**
 * Static Sitemap Generator
 * 
 * Generates a single, clean static sitemap.xml into public/ at build time.
 * Total URLs: ~9,127 (well within Google's 50,000 URL / 50 MB limit per file).
 * Served directly as a static CDN asset by Cloudflare — zero worker overhead.
 */

const fs = require('fs');
const path = require('path');

// Load university data directly from JSON
const registryPath = path.join(__dirname, '..', 'data', 'universities', 'registry.json');
const universities = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

// Guide types (must match src/lib/guides/content.tsx)
const guideTypes = [
  "what-is-cgpa",
  "how-to-calculate-cgpa",
  "how-to-calculate-sgpa",
  "cgpa-vs-gpa",
  "cgpa-to-percentage-formula",
  "percentage-to-cgpa-formula",
  "what-is-sgpa",
  "is-8-cgpa-good",
  "is-9-cgpa-good",
  "cgpa-for-placements",
  "cgpa-for-higher-studies"
];

// Page types
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

const baseUrl = 'https://cgpacalculator.xyz';

function getAllUrls() {
  const urls = [];
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Core Pages
  urls.push({ loc: `${baseUrl}/`, lastmod: currentDate, changefreq: 'weekly', priority: '1.0' });
  urls.push({ loc: `${baseUrl}/dashboard`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' });
  urls.push({ loc: `${baseUrl}/university-hub`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' });

  // Static Pages
  const staticPages = ['privacy-policy', 'terms-and-conditions', 'faq', 'contact', 'help-center'];
  for (const page of staticPages) {
    urls.push({ loc: `${baseUrl}/${page}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' });
  }

  // Informational Guides
  for (const guide of guideTypes) {
    urls.push({ loc: `${baseUrl}/${guide}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' });
  }

  // Generic Tools
  for (const type of pageTypes) {
    urls.push({ loc: `${baseUrl}/${type}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' });
  }

  // Universities
  for (const uni of universities) {
    const slugPrefix = uni.shortName
      ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : uni.id;

    for (const type of pageTypes) {
      urls.push({
        loc: `${baseUrl}/${slugPrefix}-${type}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      });
      if (slugPrefix !== uni.id) {
        urls.push({
          loc: `${baseUrl}/${uni.id}-${type}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    }
  }

  return urls;
}

function generateUrlsetXml(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const entry of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${entry.loc}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  xml += '</urlset>\n';
  return xml;
}

function main() {
  console.log('🗺️  Generating single flat static sitemap.xml...');
  
  const allUrls = getAllUrls();
  console.log(`   Total URLs: ${allUrls.length}`);

  const publicDir = path.join(__dirname, '..', 'public');

  // Clean up legacy sitemaps directory if it exists
  const sitemapsDir = path.join(publicDir, 'sitemaps');
  if (fs.existsSync(sitemapsDir)) {
    fs.rmSync(sitemapsDir, { recursive: true, force: true });
    console.log('   🧹 Cleaned up legacy public/sitemaps directory');
  }

  // Generate single complete sitemap.xml
  const xml = generateUrlsetXml(allUrls);
  const indexPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(indexPath, xml, 'utf-8');
  console.log(`   ✅ public/sitemap.xml (${allUrls.length} URLs, ${(xml.length / (1024 * 1024)).toFixed(2)} MB)`);

  // Ensure robots.txt exists and is correct
  const robotsPath = path.join(publicDir, 'robots.txt');
  const robotsContent = `User-agent: *\nAllow: /\nDisallow: /private/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log('   ✅ public/robots.txt verified');

  console.log('🎉 Single flat sitemap generated successfully!\n');
}

main();
