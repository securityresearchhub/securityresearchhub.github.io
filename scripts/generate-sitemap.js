import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const blogPostsPath = path.join(rootDir, 'data', 'blogPosts.ts');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

const domain = process.env.VITE_SITE_URL || 'https://securityresearchhub.github.io';

// Standard routes defined in App.tsx
const staticRoutes = [
  { path: '', priority: '1.0' },
  { path: '/blog', priority: '0.9' },
  { path: '/research', priority: '0.9' },
  { path: '/research-hub', priority: '0.9' },
  { path: '/database', priority: '0.85' },
  { path: '/vulnerabilities', priority: '0.8' },
  { path: '/about', priority: '0.7' },
  { path: '/contact', priority: '0.7' },
  { path: '/privacy', priority: '0.5' },
  { path: '/terms', priority: '0.5' },
  { path: '/disclaimer', priority: '0.5' },
  { path: '/legal-use', priority: '0.5' },
  { path: '/copyright', priority: '0.5' },
];

try {
  console.log('Generating dynamic sitemap...');
  const content = fs.readFileSync(blogPostsPath, 'utf8');

  // Extract slugs using regex: slug: '...' or slug: "..."
  const slugMatches = content.match(/slug:\s*['"]([^'"]+)['"]/g) || [];
  const slugs = slugMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${domain}${route.path}</loc>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Add dynamic blog posts
  slugs.forEach(slug => {
    xml += `
  <url>
    <loc>${domain}/blog/${slug}</loc>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>
`;

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Success: Generated sitemap.xml with ${slugs.length} dynamic blog routes.`);

  // Also update robots.txt to point to the correct sitemap location
  const robotsPath = path.join(rootDir, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    let robotsContent = fs.readFileSync(robotsPath, 'utf8');
    robotsContent = robotsContent.replace(/Sitemap:\s*.*/, `Sitemap: ${domain}/sitemap.xml`);
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`✅ Success: Updated robots.txt with dynamic Sitemap URL.`);
  }
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}
