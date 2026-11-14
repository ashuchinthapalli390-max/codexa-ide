const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const artifactDir = path.resolve('C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop (1440 x 950)
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture Mega Menu
  try {
    const navButtons = await page.$$('nav a');
    for (const btn of navButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Features')) {
        await btn.hover();
        await new Promise(r => setTimeout(r, 700));
        await page.screenshot({
          path: path.join(artifactDir, 'v6_desktop_mega_menu.png'),
          clip: { x: 0, y: 0, width: 1440, height: 550 }
        });
        console.log('Saved v6_desktop_mega_menu.png');
        break;
      }
    }
  } catch (err) {
    console.error('Mega menu error:', err);
  }

  // Move mouse away to close mega-menu
  await page.mouse.move(0, 800);
  await new Promise(r => setTimeout(r, 500));

  // 2. Scroll to and capture "Our Products" heading and full section with clearance
  const productsBox = await page.evaluate(() => {
    const el = document.querySelector('#pricing');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      height: rect.height,
      width: rect.width
    };
  });

  if (productsBox) {
    // Scroll so pricing is in the middle of viewport, below the 100px header
    await page.evaluate((top) => {
      window.scrollTo(0, top - 120);
    }, productsBox.top);
    await new Promise(r => setTimeout(r, 600));

    // Capture heading crop
    const headingBox = await page.evaluate(() => {
      const h2 = document.querySelector('#pricing h2');
      const span = document.querySelector('#pricing span');
      if (!h2 || !span) return null;
      const rH2 = h2.getBoundingClientRect();
      const rSpan = span.getBoundingClientRect();
      return {
        x: Math.max(0, rH2.x - 120),
        y: Math.max(0, rSpan.y - 30),
        width: rH2.width + 240,
        height: rH2.bottom - rSpan.top + 60
      };
    });

    if (headingBox) {
      await page.screenshot({
        path: path.join(artifactDir, 'v6_our_products_heading_crop.png'),
        clip: headingBox
      });
      console.log('Saved v6_our_products_heading_crop.png');
    }

    // Capture full section
    await page.evaluate((top) => {
      window.scrollTo(0, top - 110);
    }, productsBox.top);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(artifactDir, 'v6_our_products_section.png'),
      clip: { x: 0, y: 110, width: 1440, height: 860 }
    });
    console.log('Saved v6_our_products_section.png');
  }

  // 3. Scroll to Growth section and capture
  const growthBox = await page.evaluate(() => {
    const el = document.querySelector('.growth-section');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop };
  });

  if (growthBox) {
    await page.evaluate((top) => {
      window.scrollTo(0, top - 110);
    }, growthBox.top);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(artifactDir, 'v6_growth_section.png'),
      clip: { x: 0, y: 110, width: 1440, height: 580 }
    });
    console.log('Saved v6_growth_section.png');
  }

  // 4. Capture Full Page Desktop (1440)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(artifactDir, 'v6_codexa_desktop_1440_full.png'),
    fullPage: true
  });
  console.log('Saved v6_codexa_desktop_1440_full.png');

  // 5. Tablet Full Page (1024)
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactDir, 'v6_codexa_tablet_1024_full.png'),
    fullPage: true
  });
  console.log('Saved v6_codexa_tablet_1024_full.png');

  // 6. Mobile Full Page (390)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactDir, 'v6_codexa_mobile_390_full.png'),
    fullPage: true
  });
  console.log('Saved v6_codexa_mobile_390_full.png');

  await browser.close();
  console.log('All updated screenshots finished successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
