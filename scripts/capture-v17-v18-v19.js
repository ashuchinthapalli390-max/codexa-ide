/**
 * CodeXa Studio IDE - Visual Capture Script for V17, V18, V19
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
  console.log('Launching headless browser with executable:', executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Capture Ecosystem Section
  console.log('Navigating to http://localhost:3000#ai-ecosystem...');
  await page.goto('http://localhost:3000#ai-ecosystem', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const ecosystemSection = await page.$('#ai-ecosystem');
  if (ecosystemSection) {
    const screenshotPath = path.join(ARTIFACT_DIR, 'v17_cinematic_ecosystem.png');
    await ecosystemSection.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: ${screenshotPath}`);
  }

  // 2. Set Leadership Cookie & Capture Pricing Exemption Banner
  console.log('Setting leadership cookie and visiting /pricing...');
  const leaderCookieVal = encodeURIComponent(JSON.stringify({
    uid: 'founder_ashu_01',
    email: 'ashuchinthapalli3900@gmail.com',
    displayName: 'Ashu Chinthapalli'
  }));
  await page.setCookie({
    name: 'cxa_session',
    value: leaderCookieVal,
    domain: 'localhost',
    path: '/',
  });

  await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const pricingPath = path.join(ARTIFACT_DIR, 'v19_leadership_pricing_exemption.png');
  await page.screenshot({ path: pricingPath, fullPage: false });
  console.log(`Saved screenshot: ${pricingPath}`);

  // 3. Capture Download Page
  console.log('Visiting /download...');
  await page.goto('http://localhost:3000/download', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const downloadPath = path.join(ARTIFACT_DIR, 'v19_download_center.png');
  await page.screenshot({ path: downloadPath, fullPage: false });
  console.log(`Saved screenshot: ${downloadPath}`);

  // 4. Capture Founder Control Center
  console.log('Visiting /founder...');
  await page.goto('http://localhost:3000/founder', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const founderPath = path.join(ARTIFACT_DIR, 'v19_founder_control_center.png');
  await page.screenshot({ path: founderPath, fullPage: false });
  console.log(`Saved screenshot: ${founderPath}`);

  // 5. Capture Account Access Pillars
  console.log('Visiting /account/access...');
  await page.goto('http://localhost:3000/account/access', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const accessPath = path.join(ARTIFACT_DIR, 'v19_account_access_pillars.png');
  await page.screenshot({ path: accessPath, fullPage: false });
  console.log(`Saved screenshot: ${accessPath}`);

  await browser.close();
  console.log('All visual captures completed successfully.');
}

capture().catch((e) => {
  console.error('Capture error:', e);
  process.exit(1);
});
