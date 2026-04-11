import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_2jOZRv2O.mjs';
import { manifest } from './manifest_BT7WWAGB.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/analyze.astro.mjs');
const _page3 = () => import('./pages/api/analyze.astro.mjs');
const _page4 = () => import('./pages/brand-analysis/amazon-privacy-policy.astro.mjs');
const _page5 = () => import('./pages/brand-analysis/apple-privacy-policy.astro.mjs');
const _page6 = () => import('./pages/brand-analysis/facebook-privacy-policy.astro.mjs');
const _page7 = () => import('./pages/brand-analysis/google-privacy-policy.astro.mjs');
const _page8 = () => import('./pages/brand-analysis/tiktok-privacy-policy.astro.mjs');
const _page9 = () => import('./pages/compare.astro.mjs');
const _page10 = () => import('./pages/contact.astro.mjs');
const _page11 = () => import('./pages/faq.astro.mjs');
const _page12 = () => import('./pages/guides/automated-compliance-scanning.astro.mjs');
const _page13 = () => import('./pages/guides/cookie-consent-guide.astro.mjs');
const _page14 = () => import('./pages/guides/mobile-app-privacy-policy.astro.mjs');
const _page15 = () => import('./pages/guides/privacy-policy-checker.astro.mjs');
const _page16 = () => import('./pages/guides/saas-privacy-policy.astro.mjs');
const _page17 = () => import('./pages/guides/shopify-privacy-policy.astro.mjs');
const _page18 = () => import('./pages/guides/small-business-privacy-policy.astro.mjs');
const _page19 = () => import('./pages/guides/website-privacy-audit.astro.mjs');
const _page20 = () => import('./pages/guides/wordpress-privacy-policy.astro.mjs');
const _page21 = () => import('./pages/privacy-basics/ccpa-compliance-checklist.astro.mjs');
const _page22 = () => import('./pages/privacy-basics/do-i-need-privacy-policy.astro.mjs');
const _page23 = () => import('./pages/privacy-basics/gdpr-privacy-policy-guide.astro.mjs');
const _page24 = () => import('./pages/privacy-basics/privacy-policy-vs-terms.astro.mjs');
const _page25 = () => import('./pages/privacy-basics/what-is-privacy-policy.astro.mjs');
const _page26 = () => import('./pages/privacy-laws/ccpa.astro.mjs');
const _page27 = () => import('./pages/privacy-laws/coppa.astro.mjs');
const _page28 = () => import('./pages/privacy-laws/data-processing-agreement.astro.mjs');
const _page29 = () => import('./pages/privacy-laws/gdpr.astro.mjs');
const _page30 = () => import('./pages/privacy-laws/gdpr-data-subject-rights.astro.mjs');
const _page31 = () => import('./pages/privacy-laws/gdpr-fines.astro.mjs');
const _page32 = () => import('./pages/privacy-laws/gdpr-vs-ccpa.astro.mjs');
const _page33 = () => import('./pages/privacy-laws/state-privacy-laws.astro.mjs');
const _page34 = () => import('./pages/privacy-policy.astro.mjs');
const _page35 = () => import('./pages/terms-of-service.astro.mjs');
const _page36 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/analyze.astro", _page2],
    ["src/pages/api/analyze.ts", _page3],
    ["src/pages/brand-analysis/amazon-privacy-policy.astro", _page4],
    ["src/pages/brand-analysis/apple-privacy-policy.astro", _page5],
    ["src/pages/brand-analysis/facebook-privacy-policy.astro", _page6],
    ["src/pages/brand-analysis/google-privacy-policy.astro", _page7],
    ["src/pages/brand-analysis/tiktok-privacy-policy.astro", _page8],
    ["src/pages/compare.astro", _page9],
    ["src/pages/contact.astro", _page10],
    ["src/pages/faq.astro", _page11],
    ["src/pages/guides/automated-compliance-scanning.astro", _page12],
    ["src/pages/guides/cookie-consent-guide.astro", _page13],
    ["src/pages/guides/mobile-app-privacy-policy.astro", _page14],
    ["src/pages/guides/privacy-policy-checker.astro", _page15],
    ["src/pages/guides/saas-privacy-policy.astro", _page16],
    ["src/pages/guides/shopify-privacy-policy.astro", _page17],
    ["src/pages/guides/small-business-privacy-policy.astro", _page18],
    ["src/pages/guides/website-privacy-audit.astro", _page19],
    ["src/pages/guides/wordpress-privacy-policy.astro", _page20],
    ["src/pages/privacy-basics/ccpa-compliance-checklist.astro", _page21],
    ["src/pages/privacy-basics/do-i-need-privacy-policy.astro", _page22],
    ["src/pages/privacy-basics/gdpr-privacy-policy-guide.astro", _page23],
    ["src/pages/privacy-basics/privacy-policy-vs-terms.astro", _page24],
    ["src/pages/privacy-basics/what-is-privacy-policy.astro", _page25],
    ["src/pages/privacy-laws/ccpa.astro", _page26],
    ["src/pages/privacy-laws/coppa.astro", _page27],
    ["src/pages/privacy-laws/data-processing-agreement.astro", _page28],
    ["src/pages/privacy-laws/gdpr.astro", _page29],
    ["src/pages/privacy-laws/gdpr-data-subject-rights.astro", _page30],
    ["src/pages/privacy-laws/gdpr-fines.astro", _page31],
    ["src/pages/privacy-laws/gdpr-vs-ccpa.astro", _page32],
    ["src/pages/privacy-laws/state-privacy-laws.astro", _page33],
    ["src/pages/privacy-policy.astro", _page34],
    ["src/pages/terms-of-service.astro", _page35],
    ["src/pages/index.astro", _page36]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2834809c-5dd3-4add-add5-b0cf2ca51206",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
