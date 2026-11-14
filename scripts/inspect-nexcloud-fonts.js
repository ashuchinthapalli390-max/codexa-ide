const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectFonts() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  const fontReport = await page.evaluate(() => {
    // 1. Get all loaded fonts from document.fonts
    const loadedFonts = [];
    document.fonts.forEach(f => {
      loadedFonts.push({
        family: f.family,
        weight: f.weight,
        style: f.style,
        status: f.status
      });
    });

    // 2. Helper to get typography specs
    function getTypo(selector, name) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return { name, found: false };
      const cs = window.getComputedStyle(el);
      return {
        name,
        found: true,
        tag: el.tagName,
        text: el.innerText ? el.innerText.slice(0, 60).replace(/\n/g, ' ') : '',
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform
      };
    }

    const elements = [
      getTypo('body', 'body'),
      getTypo('header nav a', 'navLink'),
      getTypo('header nav button', 'navButton'),
      getTypo('.hero h1', 'heroH1'),
      getTypo('.hero h1 .hero-title-line', 'heroH1Line'),
      getTypo('.hero h1 span span', 'heroH1Rotating'),
      getTypo('.hero-copy', 'heroParagraph'),
      getTypo('.hero-actions .primary-action', 'heroPrimaryBtn'),
      getTypo('.hero-actions .secondary-action', 'heroSecondaryBtn'),
      getTypo('.dashboard-topbar', 'dashboardTopbar'),
      getTypo('.dashboard-sidebar span', 'dashboardSidebarItem'),
      getTypo('.dashboard-content h2', 'dashboardContentH2'),
      getTypo('.metric-card .metric-head strong', 'metricValue'),
      getTypo('.metric-card p', 'metricLabel'),
      getTypo('.partner-strip p', 'partnerStripHeading'),
      getTypo('.partner-tooltip', 'partnerTooltip'),
      getTypo('.promo-banner-container', 'promoBannerText'),
      getTypo('span.uppercase.tracking-widest', 'sectionEyebrow'),
      getTypo('section h2', 'sectionH2'),
      getTypo('section p.text-gray-400', 'sectionSubtitle'),
      getTypo('section div.rounded-xl.p-7 h3', 'productCardTitle'),
      getTypo('section div.rounded-xl.p-7 li span', 'productCardFeatureItem'),
      getTypo('section div.rounded-xl.p-7 button', 'productCardBtn'),
      getTypo('#locations h2', 'infrastructureH2'),
      getTypo('#locations p', 'infrastructureSubtitle'),
      getTypo('section.w-full.bg-\\[\\#0a0b0f\\] h2', 'faqH2'),
      getTypo('section.w-full.bg-\\[\\#0a0b0f\\] button div', 'faqNumber'),
      getTypo('section.w-full.bg-\\[\\#0a0b0f\\] button span', 'faqQuestion'),
      getTypo('footer h3', 'footerCommunityHeading'),
      getTypo('footer p', 'footerCommunityParagraph'),
      getTypo('footer a', 'footerLink')
    ];

    // Collect ALL unique font families used across all rendered elements on page
    const allElements = Array.from(document.querySelectorAll('*'));
    const familyCounts = {};
    allElements.forEach(el => {
      const ff = window.getComputedStyle(el).fontFamily;
      familyCounts[ff] = (familyCounts[ff] || 0) + 1;
    });

    return { loadedFonts, elements, familyCounts };
  });

  console.log(JSON.stringify(fontReport, null, 2));
  await browser.close();
}

inspectFonts().catch(console.error);

