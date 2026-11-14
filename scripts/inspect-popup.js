const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const pageData = await page.evaluate(() => {
    // Search html text for coupon or offer
    const html = document.body.innerHTML;
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerHTML.substring(0, 200));
    const modals = Array.from(document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="popup"], [class*="banner"]')).map(m => ({
      class: m.className,
      html: m.outerHTML.substring(0, 300)
    }));
    return { scripts, modals, hasCoupon: html.toLowerCase().includes('coupon'), hasOffer: html.toLowerCase().includes('special offer') };
  });

  console.log('Result:', JSON.stringify(pageData, null, 2));
  await browser.close();
})();

