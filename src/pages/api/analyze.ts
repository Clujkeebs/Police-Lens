export const prerender = false;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface CategoryResult {
  category: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high';
  matchCount: number;
  matchedKeywords: string[];
  findings: string[];
}

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  wordCount: number;
  redFlags: Array<{ message: string; severity: string; matchedText: string }>;
  goodSigns: Array<{ message: string; matchedText: string }>;
  categories: Record<string, CategoryResult>;
  summary: {
    overview: string;
    keyPoints: string[];
  };
}

const ANALYSIS_PROMPT = `You are PolicyLens, an AI privacy policy and terms of service analyzer. Analyze the provided legal document and return a comprehensive analysis in JSON format.

Return ONLY valid JSON with this exact structure, no markdown formatting, no code fences:
{
  "riskScore": <number 0-100>,
  "riskLevel": "low" | "medium" | "high",
  "confidenceScore": <number 0-100>,
  "wordCount": <number>,
  "redFlags": [
    {"message": "<warning>", "severity": "high|medium|low", "matchedText": "<text from document>"}
  ],
  "goodSigns": [
    {"message": "<positive finding>", "matchedText": "<text from document>"}
  ],
  "categories": {
    "dataCollection": {"category": "Data Collection", "description": "What personal information is collected", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "dataSharing": {"category": "Data Sharing", "description": "How data is shared with third parties", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "dataRetention": {"category": "Data Retention", "description": "How long data is stored", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "security": {"category": "Security Measures", "description": "How data is protected", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "advertising": {"category": "Advertising", "description": "Use of data for advertising", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "userRights": {"category": "User Rights", "description": "Your rights over your data", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "liability": {"category": "Liability", "description": "Service provider limitations", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []}
  },
  "summary": {
    "overview": "<2-3 sentence plain English summary>",
    "keyPoints": ["<point 1>", "<point 2>", "<point 3>"]
  }
}

Scoring guide:
- 0-30: Low risk (reasonable privacy protections)
- 31-60: Medium risk (some concerns worth reviewing)
- 61-100: High risk (significant privacy implications)

Red flags to look for:
HIGH: data selling, class action waivers, unlimited liability, no deletion rights, keystroke/screen recording, SSN collection
MEDIUM: vague third-party sharing, automatic policy changes without notice, biometric data, facial recognition
LOW: ambiguous data retention periods, minimal user controls

Good signs: GDPR/CCPA compliance, end-to-end encryption, clear deletion process, security certifications (ISO 27001, SOC 2), data minimization, privacy by design

Now analyze this document and return only the JSON:`;

async function fetchPolicyFromUrl(url: string) {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PolicyLens/1.0; +https://policylens.app)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    return { html: await response.text(), url: normalizedUrl };
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
}

function extractPolicyText(html: string): string {
  const selectors = ['policy', 'privacy', 'terms', 'legal', 'agreement', 'disclaimer'];

  for (const selector of selectors) {
    const classMatch = html.match(new RegExp(`<[^>]*(?:class|id)=["'][^"']*${selector}[^"']*["'][^>]*>([\\s\\S]*?)</(?:div|section|article|main|div)`, 'gi'));
    if (classMatch) {
      for (const match of classMatch) {
        const text = match.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length > 500) return cleanText(text);
      }
    }
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    let text = bodyMatch[1]
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleanText(text);
  }
  return '';
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/[\r\n]+/g, '. ').replace(/\.\s*\./g, '.').trim();
}

function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch) return ogMatch[1];
  return null;
}

