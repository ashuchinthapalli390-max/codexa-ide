const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
    sessionStorage.setItem('codexa_intro_shown_v7', 'true');
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const pricingHeader = await page.$('#pricing .text-center');
  if (pricingHeader) {
    await pricingHeader.screenshot({ path: 'current_our_products.png' });
    console.log('Captured current_our_products.png');
  } else {
    console.log('pricingHeader not found');
  }
  await browser.close();
})();

