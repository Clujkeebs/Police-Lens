export const prerender = false;

import { blogPosts } from '../../data/blog-posts.ts';

const siteUrl = 'https://policy-lens-ai-app.vercel.app';

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>PolicyLens Blog — Privacy &amp; Digital Rights Insights</title>
    <link>${siteUrl}/blog</link>
    <description>Expert guides on privacy policies, data protection laws, GDPR compliance, and how to protect your digital rights.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-image.svg</url>
      <title>PolicyLens Blog</title>
      <link>${siteUrl}/blog</link>
    </image>
    ${blogPosts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <content:encoded><![CDATA[<p>${post.excerpt}</p><p><a href="${siteUrl}/blog/${post.slug}">Read the full article →</a></p>]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`;

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
