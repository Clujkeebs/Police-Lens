export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-you-need-privacy-policy-checker',
    title: 'Why You Need a Privacy Policy Checker in 2026',
    excerpt: 'Discover why AI-powered privacy policy analysis is essential for protecting your digital rights in an era of increasing data collection.',
    date: '2026-04-10',
    readTime: '7 min read',
    category: 'Privacy Tips',
    image: '/og-image.svg'
  },
  {
    slug: 'ai-privacy-policies-explained',
    title: 'How AI Is Making Privacy Policies More Transparent',
    excerpt: 'Learn how artificial intelligence is transforming the way we understand complex legal documents and protecting consumers.',
    date: '2026-04-08',
    readTime: '5 min read',
    category: 'Technology',
    image: '/og-image.svg'
  },
  {
    slug: 'gdpr-compliance-guide-2026',
    title: 'Complete GDPR Compliance Guide for 2026',
    excerpt: 'Everything businesses need to know about GDPR compliance, from cookie consent to data subject rights and potential fines.',
    date: '2026-04-05',
    readTime: '12 min read',
    category: 'Compliance',
    image: '/og-image.svg'
  },
  {
    slug: 'big-tech-privacy-policies-ranked',
    title: 'Big Tech Privacy Policies Ranked: Best to Worst',
    excerpt: 'We analyzed and ranked the privacy policies of Google, Apple, Meta, Amazon, and TikTok to see which tech giant respects your privacy most.',
    date: '2026-04-03',
    readTime: '10 min read',
    category: 'Analysis',
    image: '/og-image.svg'
  },
  {
    slug: 'state-privacy-laws-comparison',
    title: 'US State Privacy Laws: A Complete Comparison Guide',
    excerpt: 'Compare privacy laws across California, Virginia, Colorado, Texas, and other states with comprehensive consumer privacy legislation.',
    date: '2026-04-01',
    readTime: '9 min read',
    category: 'Legal',
    image: '/og-image.svg'
  },
  {
    slug: 'how-to-read-privacy-policy',
    title: 'How to Read a Privacy Policy Like a Lawyer',
    excerpt: 'Master the art of scanning privacy policies for red flags. Learn what sections matter most and how to spot concerning clauses quickly.',
    date: '2026-03-28',
    readTime: '8 min read',
    category: 'Guides',
    image: '/og-image.svg'
  }
];
