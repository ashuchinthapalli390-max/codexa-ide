const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  // 1. First visit test & cinematic intro
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 450));
  await page.screenshot({ path: path.join(OUT, 'v7_cinematic_intro.png') });
  console.log('Saved v7_cinematic_intro.png');

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(OUT, 'v7_hero_post_intro.png'),
    clip: { x: 0, y: 0, width: 1440, height: 950 }
  });
  console.log('Saved v7_hero_post_intro.png');

  // 2. Trigger Special Offer Modal
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-codexa-offer'));
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, 'v7_special_offer_modal.png') });
  console.log('Saved v7_special_offer_modal.png');

  // Copy code test
  const copyBtn = await page.$('button[aria-label="Copy coupon code"]');
  if (copyBtn) {
    await copyBtn.click();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT, 'v7_special_offer_copied.png') });
    console.log('Saved v7_special_offer_copied.png');
  }

  // Dismiss modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 3. Pre-Beta Pricing Section
  const pricingSection = await page.$('#prebeta-pricing');
  if (pricingSection) {
    await page.evaluate(() => {
      document.querySelector('#prebeta-pricing').scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 500));
    await pricingSection.screenshot({ path: path.join(OUT, 'v7_prebeta_pricing_section.png') });
    console.log('Saved v7_prebeta_pricing_section.png');

    // Click Pre-Book Pro to open checkout drawer
    const prebookButtons = await pricingSection.$$('button');
    for (const btn of prebookButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Pre-Book Pro')) {
        await btn.click();
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: path.join(OUT, 'v7_prebooking_checkout_modal.png') });
        console.log('Saved v7_prebooking_checkout_modal.png');
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 400));
        break;
      }
    }
  }

  // 4. AI Model Access Matrix
  const sections = await page.$$('section');
  for (const s of sections) {
    const text = await page.evaluate(el => el.textContent, s);
    if (text.includes('AI Model Access Matrix')) {
      await page.evaluate((el) => {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, s);
      await new Promise(r => setTimeout(r, 500));

      // Click first model row to expand
      const row = await s.$('tbody tr');
      if (row) await row.click();
      await new Promise(r => setTimeout(r, 400));

      await s.screenshot({ path: path.join(OUT, 'v7_model_access_matrix.png') });
      console.log('Saved v7_model_access_matrix.png');
      break;
    }
  }

  // 5. Navigate to Usage Dashboard
  await page.goto('http://localhost:3000/workspace/usage', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(OUT, 'v7_usage_dashboard.png'),
    fullPage: true
  });
  console.log('Saved v7_usage_dashboard.png');

  // Trigger test simulator
  const sendBtn = await page.$('button[type="submit"]');
  if (sendBtn) {
    await sendBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(OUT, 'v7_usage_dashboard_after_simulation.png'),
      fullPage: true
    });
    console.log('Saved v7_usage_dashboard_after_simulation.png');
  }

  // 6. Navigate to Admin Panel
  await page.goto('http://localhost:3000/admin/plans', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(OUT, 'v7_admin_plans_panel.png'),
    fullPage: true
  });
  console.log('Saved v7_admin_plans_panel.png');

  // 7. Mobile 390px Viewport Verification
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // Open Offer on mobile
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('open-codexa-offer'));
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, 'v7_mobile_special_offer.png') });
  console.log('Saved v7_mobile_special_offer.png');

  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  const mobilePricing = await page.$('#prebeta-pricing');
  if (mobilePricing) {
    await mobilePricing.screenshot({ path: path.join(OUT, 'v7_mobile_prebeta_pricing.png') });
    console.log('Saved v7_mobile_prebeta_pricing.png');
  }

  await browser.close();
  console.log('All V7 verification tests completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
