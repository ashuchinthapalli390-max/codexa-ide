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
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  // Dismiss offer popup in storage
  await page.evaluate(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  });

  // Visit /pricing
  await page.goto('http://localhost:3000/pricing', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // 1. Capture Model Access Matrix
  const sections = await page.$$('section');
  for (const s of sections) {
    const text = await page.evaluate(el => el.textContent, s);
    if (text.includes('AI Model Access Matrix')) {
      // Expand Astra 6 row (3rd row)
      const rows = await s.$$('tbody tr');
      if (rows && rows.length > 2) {
        await rows[2].click();
        await new Promise(r => setTimeout(r, 400));
      }
      await s.screenshot({ path: path.join(OUT, 'v7_model_access_matrix_clean.png') });
      console.log('Saved v7_model_access_matrix_clean.png');
      break;
    }
  }

  // 2. Click Pre-Book Pro to open checkout drawer
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Pre-Book Pro')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      const modal = await page.$('div[role="dialog"]');
      if (modal) {
        await modal.screenshot({ path: path.join(OUT, 'v7_prebooking_checkout_modal_clean.png') });
        console.log('Saved v7_prebooking_checkout_modal_clean.png');
      }
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
