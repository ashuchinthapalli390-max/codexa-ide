const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop 1440
  console.log('Capturing Desktop 1440px...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_desktop_1440_full.png'), fullPage: true });

  // Tablet 1024
  console.log('Capturing Tablet 1024px...');
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_tablet_1024_full.png'), fullPage: true });

  // Mobile 390
  console.log('Capturing Mobile 390px...');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'codexa_mobile_390_full.png'), fullPage: true });

  console.log('All screenshots captured successfully.');
  await browser.close();
}

run().catch(console.error);