async function analyzeWithClaude(text: string, apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `${ANALYSIS_PROMPT}\n\n${text}`
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function analyzeWithGemini(text: string, apiKey: string) {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${ANALYSIS_PROMPT}\n\n${text}` }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        topP: 0.95
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Unexpected Gemini response:', JSON.stringify(data).substring(0, 500));
    throw new Error('Empty response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

function ensureCompleteAnalysis(analysis: AnalysisResult, originalText: string): AnalysisResult {
  const defaults: Record<string, CategoryResult> = {
    dataCollection: { category: 'Data Collection', description: 'What personal information is collected', severity: 'medium', matchCount: 0, matchedKeywords: [], findings: [] },
    dataSharing: { category: 'Data Sharing', description: 'How data is shared with third parties', severity: 'medium', matchCount: 0, matchedKeywords: [], findings: [] },
    dataRetention: { category: 'Data Retention', description: 'How long data is stored', severity: 'low', matchCount: 0, matchedKeywords: [], findings: [] },
    security: { category: 'Security Measures', description: 'How data is protected', severity: 'low', matchCount: 0, matchedKeywords: [], findings: [] },
    advertising: { category: 'Advertising', description: 'Use of data for advertising', severity: 'low', matchCount: 0, matchedKeywords: [], findings: [] },
    userRights: { category: 'User Rights', description: 'Your rights over your data', severity: 'info', matchCount: 0, matchedKeywords: [], findings: [] },
    liability: { category: 'Liability', description: 'Service provider limitations', severity: 'medium', matchCount: 0, matchedKeywords: [], findings: [] }
  };

  if (!analysis.categories) analysis.categories = {};
  for (const [key, def] of Object.entries(defaults)) {
    if (!analysis.categories[key]) {
      analysis.categories[key] = def;
    } else {
      analysis.categories[key] = { ...def, ...analysis.categories[key] };
    }
  }

  if (!analysis.riskScore) {
    let score = 35;
    const weights: Record<string, number> = { high: 15, medium: 8, low: 3, info: 0 };
    for (const cat of Object.values(analysis.categories)) {
      if (cat?.matchCount > 0) score += cat.matchCount * (weights[cat.severity] || 5);
    }
    analysis.riskScore = Math.max(0, Math.min(100, score));
  }

  if (!analysis.riskLevel) {
    analysis.riskLevel = analysis.riskScore < 30 ? 'low' : analysis.riskScore < 60 ? 'medium' : 'high';
  }

  if (!analysis.confidenceScore) {
    const total = Object.values(analysis.categories).reduce((sum: number, c: CategoryResult) => sum + (c?.matchCount || 0), 0);
    analysis.confidenceScore = Math.min(95, 50 + total * 3);
  }

  if (!analysis.wordCount) {
    analysis.wordCount = originalText.split(/\s+/).length;
  }

  if (!analysis.summary?.overview) {
    analysis.summary = {
      overview: analysis.riskLevel === 'low' ? 'Reasonable privacy protections.' :
                analysis.riskLevel === 'medium' ? 'Some privacy concerns worth reviewing.' :
                'Significant privacy implications.',
      keyPoints: []
    };
  }

  return analysis;
}

export async function POST({ request }: { request: Request }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const apiKey = geminiKey || anthropicKey;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'AI API key not configured. Please set GEMINI_API_KEY (free from https://aistudio.google.com) or ANTHROPIC_API_KEY in Vercel environment variables.'
      }), { status: 500, headers });
    }

    const body = await request.json();
    const { url, text: inputText } = body;

    let policyText: string;
    let extractedDomain = 'Unknown';
    let extractedTitle = 'Policy Analysis';
    let fetchedUrl: string | null = null;

    if (url) {
      try {
        const { html, url: normalizedUrl } = await fetchPolicyFromUrl(url);
        policyText = extractPolicyText(html);
        fetchedUrl = normalizedUrl;
        extractedDomain = new URL(normalizedUrl).hostname;
        extractedTitle = extractTitle(html) || extractedDomain;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: `Failed to fetch URL: ${message}` }), { status: 400, headers });
      }
    } else if (inputText) {
      policyText = inputText;
      extractedDomain = 'Manual Analysis';
      extractedTitle = 'Custom Policy Text';
    } else {
      return new Response(JSON.stringify({ error: 'Either URL or text must be provided' }), { status: 400, headers });
    }

    if (!policyText || policyText.length < 100) {
      return new Response(JSON.stringify({ error: 'Policy text too short or could not be extracted. Try pasting the text directly.' }), { status: 400, headers });
    }

    const truncatedText = policyText.length > 50000 ? policyText.substring(0, 50000) + '...' : policyText;

    const useGemini = !!geminiKey;
    let aiResponse: string;
    try {
      if (useGemini) {
        aiResponse = await analyzeWithGemini(truncatedText, geminiKey);
      } else {
        aiResponse = await analyzeWithClaude(truncatedText, anthropicKey!);
      }
    } catch (aiError: unknown) {
      const message = aiError instanceof Error ? aiError.message : 'Unknown error';
      console.error('AI API error:', message);
      return new Response(JSON.stringify({ error: `AI analysis failed: ${message}` }), { status: 500, headers });
    }

    let cleanJson = aiResponse.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(cleanJson) as AnalysisResult;
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Raw response:', cleanJson.substring(0, 500));
      return new Response(JSON.stringify({
        error: 'Failed to parse AI response. Please try again.',
        raw: cleanJson.substring(0, 200)
      }), { status: 500, headers });
    }

    analysis = ensureCompleteAnalysis(analysis, truncatedText);

    const result = {
      domain: extractedDomain,
      url: fetchedUrl,
      title: extractedTitle,
      analysis,
      keyClauses: [],
      fetchedAt: new Date().toISOString(),
      analyzedAt: new Date().toISOString(),
      aiPowered: true
    };

    return new Response(JSON.stringify(result), { status: 200, headers });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    console.error('Analysis error:', message);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}
