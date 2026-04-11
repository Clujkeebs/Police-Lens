const RISK_PATTERNS = {
  dataCollection: {
    keywords: [
      'collect', 'gathering', 'harvest', 'obtain', 'receive', 'access',
      'personal information', 'personal data', 'user data', 'usage data',
      'browsing history', 'location data', 'device information', 'ip address',
      'cookies', 'tracking', 'fingerprinting', 'analytics'
    ],
    weight: 1,
    category: 'Data Collection',
    severity: 'medium',
    description: 'Methods of collecting your personal information'
  },
  dataSharing: {
    keywords: [
      'share', 'disclose', 'transfer', 'third party', 'third-party',
      'partners', 'advertisers', 'vendors', 'service providers',
      'affiliates', 'business partners', 'data brokers'
    ],
    weight: 1.2,
    category: 'Data Sharing',
    severity: 'high',
    description: 'How your data may be shared with others'
  },
  dataRetention: {
    keywords: [
      'retain', 'storage', 'keep', 'maintain', 'delete', 'removal',
      'retention period', 'as long as', 'indefinitely', 'forever'
    ],
    weight: 0.8,
    category: 'Data Retention',
    severity: 'medium',
    description: 'How long your data is kept'
  },
  userRights: {
    keywords: [
      'right to', 'you can', 'opt-out', 'opt out', 'unsubscribe',
      'delete your', 'request deletion', 'access your', 'download your',
      'portability', 'rectification', 'erasure', 'gdpr', 'ccpa'
    ],
    weight: -0.5,
    category: 'User Rights',
    severity: 'info',
    description: 'Your rights regarding your data'
  },
  security: {
    keywords: [
      'encrypt', 'security', 'protect', 'safeguard', 'secure',
      'ssl', 'firewall', 'authentication', 'encryption', 'protect'
    ],
    weight: -0.3,
    category: 'Security Measures',
    severity: 'low',
    description: 'Security measures protecting your data'
  },
  advertising: {
    keywords: [
      'advertisement', 'advertising', 'marketing', 'promotional',
      'targeted ads', 'personalized ads', 'behavioral advertising',
      'profiling', 'interest-based'
    ],
    weight: 0.9,
    category: 'Advertising',
    severity: 'medium',
    description: 'Use of your data for advertising'
  },
  childrenPrivacy: {
    keywords: [
      'children', 'kids', 'under 13', 'under 16', 'minor',
      'coppa', 'parental consent', 'child-directed'
    ],
    weight: 0,
    category: 'Children\'s Privacy',
    severity: 'info',
    description: 'Special considerations for children'
  },
  internationalTransfer: {
    keywords: [
      'international', 'cross-border', 'transfer outside', 'outside the',
      'european union', 'united states', 'data residency'
    ],
    weight: 0.7,
    category: 'International Transfers',
    severity: 'medium',
    description: 'Transfer of data across borders'
  },
  liability: {
    keywords: [
      'liability', 'indemnify', 'hold harmless', 'responsible',
      'not liable', 'no warranty', 'as is', 'use at your own'
    ],
    weight: 0.6,
    category: 'Liability',
    severity: 'warning',
    description: 'Limitations of service provider liability'
  },
  accountTermination: {
    keywords: [
      'terminate', 'suspend', 'ban', 'close your account',
      'cancel', 'deactivate', 'termination', 'delete your account'
    ],
    weight: 0.3,
    category: 'Account Termination',
    severity: 'low',
    description: 'Service termination policies'
  },
  changesToPolicy: {
    keywords: [
      'change', 'update', 'modify', 'revise', 'amend',
      'from time to time', 'periodic', '通知', 'notice'
    ],
    weight: 0.5,
    category: 'Policy Changes',
    severity: 'medium',
    description: 'How the service may change their policies'
  },
  arbitration: {
    keywords: [
      'arbitration', 'class action', 'waiver', 'dispute resolution',
      'litigation', 'lawsuit', 'small claims', 'binding arbitration'
    ],
    weight: 0.8,
    category: 'Legal Rights',
    severity: 'warning',
    description: 'Limitations on legal recourse'
  }
};

