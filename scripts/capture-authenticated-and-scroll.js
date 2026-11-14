const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  // 1. Scrolled state at 1355px
  const page = await browser.newPage();
  await page.setViewport({ width: 1355, height: 900 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
    sessionStorage.setItem('codexa_intro_shown_v7', 'true');
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: 'v8_1355px_scrolled_state.png', clip: { x: 0, y: 0, width: 1355, height: 180 } });
  console.log('Captured v8_1355px_scrolled_state.png');

  // 2. Authenticated state at 1355px
  // Simulate login via API
  await page.evaluate(async () => {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'CXA-TEST-ENTITLEMENT' })
    });
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'v8_1355px_authenticated_state.png', clip: { x: 0, y: 0, width: 1355, height: 120 } });
  console.log('Captured v8_1355px_authenticated_state.png');

  // 3. Open Account Menu
  const accountBtn = await page.$('header button[aria-haspopup="true"]');
  if (accountBtn) {
    await accountBtn.click();
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: 'v8_1355px_account_menu_open.png', clip: { x: 900, y: 0, width: 455, height: 350 } });
    console.log('Captured v8_1355px_account_menu_open.png');
  }

  await browser.close();
  console.log('Done.');
})();

