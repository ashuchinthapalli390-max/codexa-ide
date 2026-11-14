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
  try {
    await page.goto('https://nexcloud.in/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const typo = await page.evaluate(() => {
      const elH2 = document.querySelector('#pricing h2');
      const elEyebrow = document.querySelector('#pricing span');
      const csH2 = window.getComputedStyle(elH2);
      const csEye = window.getComputedStyle(elEyebrow);
      return {
        h2: {
          text: elH2 ? elH2.innerText : null,
          fontFamily: csH2.fontFamily,
          fontSize: csH2.fontSize,
          fontWeight: csH2.fontWeight,
          letterSpacing: csH2.letterSpacing,
          lineHeight: csH2.lineHeight,
          color: csH2.color
        },
        eyebrow: {
          text: elEyebrow ? elEyebrow.innerText : null,
          fontFamily: csEye.fontFamily,
          fontSize: csEye.fontSize,
          fontWeight: csEye.fontWeight,
          letterSpacing: csEye.letterSpacing,
          color: csEye.color
        }
      };
    });
    console.log('NexCloud live styles:', JSON.stringify(typo, null, 2));

    // Also take screenshot of #pricing header
    const header = await page.$('#pricing div.text-center');
    if (header) {
      await header.screenshot({ path: 'nexcloud_pricing_header.png' });
      console.log('Captured nexcloud_pricing_header.png');
    }
  } catch (err) {
    console.error('Error on nexcloud live:', err.message);
  }
  await browser.close();
})();