const RED_FLAGS = [
  { pattern: /unlimited\s+(liability|indemnif)/i, severity: 'high', message: 'Unlimited liability clause detected' },
  { pattern: /waive.*right.*class\s+action/i, severity: 'high', message: 'Class action waiver found' },
  { pattern: /sell\s+(your\s+)?(personal\s+)?data/i, severity: 'high', message: 'Data selling clause detected' },
  { pattern: /perpetual.*(license|right)/i, severity: 'medium', message: 'Perpetual license or rights detected' },
  { pattern: /bypass.*security/i, severity: 'high', message: 'Security bypass provisions detected' },
  { pattern: /monitor.*without\s+(notice|consent)/i, severity: 'medium', message: 'Undisclosed monitoring detected' },
  { pattern: /track.*keystroke/i, severity: 'high', message: 'Keystroke tracking detected' },
  { pattern: /record.*phone\s+call/i, severity: 'medium', message: 'Call recording without clear consent' },
  { pattern: /facial\s+recognition/i, severity: 'medium', message: 'Facial recognition mentioned' },
  { pattern: /biometric/i, severity: 'medium', message: 'Biometric data collection detected' },
  { pattern: /mental\s+health|therapy|medical/i, severity: 'low', message: 'Health-related data handling' },
  { pattern: /financial.*information|bank\s+account|credit\s+card/i, severity: 'low', message: 'Financial data handling' },
  { pattern: /location.*(continuous|always|real-time)/i, severity: 'medium', message: 'Continuous location tracking' },
  { pattern: /microphone|camera|photos?|voice/i, severity: 'low', message: 'Device sensor access' },
  { pattern: /social\s+security|ssn/i, severity: 'high', message: 'SSN collection mentioned' }
];

const GOOD_INDICATORS = [
  { pattern: /end-to-end\s+encryption/i, message: 'End-to-end encryption mentioned' },
  { pattern: /two-factor|2fa|mfa/i, message: 'Multi-factor authentication available' },
  { pattern: /gdpr\s+compliant/i, message: 'GDPR compliance stated' },
  { pattern: /ccpa\s+compliant/i, message: 'CCPA compliance stated' },
  { pattern: /ferpa/i, message: 'FERPA compliance mentioned (student data)' },
  { pattern: /hipaa/i, message: 'HIPAA compliance mentioned (health data)' },
  { pattern: /annual.*(audit|review|assessment)/i, message: 'Regular security audits mentioned' },
  { pattern: /bug\s+bounty/i, message: 'Bug bounty program in place' },
  { pattern: /data.* minimization/i, message: 'Data minimization principle applied' },
  { pattern: /privacy\s+by\s+design/i, message: 'Privacy by design principles' },
  { pattern: /privacy\s+shield/i, message: 'Privacy Shield certification' },
  { pattern: /iso\s+27001/i, message: 'ISO 27001 certification' },
  { pattern: /soc\s+2/i, message: 'SOC 2 compliance' },
  { pattern: /open\s+source/i, message: 'Open source components' },
  { pattern: /don\'t\s+(sell|share).*(personal|info)/i, message: 'Explicit commitment not to sell data' }
];

function analyzeText(text) {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  const categoryResults = {};
  const findings = [];
  let riskScore = 50;
  let confidenceScore = 0;
  
  for (const [key, config] of Object.entries(RISK_PATTERNS)) {
    const matches = config.keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
    
    if (matches.length > 0) {
      categoryResults[key] = {
        category: config.category,
        description: config.description,
        severity: config.severity,
        matchCount: matches.length,
        matchedKeywords: matches,
        impact: config.weight
      };
      
      confidenceScore += matches.length * 5;
      
      if (config.weight > 0) {
        riskScore += (matches.length * config.weight * 3);
      } else {
        riskScore += (matches.length * config.weight * 2);
      }
    }
  }
  
  const redFlags = [];
  for (const flag of RED_FLAGS) {
    const match = text.match(flag.pattern);
    if (match) {
      redFlags.push({
        message: flag.message,
        severity: flag.severity,
        matchedText: match[0]
      });
      riskScore += flag.severity === 'high' ? 15 : flag.severity === 'medium' ? 8 : 3;
      confidenceScore += 10;
    }
  }
  
  const goodSigns = [];
  for (const indicator of GOOD_INDICATORS) {
    const match = text.match(indicator.pattern);
    if (match) {
      goodSigns.push({
        message: indicator.message,
        matchedText: match[0]
      });
      riskScore -= 5;
      confidenceScore += 5;
    }
  }
  
  riskScore = Math.max(0, Math.min(100, riskScore));
  confidenceScore = Math.min(100, confidenceScore);
  
  const riskLevel = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';
  
  const summary = generateSummary(text, categoryResults, riskScore, riskLevel);
  
  return {
    wordCount,
    riskScore,
    riskLevel,
    confidenceScore: Math.min(100, confidenceScore),
    categories: categoryResults,
    redFlags,
    goodSigns,
    summary,
    analyzedAt: new Date().toISOString()
  };
}

function generateSummary(text, categories, riskScore, riskLevel) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const summaryPoints = [];
  
  const categoryPriorities = ['dataSharing', 'dataCollection', 'security', 'advertising', 'userRights'];
  
  for (const catKey of categoryPriorities) {
    const cat = categories[catKey];
    if (cat && cat.matchCount > 0) {
      const relevantSentences = sentences.filter(s => 
        cat.matchedKeywords.some(kw => s.toLowerCase().includes(kw.toLowerCase()))
      ).slice(0, 2);
      
      if (relevantSentences.length > 0) {
        summaryPoints.push({
          category: cat.category,
          severity: cat.severity,
          points: relevantSentences.map(s => s.trim())
        });
      }
    }
  }
  
  const overallSummary = riskLevel === 'low' 
    ? 'This policy appears to have reasonable privacy protections with clear user rights and moderate data practices.'
    : riskLevel === 'medium'
    ? 'This policy contains some privacy concerns. Review the flagged items carefully before agreeing.'
    : 'This policy has significant privacy implications. The highlighted sections warrant careful attention.';
  
  return {
    overview: overallSummary,
    detailedPoints: summaryPoints
  };
}

