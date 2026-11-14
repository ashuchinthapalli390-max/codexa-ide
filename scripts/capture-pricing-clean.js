/**
 * Visual verification of cleaned pricing section:
 * - Desktop (1440x900)
 * - Mobile (390x844)
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const executablePath = chromePaths.find(p => fs.existsSync(p));

if (!executablePath) {
  console.error('No compatible Chromium binary found.');
  process.exit(1);
}

const ARTIFACT_DIR = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3000/pricing...');
  await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const pricingSection = await page.$('#pricing');
  if (pricingSection) {
    const desktopPath = path.join(ARTIFACT_DIR, 'v22_pricing_cards_desktop.png');
    await pricingSection.screenshot({ path: desktopPath });
    console.log(`Saved desktop pricing screenshot: ${desktopPath}`);
  }

  // Mobile Viewport (390x844)
  console.log('Testing mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 1000));

  const mobilePricingSection = await page.$('#pricing');
  if (mobilePricingSection) {
    const mobilePath = path.join(ARTIFACT_DIR, 'v22_pricing_cards_mobile.png');
    await mobilePricingSection.screenshot({ path: mobilePath });
    console.log(`Saved mobile pricing screenshot: ${mobilePath}`);
  }

  await browser.close();
  console.log('Pricing captures completed successfully!');
}

capture().catch((e) => {
  console.error('Capture error:', e);
  process.exit(1);
});
