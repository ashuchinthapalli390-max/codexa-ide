const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Test 1440px
  console.log('Navigating to https://nexcloud.in/ at 1440px...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await page.evaluate(() => {
    // Collect DOM structure
    function getDetails(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.slice(0, 100).replace(/\n/g, ' ') : '',
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        width: rect.width,
        height: rect.height,
        top: rect.top,
      };
    }

    // Get announcement banner
    const banner = document.querySelector('[role="alert"], [class*="banner"], [class*="announcement"], [class*="notice"]') || document.querySelector('header')?.previousElementSibling || document.body.firstElementChild;
    
    // Get header / nav
    const nav = document.querySelector('nav') || document.querySelector('header');
    
    // Get hero
    const h1 = document.querySelector('h1');
    const heroSection = h1 ? h1.closest('section') || h1.parentElement?.parentElement : null;
    
    // Get all sections
    const sections = Array.from(document.querySelectorAll('section, main > div, #root > div > div')).map(sec => {
      const heading = sec.querySelector('h1, h2, h3');
      const cs = window.getComputedStyle(sec);
      return {
        tag: sec.tagName,
        className: sec.className,
        heading: heading ? heading.innerText.trim() : null,
        bg: cs.backgroundColor,
        padding: cs.padding,
        childrenCount: sec.children.length,
        textSample: sec.innerText ? sec.innerText.slice(0, 200).replace(/\s+/g, ' ') : ''
      };
    });

    // Get cards
    const cardCandidates = Array.from(document.querySelectorAll('[class*="card"], [class*="Card"], [class*="rounded-"], [class*="border-"]')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 200 && r.height > 150 && r.width < 800;
    }).slice(0, 8).map(getDetails);

    // Get buttons
    const buttons = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="button"], a[class*="rounded"]')).slice(0, 10).map(getDetails);

    // Get FAQ items
    const faqElements = Array.from(document.querySelectorAll('[class*="accordion"], [class*="faq"], details, [class*="collapse"]')).slice(0, 6).map(getDetails);

    // Get footer
    const footer = document.querySelector('footer');

    return {
      title: document.title,
      banner: getDetails(banner),
      nav: getDetails(nav),
      hero: getDetails(heroSection),
      h1: getDetails(h1),
      sections,
      cards: cardCandidates,
      buttons,
      faqElements,
      footer: getDetails(footer)
    };
  });

  console.log('Page info extracted.');
  fs.writeFileSync(path.join(OUT_DIR, 'nexcloud_analysis.json'), JSON.stringify(pageInfo, null, 2));

  // Take full screenshot at 1440
  await page.screenshot({ path: path.join(OUT_DIR, 'nexcloud_desktop_1440.png'), fullPage: true });
  console.log('Saved 1440px screenshot');

  // Tablet 1024
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'nexcloud_tablet_1024.png'), fullPage: true });
  console.log('Saved 1024px screenshot');

  // Mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'nexcloud_mobile_390.png'), fullPage: true });
  console.log('Saved 390px screenshot');

  await browser.close();
}

run().catch(console.error);

