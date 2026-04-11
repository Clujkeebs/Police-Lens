import fs from 'fs';
import path from 'path';

const siteUrl = 'https://policylens.app';
const today = new Date().toISOString().split('T')[0];

const allPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/faq', priority: '0.9', changefreq: 'weekly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy-basics/what-is-privacy-policy', priority: '0.9', changefreq: 'monthly' },
  { url: '/privacy-basics/privacy-policy-vs-terms', priority: '0.8', changefreq: 'monthly' },
  { url: '/privacy-basics/do-i-need-privacy-policy', priority: '0.9', changefreq: 'monthly' },
  { url: '/privacy-basics/gdpr-privacy-policy-guide', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-basics/ccpa-compliance-checklist', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-laws/gdpr', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-laws/ccpa', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-laws/coppa', priority: '0.8', changefreq: 'monthly' },
  { url: '/privacy-laws/state-privacy-laws', priority: '0.8', changefreq: 'monthly' },
  { url: '/privacy-laws/gdpr-vs-ccpa', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-laws/gdpr-data-subject-rights', priority: '0.9', changefreq: 'weekly' },
  { url: '/privacy-laws/gdpr-fines', priority: '0.8', changefreq: 'monthly' },
  { url: '/privacy-laws/data-processing-agreement', priority: '0.8', changefreq: 'monthly' },
  { url: '/brand-analysis/google-privacy-policy', priority: '0.9', changefreq: 'weekly' },
  { url: '/brand-analysis/facebook-privacy-policy', priority: '0.9', changefreq: 'weekly' },
  { url: '/brand-analysis/amazon-privacy-policy', priority: '0.9', changefreq: 'weekly' },
  { url: '/brand-analysis/apple-privacy-policy', priority: '0.9', changefreq: 'weekly' },
  { url: '/brand-analysis/tiktok-privacy-policy', priority: '0.9', changefreq: 'weekly' },
  { url: '/guides/privacy-policy-checker', priority: '0.9', changefreq: 'weekly' },
  { url: '/guides/website-privacy-audit', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/cookie-consent-guide', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/wordpress-privacy-policy', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/shopify-privacy-policy', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/small-business-privacy-policy', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/saas-privacy-policy', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/mobile-app-privacy-policy', priority: '0.8', changefreq: 'monthly' },
  { url: '/guides/automated-compliance-scanning', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const page of allPages) {
    xml += '  <url>\n';
    xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    xml
  );
  
  console.log(`Sitemap generated with ${allPages.length} pages`);
}

generateSitemap();
