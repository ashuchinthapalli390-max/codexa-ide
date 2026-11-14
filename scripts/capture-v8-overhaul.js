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
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('codexa_offer_dismissed_until', String(Date.now() + 86400000 * 7));
    sessionStorage.setItem('codexa_intro_shown_v7', 'true');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Hero
  const heroEl = await page.$('section.relative.pt-10');
  if (heroEl) {
    await heroEl.screenshot({ path: 'v8_hero_rebuilt.png' });
    console.log('Saved v8_hero_rebuilt.png');
  }

  // 2. Our Products capabilities
  const prodEl = await page.$('#products');
  if (prodEl) {
    await prodEl.screenshot({ path: 'v8_products_capabilities_rebuilt.png' });
    console.log('Saved v8_products_capabilities_rebuilt.png');
  }

  // 3. Pre-Beta Pricing
  const pricingEl = await page.$('#prebeta-pricing');
  if (pricingEl) {
    await pricingEl.screenshot({ path: 'v8_prebeta_pricing_rebuilt.png' });
    console.log('Saved v8_prebeta_pricing_rebuilt.png');
  }

  // 4. Model Access Matrix
  const matrixEl = await page.$('section:has(table)');
  if (matrixEl) {
    await matrixEl.screenshot({ path: 'v8_model_access_matrix_rebuilt.png' });
    console.log('Saved v8_model_access_matrix_rebuilt.png');
  }

  // 5. Workflow Infrastructure
  const workflowEl = await page.$('#workflow-infrastructure');
  if (workflowEl) {
    await workflowEl.screenshot({ path: 'v8_workflow_infrastructure_rebuilt.png' });
    console.log('Saved v8_workflow_infrastructure_rebuilt.png');
  }

  // 6. Growth Section
  const growthEl = await page.$('section.growth-section');
  if (growthEl) {
    await growthEl.screenshot({ path: 'v8_growth_architecture_rebuilt.png' });
    console.log('Saved v8_growth_architecture_rebuilt.png');
  }

  // 7. Built for Performance
  const bentoEl = await page.$('section.bg-gray-300:has(h2.font-orbitron)');
  if (bentoEl) {
    await bentoEl.screenshot({ path: 'v8_built_for_performance_rebuilt.png' });
    console.log('Saved v8_built_for_performance_rebuilt.png');
  }

  // 8. Workflows Marquee
  const marqueeEl = await page.$('#workflows');
  if (marqueeEl) {
    await marqueeEl.screenshot({ path: 'v8_workflows_marquee_rebuilt.png' });
    console.log('Saved v8_workflows_marquee_rebuilt.png');
  }

  // 9. FAQ Section
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await faqEl.screenshot({ path: 'v8_faq_rebuilt.png' });
    console.log('Saved v8_faq_rebuilt.png');
  }

  // 10. Download Section
  const dlEl = await page.$('#download');
  if (dlEl) {
    await dlEl.screenshot({ path: 'v8_download_rebuilt.png' });
    console.log('Saved v8_download_rebuilt.png');
  }

  // 11. Mega Menu Layering test over light-gray section
  // Scroll down so a light section is beneath the navbar
  await page.evaluate(() => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 200));

  // Hover over Product in header
  const productTrigger = await page.$('header nav a[href="/features"]');
  if (productTrigger) {
    await productTrigger.hover();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: 'v8_mega_menu_solid_layering.png', clip: { x: 0, y: 0, width: 1440, height: 500 } });
    console.log('Saved v8_mega_menu_solid_layering.png');
  }

  await browser.close();
  console.log('Finished capturing all rebuilt sections.');
})();

