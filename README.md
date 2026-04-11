# PolicyLens

AI-powered privacy policy and terms of service analyzer. Understand what you're agreeing to before you sign up.

## Features

- **AI-Powered Analysis** - Uses Claude AI for intelligent policy breakdown
- **URL or Text Input** - Analyze from URL or paste text directly
- **Risk Scoring** - Get instant risk scores (0-100)
- **Red Flag Detection** - Identifies concerning clauses
- **Policy Comparison** - Compare multiple policies side-by-side
- **No Signup Required** - All history stored locally in your browser

## Quick Start

```bash
npm install
npm run dev
```

## Deployment to Netlify

### Prerequisites
- GitHub account
- Netlify account
- Anthropic API key (for AI features)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
cd policylens
git init
git add .
git commit -m "Initial commit"

# Create repo on github.com first, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/policylens.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site → Import an existing project**
3. Select **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Find and select the `policylens` repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **Deploy site**

### Step 3: Add Environment Variable

1. Go to **Site Settings → Environment Variables**
2. Click **Add a variable**
3. Enter:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `your-api-key-here`
4. Click **Save**
5. Go to **Deploys** and click **Trigger deploy → Deploy latest**

### Step 4: Custom Domain (Optional)

1. Go to **Site Settings → Domain Management**
2. Click **Add custom domain**
3. Enter `policylens.app` (or your domain)
4. Follow DNS instructions to point your domain to Netlify

## Project Structure

```
policylens/
├── src/
│   ├── components/     # UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Routes (including API endpoints)
│   │   ├── api/      # Serverless functions
│   │   └── *.astro   # Static pages
│   └── scripts/       # Utility scripts
├── public/            # Static assets
├── netlify.toml       # Netlify configuration
└── package.json      # Dependencies
```

## Getting Your Own Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Create a new API key
5. Copy and use in Netlify environment variables

## Tech Stack

- **Framework:** Astro
- **Adapter:** Netlify
- **AI:** Claude (Anthropic)
- **Styling:** Custom CSS with Midnight Neon theme

## License

MIT
