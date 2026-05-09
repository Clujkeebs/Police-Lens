# PolicyLens

AI-powered privacy policy and terms of service analyzer. Understand what you're agreeing to before you sign up.

## Features

- **AI-Powered Analysis** — Uses Groq (free Llama 3.3) or Claude AI for intelligent policy breakdown
- **URL or Text Input** — Analyze from URL or paste text directly
- **Risk Scoring** — Get instant risk scores (0-100)
- **Red Flag Detection** — Identifies concerning clauses like data selling, class action waivers
- **Policy Comparison** — Compare multiple policies side-by-side
- **No Signup Required** — All history stored locally in your browser
- **Blog & Guides** — In-depth articles on GDPR, CCPA, privacy best practices

## Quick Start

```bash
npm install
npm run dev
```

## Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Groq API key (free — generous rate limits on open-source models)

### Step 1: Get a Free Groq API Key
1. Go to [Groq Console](https://console.groq.com)
2. Sign in with your Google or GitHub account
3. Go to "API Keys" and create a new key
4. Copy the key

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/policylens.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project** → Select your GitHub repo
3. Vercel auto-detects Astro — no config needed
4. Under **Environment Variables**, add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq API key from Step 1
5. Click **Deploy**

### Alternative: Use Other AI Providers
If you prefer Google Gemini, set `GEMINI_API_KEY` instead. For Anthropic's Claude, set `ANTHROPIC_API_KEY`. The app uses whichever key you provide (Groq is tried first, then Gemini, then Claude).

## Project Structure

```
policylens/
├── src/
│   ├── components/     # UI components (PolicyAnalyzer, AnalysisResult, ComparisonView)
│   ├── data/           # Shared data (blog posts)
│   ├── layouts/        # Page layouts (Layout, ContentLayout)
│   ├── pages/          # Routes + API endpoints
│   │   ├── api/        # Serverless functions (analyze.ts)
│   │   ├── blog/       # Blog section (6 SEO-optimized posts)
│   │   ├── brand-analysis/  # Big tech privacy analysis
│   │   ├── guides/     # In-depth guides
│   │   ├── privacy-basics/  # Privacy fundamentals
│   │   └── privacy-laws/    # Privacy law guides
│   └── scripts/        # Client-side analyzer
├── public/             # Static assets
├── scripts/            # Build scripts (sitemap)
├── astro.config.mjs    # Astro + Vercel config
└── package.json
```

## Tech Stack

- **Framework:** Astro 6.x
- **Deployment:** Vercel (with Speed Insights)
- **AI:** Groq Llama 3.3 70B (free tier) with Gemini Flash and Claude Haiku fallbacks
- **Styling:** Custom CSS with Midnight Neon theme
- **Ads:** Google AdSense (auto ads on public pages)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes* | Free API key from [Groq Console](https://console.groq.com) |
| `GEMINI_API_KEY` | No | Fallback — free API key from [Google AI Studio](https://aistudio.google.com) |
| `ANTHROPIC_API_KEY` | No | Fallback to Claude if neither Groq nor Gemini keys are set |

*At least one API key must be set for AI analysis to work. Groq is the recommended free option.

## License

MIT
