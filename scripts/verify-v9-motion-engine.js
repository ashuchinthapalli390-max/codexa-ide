const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.log('Launching browser for V9 Motion Engine QA...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Suppress popups during section tour
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('has_seen_prebeta_offer', 'true');
    localStorage.setItem('codexa_offer_dismissed_until', (Date.now() + 86400000).toString());
    sessionStorage.setItem('has_seen_prebeta_offer', 'true');
  });

  const consoleLogs = [];
  page.on('console', (msg) => consoleLogs.push(msg.text()));

  // 1. Initial Load & Hero Typography Frame 1
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(1500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_01_hero_kinetic_typography_frame1.png'),
  });
  console.log('Saved v9_01_hero_kinetic_typography_frame1.png');

  // Wait 3.6s for rotating kinetic typography phrase transition
  await sleep(3600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_02_hero_kinetic_typography_frame2.png'),
  });
  console.log('Saved v9_02_hero_kinetic_typography_frame2.png');

  // 2. Navigation Mega Menu opening & backdrop
  console.log('Testing Navigation Mega Menu...');
  const productNavLink = await page.$('header nav div:first-child a');
  if (productNavLink) {
    await productNavLink.hover();
    await sleep(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'v9_03_mega_menu_open_backdrop.png'),
    });
    console.log('Saved v9_03_mega_menu_open_backdrop.png');
  }

  // Move mouse away to close mega-menu
  await page.mouse.move(10, 10);
  await sleep(400);

  // 3. Scroll to Products section (Dark to light transition & Product cards entrance)
  console.log('Scrolling to #products...');
  await page.evaluate(() => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_04_dark_to_light_products_entrance.png'),
  });
  console.log('Saved v9_04_dark_to_light_products_entrance.png');

  // 4. Scroll to Pre-Beta Pricing Section
  console.log('Scrolling to #prebeta-pricing...');
  await page.evaluate(() => {
    const el = document.getElementById('prebeta-pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1200);

  // Test discount toggle flip via page.evaluate
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#prebeta-pricing button'));
    const stdBtn = btns.find((b) => b.textContent.includes('Standard Pricing'));
    if (stdBtn) stdBtn.click();
  });
  await sleep(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_05_pricing_discount_toggle.png'),
  });
  console.log('Saved v9_05_pricing_discount_toggle.png');

  // 5. Scroll to Workflow Infrastructure & Pulsing Nodes
  console.log('Scrolling to #workflow-infrastructure...');
  await page.evaluate(() => {
    const el = document.getElementById('workflow-infrastructure');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_06_workflow_infrastructure.png'),
  });
  console.log('Saved v9_06_workflow_infrastructure.png');

  // 6. Scroll to Growth Section & Count-Up Statistics
  console.log('Scrolling to .growth-section...');
  await page.evaluate(() => {
    const el = document.querySelector('.growth-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_07_growth_countup_statistics.png'),
  });
  console.log('Saved v9_07_growth_countup_statistics.png');

  // 7. Scroll to Built for Performance Bento Grid
  console.log('Scrolling to Built for Performance...');
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const perfH2 = headings.find((h) => h.textContent.includes('Built for Performance'));
    if (perfH2) perfH2.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await sleep(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_08_built_for_performance_bento.png'),
  });
  console.log('Saved v9_08_built_for_performance_bento.png');

  // 8. Scroll to Infinite Workflow Marquees
  console.log('Scrolling to #workflows marquee...');
  await page.evaluate(() => {
    const el = document.getElementById('workflows');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_09_workflows_infinite_marquees.png'),
  });
  console.log('Saved v9_09_workflows_infinite_marquees.png');

  // 9. Scroll to FAQ Section & Test Accordion expansion
  console.log('Scrolling to #faq...');
  await page.evaluate(() => {
    const el = document.getElementById('faq');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await sleep(1000);

  // Click second FAQ item
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#faq .space-y-3 button'));
    if (btns.length > 1) btns[1].click();
  });
  await sleep(500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_10_faq_smooth_accordion_expanded.png'),
  });
  console.log('Saved v9_10_faq_smooth_accordion_expanded.png');

  // 10. Mobile Viewport Test (390px iPhone 14 Pro)
  console.log('Testing Mobile Viewport (390px)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_11_mobile_390px_hero.png'),
  });
  console.log('Saved v9_11_mobile_390px_hero.png');

  // Open mobile menu
  await page.evaluate(() => {
    const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
    if (toggle) toggle.click();
  });
  await sleep(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'v9_12_mobile_390px_drawer_open.png'),
  });
  console.log('Saved v9_12_mobile_390px_drawer_open.png');

  console.log('Browser tests completed successfully. Errors count:', consoleLogs.filter((l) => l.includes('Error')).length);
  await browser.close();
})();
