const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function compare() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const report = await page.evaluate(() => {
    function getSpecs(selector, name) {
      const el = document.querySelector(selector);
      if (!el) return { name, found: false };
      const cs = window.getComputedStyle(el);
      return {
        name,
        found: true,
        text: el.innerText ? el.innerText.slice(0, 45).replace(/\n/g, ' ') : '',
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderColor: cs.borderColor,
        borderRadius: cs.borderRadius
      };
    }

    return {
      body: getSpecs('body', 'body'),
      navLink: getSpecs('header nav a', 'navLink'),
      heroH1: getSpecs('h1 span:first-child', 'heroH1'),
      heroPrimaryBtn: getSpecs('a[href="/download"].h-11', 'heroPrimaryBtn'),
      heroSecondaryBtn: getSpecs('a[href="/features"].h-11', 'heroSecondaryBtn'),
      productEyebrow: getSpecs('#products span.uppercase', 'productEyebrow'),
      productH2: getSpecs('#products h2', 'productH2'),
      productCard: getSpecs('#products .grid > div', 'productCard'),
      infraH2: getSpecs('#workflow-infrastructure h2', 'infraH2'),
      infraPreview: getSpecs('#workflow-infrastructure .rounded-2xl', 'infraPreview'),
      faqH2: getSpecs('#faq h2', 'faqH2'),
      faqCard: getSpecs('#faq .space-y-3 > div', 'faqCard'),
      footerCallout: getSpecs('footer .rounded-lg', 'footerCallout'),
      footerCtaBtn: getSpecs('footer a.rounded-\\[4px\\]', 'footerCtaBtn')
    };
  });

  console.log('=== CODEXA COMPUTED SPECS (TYPOGRAPHY + COLOURS) ===');
  console.log(JSON.stringify(report, null, 2));

  // Capture element screenshot of the "PURCHASE" + "Our Products" heading header
  const productHeader = await page.$('#products > div > div:first-child');
  if (productHeader) {
    await productHeader.screenshot({ path: path.join(OUT_DIR, 'codexa_our_products_heading.png') });
    console.log('Saved codexa_our_products_heading.png');
  }

  // Full products section screenshot
  const productSection = await page.$('#products');
  if (productSection) {
    await productSection.screenshot({ path: path.join(OUT_DIR, 'codexa_products_section.png') });
    console.log('Saved codexa_products_section.png');
  }

  // Capture 1440px desktop full page
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_desktop_1440_nexcloud.png'), fullPage: true });
  console.log('Saved codexa_desktop_1440_nexcloud.png');

  // Capture 1024px tablet full page
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_tablet_1024_nexcloud.png'), fullPage: true });
  console.log('Saved codexa_tablet_1024_nexcloud.png');

  // Capture 390px mobile full page
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_mobile_390_nexcloud.png'), fullPage: true });
  console.log('Saved codexa_mobile_390_nexcloud.png');

  await browser.close();
}

compare().catch(console.error);
