const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://nexcloud.in/', { waitUntil: 'networkidle2' });

  const growthStyles = await page.evaluate(() => {
    const el = document.querySelector('.growth-section');
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    const inner = el.querySelector('.growth-inner');
    const chart = el.querySelector('.growth-chart');
    return {
      section: {
        bg: cs.backgroundColor,
        padding: cs.padding,
      },
      inner: inner ? {
        display: window.getComputedStyle(inner).display,
        maxWidth: window.getComputedStyle(inner).maxWidth,
        margin: window.getComputedStyle(inner).margin,
      } : null,
      chart: chart ? {
        display: window.getComputedStyle(chart).display,
        gridTemplateColumns: window.getComputedStyle(chart).gridTemplateColumns,
        gap: window.getComputedStyle(chart).gap,
      } : null
    };
  });

  console.log('Growth styles:', growthStyles);
  await browser.close();
})();

