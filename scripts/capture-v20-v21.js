/**
 * CodeXa Studio IDE - Visual Verification Script for V20 (OpenAI Astra Spiral) & V21 (Claude Cosmic Horizon)
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

  console.log('Navigating to http://localhost:3000#ai-ecosystem...');
  await page.goto('http://localhost:3000#ai-ecosystem', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture OpenAI Astra Spiral Scene (Desktop)
  console.log('Selecting OpenAI Scene...');
  // Click button containing "01 OpenAI"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('01 OpenAI')) {
      await btn.click();
      break;
    }
  }

  // Also simulate mouse movement over the stage to verify cursor deflection physics
  await page.mouse.move(720, 500);
  await new Promise(r => setTimeout(r, 1500));

  const ecosystemSection = await page.$('#ai-ecosystem');
  if (ecosystemSection) {
    const openaiPath = path.join(ARTIFACT_DIR, 'v20_openai_astra_spiral.png');
    await ecosystemSection.screenshot({ path: openaiPath });
    console.log(`Saved screenshot: ${openaiPath}`);
  }

  // 2. Capture Claude Cosmic Horizon Scene (Desktop)
  console.log('Selecting Claude Scene (V21)...');
  const buttonsAgain = await page.$$('button');
  for (const btn of buttonsAgain) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('02 Claude')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  if (ecosystemSection) {
    const claudePath = path.join(ARTIFACT_DIR, 'v21_claude_cosmic_horizon.png');
    await ecosystemSection.screenshot({ path: claudePath });
    console.log(`Saved screenshot: ${claudePath}`);
  }

  // 3. Capture Claude on Mobile Viewport
  console.log('Testing mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 1000));

  const mobileEcosystem = await page.$('#ai-ecosystem');
  if (mobileEcosystem) {
    const mobileClaudePath = path.join(ARTIFACT_DIR, 'v21_mobile_claude.png');
    await mobileEcosystem.screenshot({ path: mobileClaudePath });
    console.log(`Saved screenshot: ${mobileClaudePath}`);
  }

  // 4. Capture OpenAI on Mobile Viewport
  const mobileButtons = await page.$$('button');
  for (const btn of mobileButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('01 OpenAI')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  if (mobileEcosystem) {
    const mobileOpenaiPath = path.join(ARTIFACT_DIR, 'v20_mobile_openai.png');
    await mobileEcosystem.screenshot({ path: mobileOpenaiPath });
    console.log(`Saved screenshot: ${mobileOpenaiPath}`);
  }

  await browser.close();
  console.log('V20 & V21 captures completed successfully!');
}

capture().catch((e) => {
  console.error('Capture error:', e);
  process.exit(1);
});
