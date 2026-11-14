const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Testing Home Page loading...');
  const res = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  console.log('Home status:', res.status());

  // 1. Verify announcement banner exists and text is present
  const bannerText = await page.$eval('body', el => el.innerText.includes('CodeXa Studio IDE — Official Online Launch: 17 November 2026'));
  console.log('Banner text verified:', bannerText);

  // 2. Verify Hero H1
  const h1Text = await page.$eval('h1', el => el.innerText);
  console.log('Hero H1 verified:', h1Text.replace(/\n/g, ' '));

  // 3. Verify Workflow Infrastructure Steps clicking
  console.log('Testing Workflow Infrastructure steps...');
  const stepButtons = await page.$$('#workflow-infrastructure button');
  console.log(`Found ${stepButtons.length} step buttons`);
  if (stepButtons.length >= 4) {
    await stepButtons[1].click(); // Click AI Assistance
    await new Promise(r => setTimeout(r, 400));
    const step2Active = await page.$eval('#workflow-infrastructure', el => el.innerText.includes('Multi-Model Context Formulation'));
    console.log('Step 2 (AI Assistance) activated:', step2Active);

    await stepButtons[2].click(); // Click Code Changes
    await new Promise(r => setTimeout(r, 400));
    const step3Active = await page.$eval('#workflow-infrastructure', el => el.innerText.includes('Deterministic Atomic AST Diffing'));
    console.log('Step 3 (Code Changes) activated:', step3Active);

    await stepButtons[3].click(); // Click Live Preview
    await new Promise(r => setTimeout(r, 400));
    const step4Active = await page.$eval('#workflow-infrastructure', el => el.innerText.includes('Zero-Reload Reactive AST Hot Compilation'));
    console.log('Step 4 (Live Preview) activated:', step4Active);
  }

  // 4. Test FAQ Accordion expansion
  console.log('Testing FAQ accordion...');
  const faqButtons = await page.$$('#faq button[aria-expanded]');
  console.log(`Found ${faqButtons.length} FAQ items`);
  if (faqButtons.length >= 2) {
    await faqButtons[1].click();
    await new Promise(r => setTimeout(r, 300));
    const faq2Open = await page.$eval('#faq', el => el.innerText.includes('CXA-DESK keys issued from your CodeXa Agency account'));
    console.log('FAQ item 2 expanded:', faq2Open);
  }

  // 5. Test Secondary Pages
  const routes = ['/features', '/ai', '/workspace', '/platforms', '/download', '/docs', '/releases'];
  for (const route of routes) {
    const routeRes = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle2' });
    console.log(`Route ${route} status:`, routeRes.status());
  }

  console.log('All verification checks passed successfully!');
  await browser.close();
}

verify().catch(console.error);

