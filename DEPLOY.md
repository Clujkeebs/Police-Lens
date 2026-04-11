# Deployment Checklist

## GitHub Setup (5 minutes)

1. Go to https://github.com/new
2. Create new repo named "policylens"
3. DO NOT initialize with README
4. Copy the commands shown (push existing repo)
5. Run in terminal:
   ```bash
   cd policylens
   git init
   git add .
   git commit -m "PolicyLens with AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/policylens.git
   git push -u origin main
   ```

## Netlify Setup (10 minutes)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub" button
4. Authorize Netlify on GitHub
5. Select "policylens" repo
6. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

## Add API Key (2 minutes)

1. In Netlify, go to "Site settings"
2. Find "Environment variables"
3. Click "Add a variable"
4. Fill in:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `your-api-key-here`
5. Click "Save"
6. Go to "Deploys" tab
7. Click "Trigger deploy" → "Deploy latest"

## Verify (1 minute)

1. Wait for deploy to finish (2-5 minutes)
2. Click the deploy URL (shown on Netlify)
3. Test by pasting a privacy policy URL
4. Should see AI analysis results

## Custom Domain (Optional)

1. Site settings → Domain management → Add custom domain
2. Add DNS records as instructed
3. Wait for SSL certificate (automatic)
