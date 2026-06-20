/**
 * Static Sitemap Generator
 * 
 * Generates sitemap XML files into public/ at build time.
 * These are served as static assets by Cloudflare CDN — no Worker involved.
 * This guarantees Google can always fetch them.
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

// Page types (must match the sitemap route handler)
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
const URLS_PER_SITEMAP = 5000; // Google's limit is 50,000 per file, 5000 keeps files small

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

function generateSitemapIndexXml(count) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (let i = 0; i < count; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${baseUrl}/sitemaps/sitemap-${i}.xml</loc>\n`;
    xml += '  </sitemap>\n';
  }
  xml += '</sitemapindex>\n';
  return xml;
}

function main() {
  console.log('🗺️  Generating static sitemaps...');
  
  const allUrls = getAllUrls();
  console.log(`   Total URLs: ${allUrls.length}`);

  // Create output directories
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapsDir = path.join(publicDir, 'sitemaps');
  
  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  // Generate chunked sitemaps
  const totalChunks = Math.ceil(allUrls.length / URLS_PER_SITEMAP);
  console.log(`   Chunks: ${totalChunks} (${URLS_PER_SITEMAP} URLs each)`);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * URLS_PER_SITEMAP;
    const end = Math.min(start + URLS_PER_SITEMAP, allUrls.length);
    const chunk = allUrls.slice(start, end);
    const xml = generateUrlsetXml(chunk);
    const filePath = path.join(sitemapsDir, `sitemap-${i}.xml`);
    fs.writeFileSync(filePath, xml, 'utf-8');
    console.log(`   ✅ public/sitemaps/sitemap-${i}.xml (${chunk.length} URLs, ${(xml.length / 1024).toFixed(1)} KB)`);
  }

  // Generate sitemap index
  const indexXml = generateSitemapIndexXml(totalChunks);
  const indexPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(indexPath, indexXml, 'utf-8');
  console.log(`   ✅ public/sitemap.xml (index with ${totalChunks} sitemaps)`);

  console.log('🎉 Static sitemaps generated successfully!\n');
}

main();
