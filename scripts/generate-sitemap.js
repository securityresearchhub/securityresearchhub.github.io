import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const blogPostsPath = path.join(rootDir, 'data', 'blogPosts.ts');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

const domain = process.env.VITE_SITE_URL || 'https://securityresearchhub.github.io';

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/about', priority: '0.5', changefreq: 'yearly' },
  { path: '/contact', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
];

try {
  console.log('Generating SEO-Optimized sitemap...');
  const content = fs.readFileSync(blogPostsPath, 'utf8');

  // Split content by ID to isolate each blog post object
  const blocks = content.split(/id:\s*['"]/);
  const posts = [];

  for (const block of blocks) {
    const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
    if (!slugMatch) continue;
    
    const slug = slugMatch[1];
    const pubMatch = block.match(/publishDate:\s*['"]([^'"]+)['"]/);
    const upMatch = block.match(/updatedDate:\s*['"]([^'"]+)['"]/);
    
    const dateStr = (upMatch ? upMatch[1] : null) || (pubMatch ? pubMatch[1] : null);
    
    let lastmod = new Date().toISOString().split('T')[0];
    if (dateStr) {
      try {
        lastmod = new Date(dateStr).toISOString().split('T')[0];
      } catch (e) {
        // Fallback to today if parsing fails
      }
    }
    
    posts.push({ slug, lastmod });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const today = new Date().toISOString().split('T')[0];

  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  posts.forEach(post => {
    xml += `
  <url>
    <loc>${domain}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `\n</urlset>\n`;

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Success: Generated sitemap.xml with ${posts.length} dynamic blog routes.`);

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
