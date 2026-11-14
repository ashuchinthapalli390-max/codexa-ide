const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1355, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const metrics = await page.evaluate(() => {
    const navLinks = Array.from(document.querySelectorAll('header nav a, header nav button, header nav span'));
    const buttons = Array.from(document.querySelectorAll('header div.hidden.md\\:flex *'));
    
    return {
      navItems: navLinks.map(el => ({
        text: el.innerText ? el.innerText.trim().replace(/\n/g, ' ') : '',
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        whiteSpace: window.getComputedStyle(el).whiteSpace
      })),
      cta: buttons.map(el => ({
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim().replace(/\n/g, ' ') : '',
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height
      }))
    };
  });

  console.log('Metrics at 1355px:', JSON.stringify(metrics, null, 2));
  await browser.close();
})();

