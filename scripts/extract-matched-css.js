const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  const cssRules = await page.evaluate(() => {
    const matched = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && (
            rule.selectorText.includes('growth') ||
            rule.selectorText.includes('promo') ||
            rule.selectorText.includes('hero')
          )) {
            matched.push(rule.cssText);
          }
        }
      } catch (e) {}
    }
    return matched;
  });

  fs.writeFileSync('nexcloud_matched_css.json', JSON.stringify(cssRules, null, 2));
  console.log('Saved nexcloud_matched_css.json with count:', cssRules.length);
  await browser.close();
})();

