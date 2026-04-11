export { renderers } from '../../renderers.mjs';

const prerender = false;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANALYSIS_PROMPT = `You are PolicyLens, an AI privacy policy and terms of service analyzer. Analyze the provided legal document and return a comprehensive analysis in JSON format.

Return ONLY valid JSON with this exact structure, no markdown:
{
  "riskScore": <number 0-100>,
  "riskLevel": "low" or "medium" or "high",
  "confidenceScore": <number 0-100>,
  "wordCount": <number>,
  "redFlags": [
    {"message": "<warning>", "severity": "high|medium|low", "matchedText": "<text>"}
  ],
  "goodSigns": [
    {"message": "<positive finding>", "matchedText": "<text>"}
  ],
  "categories": {
    "dataCollection": {"category": "Data Collection", "description": "Methods of collecting personal information", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "dataSharing": {"category": "Data Sharing", "description": "How data is shared with third parties", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "dataRetention": {"category": "Data Retention", "description": "How long data is kept", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "security": {"category": "Security Measures", "description": "How data is protected", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "advertising": {"category": "Advertising", "description": "Use of data for advertising", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "userRights": {"category": "User Rights", "description": "Your rights over your data", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []},
    "liability": {"category": "Liability", "description": "Service provider limitations", "severity": "info|low|medium|high", "matchCount": 0, "matchedKeywords": [], "findings": []}
  },
  "summary": {
    "overview": "<2-3 sentence summary>",
    "keyPoints": ["<point1>", "<point2>"]
  }
}

Score guide: 0-30 low, 31-60 medium, 61-100 high risk.

Red flags (HIGH): data selling, class action waivers, unlimited liability, no deletion rights, keystroke tracking, SSN collection.
Red flags (MEDIUM): vague third-party sharing, automatic policy changes, biometric data, facial recognition.
Good signs: GDPR/CCPA compliance, end-to-end encryption, clear deletion process, security certifications.

Now analyze this document:`;
async function fetchPolicyFromUrl(url) {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
  const response = await fetch(normalizedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PolicyLens/1.0; +https://policylens.app)"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return { html: await response.text(), url: normalizedUrl };
}
function extractPolicyText(html) {
  const selectors = ["policy", "privacy", "terms", "legal", "agreement", "disclaimer"];
  for (const selector of selectors) {
    const classMatch = html.match(new RegExp(`<[^>]*(?:class|id)=["'][^"']*${selector}[^"']*["'][^>]*>([\\s\\S]*?)</(?:div|section|article|main|div)`, "gi"));
    if (classMatch) {
      for (const match of classMatch) {
        const text = match.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (text.length > 500) {
          return cleanText(text);
        }
      }
    }
  }
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    let text = bodyMatch[1].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "").replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "").replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "").replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return cleanText(text);
  }
  return "";
}
function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/[\r\n]+/g, ". ").replace(/\.\s*\./g, ".").trim();
}
function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch) return ogMatch[1];
  return null;
}
async function analyzeWithClaude(text, apiKey) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-haiku-3-5-20250514",
      max_tokens: 4e3,
      messages: [{
        role: "user",
        content: `${ANALYSIS_PROMPT}

${text}`
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
function ensureCompleteAnalysis(analysis, originalText) {
  const defaults = {
    dataCollection: { category: "Data Collection", description: "Methods of collecting personal information", severity: "medium", matchCount: 0, matchedKeywords: [], findings: [] },
    dataSharing: { category: "Data Sharing", description: "How data is shared with third parties", severity: "medium", matchCount: 0, matchedKeywords: [], findings: [] },
    dataRetention: { category: "Data Retention", description: "How long data is kept", severity: "low", matchCount: 0, matchedKeywords: [], findings: [] },
    security: { category: "Security Measures", description: "How data is protected", severity: "low", matchCount: 0, matchedKeywords: [], findings: [] },
    advertising: { category: "Advertising", description: "Use of data for advertising", severity: "low", matchCount: 0, matchedKeywords: [], findings: [] },
    userRights: { category: "User Rights", description: "Your rights over your data", severity: "info", matchCount: 0, matchedKeywords: [], findings: [] },
    liability: { category: "Liability", description: "Service provider limitations", severity: "medium", matchCount: 0, matchedKeywords: [], findings: [] }
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
    const weights = { high: 15, medium: 8, low: 3, info: 0 };
    for (const cat of Object.values(analysis.categories)) {
      if (cat && cat.matchCount > 0) {
        score += cat.matchCount * (weights[cat.severity] || 5);
      }
    }
    analysis.riskScore = Math.max(0, Math.min(100, score));
  }
  if (!analysis.riskLevel) {
    analysis.riskLevel = analysis.riskScore < 30 ? "low" : analysis.riskScore < 60 ? "medium" : "high";
  }
  if (!analysis.confidenceScore) {
    const total = Object.values(analysis.categories).reduce((sum, c) => sum + (c?.matchCount || 0), 0);
    analysis.confidenceScore = Math.min(95, 50 + total * 3);
  }
  if (!analysis.wordCount) {
    analysis.wordCount = originalText.split(/\s+/).length;
  }
  if (!analysis.summary?.overview) {
    analysis.summary = {
      overview: analysis.riskLevel === "low" ? "Reasonable privacy protections." : analysis.riskLevel === "medium" ? "Some privacy concerns worth reviewing." : "Significant privacy implications.",
      keyPoints: []
    };
  }
  return analysis;
}
async function POST({ request }) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured. Set ANTHROPIC_API_KEY in Netlify environment variables." }), {
        status: 500,
        headers
      });
    }
    const body = await request.json();
    const { url, text: inputText } = body;
    let policyText;
    let extractedDomain = "Unknown";
    let extractedTitle = "Policy Analysis";
    let fetchedUrl = null;
    if (url) {
      try {
        const { html, url: normalizedUrl } = await fetchPolicyFromUrl(url);
        policyText = extractPolicyText(html);
        fetchedUrl = normalizedUrl;
        extractedDomain = new URL(normalizedUrl).hostname;
        extractedTitle = extractTitle(html) || extractedDomain;
      } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to fetch URL: ${error.message}` }), {
          status: 400,
          headers
        });
      }
    } else if (inputText) {
      policyText = inputText;
    } else {
      return new Response(JSON.stringify({ error: "Either URL or text must be provided" }), {
        status: 400,
        headers
      });
    }
    if (!policyText || policyText.length < 100) {
      return new Response(JSON.stringify({ error: "Policy text too short or could not be extracted" }), {
        status: 400,
        headers
      });
    }
    const truncatedText = policyText.length > 5e4 ? policyText.substring(0, 5e4) + "..." : policyText;
    const aiResponse = await analyzeWithClaude(truncatedText, apiKey);
    let cleanJson = aiResponse.trim().replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
    let analysis;
    try {
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Parse error:", parseError, "Raw:", cleanJson.substring(0, 500));
      return new Response(JSON.stringify({
        error: "Failed to parse AI response",
        raw: cleanJson.substring(0, 200)
      }), {
        status: 500,
        headers
      });
    }
    analysis = ensureCompleteAnalysis(analysis, truncatedText);
    const result = {
      domain: extractedDomain,
      url: fetchedUrl,
      title: extractedTitle,
      analysis,
      keyClauses: [],
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
      analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
      aiPowered: true
    };
    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ error: error.message || "Analysis failed" }), {
      status: 500,
      headers
    });
  }
}
async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
