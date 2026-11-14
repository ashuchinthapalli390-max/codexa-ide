const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { width: 1920, height: 1080, name: '1920px_large' },
  { width: 1440, height: 900, name: '1440px_desktop' },
  { width: 1355, height: 900, name: '1355px_standard' },
  { width: 1280, height: 900, name: '1280px_standard' },
  { width: 1199, height: 800, name: '1199px_compact' },
  { width: 1024, height: 800, name: '1024px_tablet_land' },
  { width: 768, height: 1024, name: '768px_tablet_port' },
  { width: 390, height: 844, name: '390px_mobile' },
  { width: 375, height: 667, name: '375px_mobile' },
  { width: 320, height: 568, name: '320px_mobile_small' }
];

async function runVisualQA() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  console.log('Testing all viewports...');

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
      sessionStorage.setItem('codexa_intro_shown_v7', 'true');
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Capture header
    const header = await page.$('header');
    if (header) {
      await header.screenshot({ path: `v8_header_${vp.name}.png` });
      console.log(`Captured v8_header_${vp.name}.png`);
    }

    // Inspect wrapping metrics on header elements
    const metrics = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('header nav a span, header div a span, header div button span'));
      return links.map(el => ({
        text: el.innerText ? el.innerText.trim() : '',
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
        whiteSpace: window.getComputedStyle(el).whiteSpace
      }));
    });

    // Check if any element wrapped (height > 26px for single line text)
    const wrapped = metrics.filter(m => m.height > 28 && m.text.length > 0 && !m.text.includes('\n'));
    if (wrapped.length > 0) {
      console.warn(`WARNING: Wrapped text found at ${vp.width}px:`, wrapped);
    } else {
      console.log(`PASS: No wrapped navigation text at ${vp.width}px.`);
    }

    await page.close();
  }

  // Test Product Mega-Menu open at 1355px
  const page1355 = await browser.newPage();
  await page1355.setViewport({ width: 1355, height: 900 });
  await page1355.evaluateOnNewDocument(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
    sessionStorage.setItem('codexa_intro_shown_v7', 'true');
  });
  await page1355.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Hover on Product
  const productBtn = await page1355.$('header nav a[href="/features"]');
  if (productBtn) {
    await productBtn.hover();
    await new Promise(r => setTimeout(r, 300));
    await page1355.screenshot({ path: 'v8_1355px_product_menu_open.png', clip: { x: 0, y: 0, width: 1355, height: 500 } });
    console.log('Captured v8_1355px_product_menu_open.png');
  }

  // Hover on Resources
  const resourcesBtn = await page1355.$('header nav a[href="/docs"]');
  if (resourcesBtn) {
    await resourcesBtn.hover();
    await new Promise(r => setTimeout(r, 300));
    await page1355.screenshot({ path: 'v8_1355px_resources_menu_open.png', clip: { x: 0, y: 0, width: 1355, height: 500 } });
    console.log('Captured v8_1355px_resources_menu_open.png');
  }

  // Test Mobile menu open at 390px
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844 });
  await pageMobile.evaluateOnNewDocument(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
    sessionStorage.setItem('codexa_intro_shown_v7', 'true');
  });
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Click hamburger
  const hamburger = await pageMobile.$('button[aria-label="Toggle navigation menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 300));
    await pageMobile.screenshot({ path: 'v8_390px_mobile_menu_open.png' });
    console.log('Captured v8_390px_mobile_menu_open.png');
  }

  // Test Scrolled state at 1355px
  await page1355.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 200));
  await page1355.screenshot({ path: 'v8_1355px_scrolled_state.png', clip: { x: 0, y: 0, width: 1355, height: 200 } });
  console.log('Captured v8_1355px_scrolled_state.png');

  await browser.close();
  console.log('All QA tests complete.');
}

runVisualQA().catch(console.error);