function extractKeyClauses(text) {
  const clauses = [];
  const sentenceEnders = /[.!?]+/g;
  const sentences = text.split(sentenceEnders).filter(s => s.trim().length > 50 && s.trim().length < 500);
  
  const importantKeywords = [
    'share', 'collect', 'retain', 'delete', 'third party', 'consent',
    'opt', 'right', 'responsible', 'liable', 'terminate', 'indemnify'
  ];
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    for (const keyword of importantKeywords) {
      if (lowerSentence.includes(keyword)) {
        const trimmed = sentence.trim();
        if (!clauses.some(c => c.text.includes(trimmed.slice(0, 50)))) {
          clauses.push({
            text: trimmed,
            keywords: importantKeywords.filter(k => lowerSentence.includes(k)),
            significance: importantKeywords.filter(k => lowerSentence.includes(k)).length
          });
        }
        break;
      }
    }
  }
  
  return clauses.sort((a, b) => b.significance - a.significance).slice(0, 10);
}

async function fetchAndAnalyzeUrl(url) {
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PolicyLens/1.0; +https://policylens.app)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    const policyText = extractPolicyFromHtml(html, url);
    
    if (!policyText || policyText.length < 200) {
      throw new Error('Could not extract policy content. The page may not have a standard privacy policy format.');
    }
    
    const analysis = analyzeText(policyText);
    const keyClauses = extractKeyClauses(policyText);
    
    return {
      url: normalizedUrl,
      domain: new URL(normalizedUrl).hostname,
      title: extractTitleFromHtml(html) || new URL(normalizedUrl).hostname,
      analysis,
      keyClauses,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to analyze URL: ${error.message}`);
  }
}

function extractPolicyFromHtml(html, url) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  const policySelectors = [
    'policy', 'privacy', 'terms', 'legal', 'agreement', 'disclaimer'
  ];
  
  for (const selector of policySelectors) {
    const elements = doc.querySelectorAll(`[class*="${selector}"], [id*="${selector}"]`);
    for (const el of elements) {
      const text = el.innerText || el.textContent;
      if (text && text.length > 500) {
        return cleanText(text);
      }
    }
  }
  
  const mainContent = doc.querySelector('main, article, [role="main"], #content, .content');
  if (mainContent) {
    return cleanText(mainContent.innerText || mainContent.textContent);
  }
  
  const body = doc.body;
  if (body) {
    const clone = body.cloneNode(true);
    const scripts = clone.querySelectorAll('script, style, nav, header, footer, aside');
    scripts.forEach(s => s.remove());
    return cleanText(clone.innerText || clone.textContent);
  }
  
  return '';
}

function extractTitleFromHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogTitleMatch) {
    return ogTitleMatch[1];
  }
  return null;
}

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, '. ')
    .replace(/\.\s*\./g, '.')
    .trim();
}

function comparePolicies(policy1, policy2) {
  const comparison = {
    riskScores: {
      [policy1.domain]: policy1.analysis.riskScore,
      [policy2.domain]: policy2.analysis.riskScore
    },
    riskLevels: {
      [policy1.domain]: policy1.analysis.riskLevel,
      [policy2.domain]: policy2.analysis.riskLevel
    },
    categories: {},
    differences: [],
    similarities: []
  };
  
  const categories1 = Object.keys(policy1.analysis.categories);
  const categories2 = Object.keys(policy2.analysis.categories);
  const allCategories = [...new Set([...categories1, ...categories2])];
  
  for (const cat of allCategories) {
    const cat1 = policy1.analysis.categories[cat];
    const cat2 = policy2.analysis.categories[cat];
    
    comparison.categories[cat] = {
      [policy1.domain]: cat1 ? { matchCount: cat1.matchCount, severity: cat1.severity } : null,
      [policy2.domain]: cat2 ? { matchCount: cat2.matchCount, severity: cat2.severity } : null
    };
    
    if (cat1 && cat2) {
      if (cat1.matchCount !== cat2.matchCount) {
        const diff = Math.abs(cat1.matchCount - cat2.matchCount);
        comparison.differences.push({
          category: cat1.category,
          type: 'frequency',
          message: `${policy1.domain} mentions "${cat1.category}" ${diff} more time(s) than ${policy2.domain}`
        });
      }
    } else if (cat1 && !cat2) {
      comparison.differences.push({
        category: cat1.category,
        type: 'uniqueness',
        message: `${policy1.domain} explicitly addresses "${cat1.category}" while ${policy2.domain} does not`
      });
    } else if (!cat1 && cat2) {
      comparison.differences.push({
        category: cat2.category,
        type: 'uniqueness',
        message: `${policy2.domain} explicitly addresses "${cat2.category}" while ${policy1.domain} does not`
      });
    }
  }
  
  const flags1 = new Set(policy1.analysis.redFlags.map(f => f.message));
  const flags2 = new Set(policy2.analysis.redFlags.map(f => f.message));
  
  for (const flag of flags1) {
    if (flags2.has(flag)) {
      comparison.similarities.push(`Both policies have: ${flag}`);
    }
  }
  
  const redFlags1 = policy1.analysis.redFlags.map(f => f.message);
  const redFlags2 = policy2.analysis.redFlags.map(f => f.message);
  
  for (const flag of redFlags1) {
    if (!redFlags2.includes(flag)) {
      comparison.differences.push({
        category: 'Red Flag',
        type: 'unique_risk',
        message: `${policy1.domain} has unique concern: ${flag}`
      });
    }
  }
  
  const winner = comparison.riskScores[policy1.domain] <= comparison.riskScores[policy2.domain] 
    ? policy1.domain 
    : policy2.domain;
  
  comparison.summary = {
    winner,
    saferScore: comparison.riskScores[winner],
    riskierScore: comparison.riskScores[policy1.domain] === comparison.riskScores[winner] 
      ? comparison.riskScores[policy2.domain] 
      : comparison.riskScores[policy1.domain],
    recommendation: generateComparisonRecommendation(comparison)
  };
  
  return comparison;
}

function generateComparisonRecommendation(comparison) {
  const scoreDiff = Math.abs(comparison.summary.saferScore - comparison.summary.riskierScore);
  
  if (scoreDiff < 10) {
    return 'Both policies have similar risk profiles. Choose based on other factors like features and usability.';
  } else if (scoreDiff < 25) {
    return `${comparison.summary.winner} has a noticeably better privacy posture, though the difference is moderate.`;
  } else {
    return `${comparison.summary.winner} is significantly safer from a privacy perspective. Consider this carefully before choosing.`;
  }
}

if (typeof window !== 'undefined') {
  window.PolicyLens = {
    analyzeText,
    fetchAndAnalyzeUrl,
    comparePolicies,
    extractKeyClauses
  };
}

export { analyzeText, fetchAndAnalyzeUrl, comparePolicies, extractKeyClauses };
