const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { width: 1355, height: 900, name: '1355px_desktop' },
  { width: 1200, height: 900, name: '1200px_desktop' },
  { width: 1440, height: 900, name: '1440px_desktop' },
  { width: 1024, height: 800, name: '1024px_tablet' },
  { width: 768, height: 800, name: '768px_tablet' },
  { width: 390, height: 844, name: '390px_mobile' }
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
      sessionStorage.setItem('codexa_intro_shown_v7', 'true');
    });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    const header = await page.$('header');
    if (header) {
      await header.screenshot({ path: `header_${vp.name}_before.png` });
      console.log(`Saved header_${vp.name}_before.png`);
    }
    await page.close();
  }

  await browser.close();
})();

