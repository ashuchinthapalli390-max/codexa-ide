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

  const rawHtml = fs.readFileSync('nexcloud_raw.html', 'utf8');
  const realCss = fs.readFileSync('nexcloud_real.css', 'utf8');
  const sections = JSON.parse(fs.readFileSync('nexcloud_full_sections.json', 'utf8'));

  // Put together the exact pricing section with real css
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Orbitron:wght@400..900&family=Quicksand:wght@300..700&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
        <style>
          ${realCss}
        </style>
      </head>
      <body>
        ${sections.pricingHtml || ''}
      </body>
    </html>
  `;

  await page.setContent(fullHtml, { waitUntil: 'networkidle2' });

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

  console.log('NexCloud exact computed styles:', JSON.stringify(typo, null, 2));

  // Screenshot the exact header
  const header = await page.$('#pricing div.text-center');
  if (header) {
    await header.screenshot({ path: 'nexcloud_rendered_header.png' });
    console.log('Saved nexcloud_rendered_header.png');
  }

  await browser.close();
})();

