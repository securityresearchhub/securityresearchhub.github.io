import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, article, canonical }) => {
  const { pathname } = useLocation();
  const siteUrl = 'https://manivarmacyber.github.io';
  
  useEffect(() => {
    // Title
    const finalTitle = title ? `${title} | Mani Varma` : 'Mani Varma | Cybersecurity Research';
    document.title = finalTitle;

    // Meta Description
    const metaDescription = description || 'Enterprise-grade cybersecurity research, vulnerability analysis, and ethical hacking content by Mani Varma.';
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', metaDescription);

    // Canonical
    const finalCanonical = canonical || `${siteUrl}${pathname}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', finalCanonical);

    // Open Graph
    const ogTags = [
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:type', content: article ? 'article' : 'website' },
      { property: 'og:url', content: finalCanonical },
      { property: 'og:image', content: `${siteUrl}${image || '/profile-refined.png'}` }
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });

    // JSON-LD Structured Data
    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    
    if (article) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": finalCanonical
        },
        "headline": finalTitle,
        "description": metaDescription,
        "image": `${siteUrl}${image || '/profile-refined.png'}`,
        "author": {
          "@type": "Person",
          "name": "Mani Varma",
          "url": siteUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "Mani Varma Cybersecurity"
        }
      };
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mani Varma | Cybersecurity Research",
        "url": siteUrl,
        "description": metaDescription
      };
      schemaScript.textContent = JSON.stringify(schema);
    }

  }, [title, description, image, article, canonical, pathname]);

  return null;
};
