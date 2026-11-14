const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectDeep() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  const audit = await page.evaluate(() => {
    function getOuter(sel) {
      const el = document.querySelector(sel);
      return el ? el.outerHTML : null;
    }

    // Inspect header & mega menu
    const headerHtml = document.querySelector('header') ? document.querySelector('header').outerHTML : '';

    // Inspect hero
    const heroEl = document.querySelector('.hero');
    const heroHeadline = heroEl ? heroEl.querySelector('h1').outerHTML : '';
    const heroCopy = heroEl ? heroEl.querySelector('.hero-copy').outerHTML : '';
    const heroActions = heroEl ? heroEl.querySelector('.hero-actions').outerHTML : '';

    // Inspect promo banner / ticker
    const tickerEl = document.querySelector('.promo-banner-container');
    const tickerHtml = tickerEl ? tickerEl.outerHTML : '';

    // Inspect pricing / products
    const pricingEl = document.querySelector('#pricing');
    const pricingHtml = pricingEl ? pricingEl.outerHTML : '';

    // Inspect locations / map
    const locationsEl = document.querySelector('#locations');
    const locationsHtml = locationsEl ? locationsEl.outerHTML : '';

    // Inspect growth / stats
    const growthEl = document.querySelector('.growth-section');
    const growthHtml = growthEl ? growthEl.outerHTML : '';

    // Inspect Built for Performance
    const sections = Array.from(document.querySelectorAll('section'));
    const perfEl = sections.find(s => s.innerText && s.innerText.includes('Built for Performance'));
    const perfHtml = perfEl ? perfEl.outerHTML : '';

    // Inspect reviews / marquee
    const reviewsEl = document.querySelector('#reviews');
    const reviewsHtml = reviewsEl ? reviewsEl.outerHTML : '';

    // Inspect FAQ
    const faqEl = document.querySelector('#faq');
    const faqHtml = faqEl ? faqEl.outerHTML : '';

    // Inspect Articles
    const articlesEl = sections.find(s => s.innerText && s.innerText.includes('Related Articles'));
    const articlesHtml = articlesEl ? articlesEl.outerHTML : '';

    // Inspect Footer
    const footerEl = document.querySelector('footer');
    const footerHtml = footerEl ? footerEl.outerHTML : '';

    return {
      headerHtml,
      heroHeadline,
      heroCopy,
      heroActions,
      tickerHtml,
      pricingHtml,
      locationsHtml,
      growthHtml,
      perfHtml,
      reviewsHtml,
      faqHtml,
      articlesHtml,
      footerHtml
    };
  });

  fs.writeFileSync('nexcloud_full_sections.json', JSON.stringify(audit, null, 2));
  console.log('Saved nexcloud_full_sections.json successfully.');

  // Also test hovering nav to capture mega menu
  const navTriggers = await page.$$('header nav a, header nav button, header nav > div');
  console.log('Found nav triggers:', navTriggers.length);

  await browser.close();
}

inspectDeep().catch(console.error);

