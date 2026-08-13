/**
 * Static Sitemap Generator
 * 
 * Generates:
 * 1. public/sitemap.xml (Complete single sitemap with all 9,127 URLs)
 * 2. public/sitemaps/sitemap-0.xml (Part 1 - 5,000 URLs with core site links)
 * 3. public/sitemaps/sitemap-1.xml (Part 2 - 4,127 URLs with core site links)
 * 
 * Adding core site links to every chunk ensures Google Search Console instantly
 * validates and accepts every chunk as Type: Sitemap instead of Type: Unknown.
 */

const fs = require('fs');
const path = require('path');

// Load university data directly from JSON
const registryPath = path.join(__dirname, '..', 'data', 'universities', 'registry.json');
const universities = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

// Guide types
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
const URLS_PER_SITEMAP = 4500; // ~4500 URLs per chunk for optimal speed and parsing

function getCoreUrls(currentDate) {
  const core = [];
  core.push({ loc: `${baseUrl}/`, lastmod: currentDate, changefreq: 'weekly', priority: '1.0' });
  core.push({ loc: `${baseUrl}/directory`, lastmod: currentDate, changefreq: 'daily', priority: '1.0' });
  core.push({ loc: `${baseUrl}/dashboard`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' });
  core.push({ loc: `${baseUrl}/university-hub`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' });

  const staticPages = ['privacy-policy', 'terms-and-conditions', 'faq', 'contact', 'help-center'];
  for (const page of staticPages) {
    core.push({ loc: `${baseUrl}/${page}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' });
  }

  for (const guide of guideTypes) {
    core.push({ loc: `${baseUrl}/${guide}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' });
  }

  for (const type of pageTypes) {
    core.push({ loc: `${baseUrl}/${type}`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' });
  }

  return core;
}

function getAllUrls() {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls = getCoreUrls(currentDate);

  // Universities - Include ONLY primary canonical URLs
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
  console.log('🗺️  Generating complete static sitemaps...');
  
  const currentDate = new Date().toISOString().split('T')[0];
  const allUrls = getAllUrls();
  console.log(`   Total URLs: ${allUrls.length}`);

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapsDir = path.join(publicDir, 'sitemaps');

  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  // University URLs only
  const coreUrls = getCoreUrls(currentDate);
  const universityUrls = allUrls.slice(coreUrls.length);

  // Generate chunks where EVERY chunk includes the core URLs at the top!
  const totalChunks = Math.ceil(universityUrls.length / URLS_PER_SITEMAP);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * URLS_PER_SITEMAP;
    const end = Math.min(start + URLS_PER_SITEMAP, universityUrls.length);
    const uniChunk = universityUrls.slice(start, end);
    
    // Combine core URLs + university chunk
    const fullChunk = [...coreUrls, ...uniChunk];
    const chunkXml = generateUrlsetXml(fullChunk);
    const chunkPath = path.join(sitemapsDir, `sitemap-${i}.xml`);
    fs.writeFileSync(chunkPath, chunkXml, 'utf-8');
    console.log(`   ✅ public/sitemaps/sitemap-${i}.xml (${fullChunk.length} URLs, ${(chunkXml.length / 1024).toFixed(1)} KB)`);
  }

  // Generate full single sitemap.xml in public/
  const fullXml = generateUrlsetXml(allUrls);
  const indexPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(indexPath, fullXml, 'utf-8');
  console.log(`   ✅ public/sitemap.xml (${allUrls.length} URLs, ${(fullXml.length / (1024 * 1024)).toFixed(2)} MB)`);

  // Robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  let robotsContent = `User-agent: *\nAllow: /\nDisallow: /private/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  for (let i = 0; i < totalChunks; i++) {
    robotsContent += `Sitemap: ${baseUrl}/sitemaps/sitemap-${i}.xml\n`;
  }
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log('   ✅ public/robots.txt updated');

  console.log('🎉 All static sitemaps generated successfully!\n');
}

main();
