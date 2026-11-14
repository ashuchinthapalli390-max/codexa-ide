const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hide sticky header temporarily for clean section screenshots
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.position = 'relative';
  });

  // 2. Capture #pricing (Our Products)
  const pricing = await page.$('#pricing');
  if (pricing) {
    await pricing.screenshot({ path: path.join(OUT, 'v6_verified_our_products.png') });
    console.log('Saved v6_verified_our_products.png');
  }

  // 3. Capture .growth-section
  const growth = await page.$('.growth-section');
  if (growth) {
    await growth.screenshot({ path: path.join(OUT, 'v6_verified_growth.png') });
    console.log('Saved v6_verified_growth.png');
  }

  // 4. Capture #workflow-infrastructure
  const wf = await page.$('#workflow-infrastructure');
  if (wf) {
    await wf.screenshot({ path: path.join(OUT, 'v6_verified_workflow.png') });
    console.log('Saved v6_verified_workflow.png');
  }

  // 5. Restore header and hover mega menu
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.position = 'sticky';
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 500));

  const navLinks = await page.$$('header nav a');
  for (const l of navLinks) {
    const text = await page.evaluate(el => el.textContent, l);
    if (text.includes('Features')) {
      await l.hover();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({
        path: path.join(OUT, 'v6_verified_mega_menu.png'),
        clip: { x: 0, y: 0, width: 1440, height: 500 }
      });
      console.log('Saved v6_verified_mega_menu.png');
      break;
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

