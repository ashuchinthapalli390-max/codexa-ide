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
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.position = 'relative';
  });

  const pricing = await page.$('#pricing');
  if (pricing) {
    await pricing.screenshot({ path: path.join(OUT, 'v6_mobile_390_our_products.png') });
    console.log('Saved v6_mobile_390_our_products.png');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

