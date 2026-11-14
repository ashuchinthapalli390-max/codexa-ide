const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  // Hover over the first nav dropdown button
  const buttons = await page.$$('header nav button');
  console.log('Nav buttons found:', buttons.length);
  if (buttons.length > 0) {
    await buttons[0].hover();
    await new Promise(r => setTimeout(r, 800));
  }

  const dropdowns = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll('header .group'));
    return groups.map(g => {
      const btn = g.querySelector('button');
      const drop = g.querySelector('div');
      return {
        buttonText: btn ? btn.innerText.trim() : null,
        hasDropdownDiv: !!drop,
        dropdownClassName: drop ? drop.className : null,
        dropdownHtml: drop ? drop.outerHTML : null
      };
    });
  });

  fs.writeFileSync('nexcloud_nav_dropdowns.json', JSON.stringify(dropdowns, null, 2));
  console.log('Saved nexcloud_nav_dropdowns.json');

  await browser.close();
})();

