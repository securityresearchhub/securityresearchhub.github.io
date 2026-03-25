import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { blogPosts } from './data/blogPosts';

function generateBlogMetadata(siteUrl: string) {
  return {
    name: 'generate-blog-metadata',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');

      // Generate CNAME file for GH Pages
      try {
        const domain = new URL(siteUrl).hostname;
        // Only generate CNAME if it's not a github.io domain or if explicitly needed
        // For github.io domains, CNAME is usually not required unless it's a custom domain pointing to it
        if (!domain.endsWith('github.io')) {
          fs.writeFileSync(path.join(distDir, 'CNAME'), domain);
        }
      } catch (e) {
        console.warn('Failed to generate CNAME', e);
      }

      if (!fs.existsSync(indexHtmlPath)) return;

      const template = fs.readFileSync(indexHtmlPath, 'utf8');

      blogPosts.forEach((post) => {
        const blogDir = path.join(distDir, 'blog', post.slug);
        if (!fs.existsSync(blogDir)) {
          fs.mkdirSync(blogDir, { recursive: true });
        }

        const title = post.title;
        const description = post.excerpt.replace(/"/g, '&quot;');
        const url = `${siteUrl}/blog/${post.slug}`;
        const image = `${siteUrl}${post.image}`;

        let publishTime = post.publishDate;
        try { publishTime = new Date(post.publishDate).toISOString().split('T')[0] + 'T10:00:00+00:00'; } catch (e) { }

        let modifiedTime = post.updatedDate || post.publishDate;
        try { modifiedTime = new Date(post.updatedDate || post.publishDate || new Date().toISOString()).toISOString().split('T')[0] + 'T10:00:00+00:00'; } catch (e) { }

        const metaTags = `
  <!-- Initial SEO Metadata Injected via Vite SSG -->
  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  
  <meta property="article:published_time" content="${publishTime}" />
  <meta property="article:modified_time" content="${modifiedTime}" />
  <meta property="article:author" content="G Manikanta Varma" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
        `;

        let updatedHtml = template
          .replace(/<title>.*?<\/title>/, '')
          .replace(/<meta name="title".*?>/, '')
          .replace(/<meta name="description".*?>/, '')
          .replace(/<meta property="og:type".*?>/, '')
          .replace(/<meta property="og:url".*?>/, '')
          .replace(/<meta property="og:title".*?>/, '')
          .replace(/<meta property="og:description".*?>/, '')
          .replace(/<meta property="og:image".*?>/, '')
          .replace(/<meta name="twitter:url".*?>/, '')
          .replace(/<meta name="twitter:title".*?>/, '')
          .replace(/<meta name="twitter:description".*?>/, '')
          .replace(/<meta name="twitter:image".*?>/, '');

        updatedHtml = updatedHtml.replace('</head>', `${metaTags}\n</head>`);
        fs.writeFileSync(path.join(blogDir, 'index.html'), updatedHtml);
      });

      try {
        const blogIndexDir = path.join(distDir, 'blog');
        if (!fs.existsSync(blogIndexDir)) {
          fs.mkdirSync(blogIndexDir, { recursive: true });
        }

        const blogTitle = 'Blog | Mani Varma';
        const blogDescription = 'Technical cybersecurity blog and writeups by G. Manikanta Varma.';
        const blogUrl = `${siteUrl}/blog`;

        let blogHtml = template
          .replace(/<title>.*?<\/title>/, '')
          .replace(/<meta name="title".*?>/, '')
          .replace(/<meta name="description".*?>/, '')
          .replace(/<meta property="og:type".*?>/, '')
          .replace(/<meta property="og:url".*?>/, '')
          .replace(/<meta property="og:title".*?>/, '')
          .replace(/<meta property="og:description".*?>/, '')
          .replace(/<meta property="og:image".*?>/, '')
          .replace(/<meta name="twitter:url".*?>/, '')
          .replace(/<meta name="twitter:title".*?>/, '')
          .replace(/<meta name="twitter:description".*?>/, '')
          .replace(/<meta name="twitter:image".*?>/, '');

        const blogMeta = `\n  <title>${blogTitle}</title>\n  <meta name="title" content="${blogTitle}" />\n  <meta name="description" content="${blogDescription}" />\n  <link rel="canonical" href="${blogUrl}" />\n  <meta property="og:type" content="website" />\n  <meta property="og:url" content="${blogUrl}" />\n  <meta property="og:title" content="${blogTitle}" />\n  <meta property="og:description" content="${blogDescription}" />\n  <meta property="og:image" content="${siteUrl}/profile-refined.png" />\n`;

        blogHtml = blogHtml.replace('</head>', `${blogMeta}\n</head>`);
        fs.writeFileSync(path.join(blogIndexDir, 'index.html'), blogHtml);
      } catch (e) {
        console.warn('Failed to generate blog index HTML', e);
      }

      // Generate sitemap.xml and robots.txt
      try {
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${blogPosts.map(post => {
  const modDate = post.updatedDate || post.publishDate || new Date().toISOString();
  let dateStr = '';
  try { dateStr = new Date(modDate).toISOString().split('T')[0]; } catch(e) { dateStr = new Date().toISOString().split('T')[0]; }
  return `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
}).join('\n')}
</urlset>`;
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);

        const robotsContent = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
      } catch (e) {
        console.warn('Failed to generate sitemap.xml and robots.txt', e);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const siteUrl = env.VITE_SITE_URL || 'https://manivarmacyber.github.io';

  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      generateBlogMetadata(siteUrl),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
      sourcemap: false,
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/messaging'],
            'page-blogpost': ['./pages/BlogPost.tsx'],
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    }
  };
});
