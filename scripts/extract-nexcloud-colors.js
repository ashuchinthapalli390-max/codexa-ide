const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractColors() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  const colorData = await page.evaluate(() => {
    function getColors(sel, label) {
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!el) return { label, found: false };
      const cs = window.getComputedStyle(el);
      return {
        label,
        found: true,
        tag: el.tagName,
        className: el.className,
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderColor: cs.borderColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        backgroundImage: cs.backgroundImage
      };
    }

    const sections = Array.from(document.querySelectorAll('section, main, footer, header'));
    const sectionColors = sections.map(sec => {
      const h = sec.querySelector('h1, h2, h3');
      const cs = window.getComputedStyle(sec);
      return {
        heading: h ? h.innerText.slice(0, 40) : null,
        className: sec.className,
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderColor: cs.borderColor,
        boxShadow: cs.boxShadow,
        backgroundImage: cs.backgroundImage
      };
    });

    const elements = [
      getColors('body', 'body'),
      getColors('header', 'header'),
      getColors('header nav', 'headerNav'),
      getColors('header nav a', 'navLink'),
      getColors('header nav a.bg-white\\/10', 'navActiveLink'),
      getColors('.hero-actions .primary-action, a.primary-action', 'primaryButton'),
      getColors('.hero-actions .secondary-action, a.secondary-action', 'secondaryButton'),
      getColors('.hero', 'heroSection'),
      getColors('.hero h1', 'heroHeading'),
      getColors('.hero-copy', 'heroParagraph'),
      getColors('.dashboard-preview', 'dashboardPreview'),
      getColors('.dashboard-topbar', 'dashboardTopbar'),
      getColors('.dashboard-sidebar', 'dashboardSidebar'),
      getColors('.dashboard-sidebar span.selected', 'dashboardSidebarActive'),
      getColors('.dashboard-content', 'dashboardContent'),
      getColors('.metric-card', 'metricCard'),
      getColors('.partner-strip', 'partnerStrip'),
      getColors('.promo-banner-container', 'promoBanner'),
      getColors('div.rounded-xl.p-7', 'productCard'),
      getColors('#locations', 'locationsSection'),
      getColors('section.growth-section', 'growthSection'),
      getColors('section.w-full.bg-\\[\\#0a0b0f\\]', 'faqSection1'),
      getColors('section.w-full.bg-\\[\\#0a0b0f\\] div.rounded-xl', 'faqCard'),
      getColors('section.w-full.bg-\\[\\#0a0b0f\\] button div.w-8', 'faqNumber'),
      getColors('footer.site-footer', 'footer'),
      getColors('footer.site-footer .rounded-lg', 'footerCalloutCard'),
      getColors('footer.site-footer a', 'footerLink')
    ];

    // Scan all CSS rules for background colors, borders, gradients
    const allBgs = new Set();
    const allTextColors = new Set();
    const allBorders = new Set();
    const allShadows = new Set();
    const allGradients = new Set();

    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        allBgs.add(cs.backgroundColor);
      }
      if (cs.color) {
        allTextColors.add(cs.color);
      }
      if (cs.borderColor && cs.borderColor !== 'rgba(0, 0, 0, 0)') {
        allBorders.add(cs.borderColor);
      }
      if (cs.boxShadow && cs.boxShadow !== 'none') {
        allShadows.add(cs.boxShadow);
      }
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        allGradients.add(cs.backgroundImage);
      }
    });

    return {
      elements,
      sectionColors,
      allBgs: Array.from(allBgs),
      allTextColors: Array.from(allTextColors),
      allBorders: Array.from(allBorders),
      allShadows: Array.from(allShadows),
      allGradients: Array.from(allGradients)
    };
  });

  fs.writeFileSync('nexcloud_colors.json', JSON.stringify(colorData, null, 2));
  console.log('Saved nexcloud_colors.json successfully.');
  await browser.close();
}

extractColors().catch(console.error);
