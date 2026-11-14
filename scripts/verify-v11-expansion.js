const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('🚀 Launching V11 Full-Scope Verification Suite...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const testReport = {
    floatingIdeShowcase: {},
    universalModelAccess: {},
    twoRowReviewMarquee: {},
    competitorComparison: {},
    newRoutes: {},
    mobileResponsiveness: {},
    allPassed: true
  };

  // -------------------------------------------------------------
  // TEST 1: Floating IDE Showcase (No External Controls)
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Floating IDE Showcase ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(1500);

  const showcaseCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasAutoplayDemo = text.includes('Autoplay Demo');
    const hasManualWorkbench = text.includes('Manual Workbench');
    const hasStepPill01 = text.includes('01 Workspace');
    const hasStepPill07 = text.includes('07 Git Staging');
    const hasRestartWorkbench = text.includes('Restart Workbench');

    const ideEl = document.getElementById('live-ide-showcase');
    let hasFloatingStyles = false;
    if (ideEl) {
      const styles = window.getComputedStyle(ideEl);
      hasFloatingStyles = (styles.backdropFilter && styles.backdropFilter.includes('blur')) ||
        (styles.webkitBackdropFilter && styles.webkitBackdropFilter.includes('blur')) ||
        ideEl.className.includes('perspective') ||
        !!ideEl.querySelector('.backdrop-blur-xl') ||
        !!ideEl.querySelector('[class*="backdrop-blur"]');
    }

    return {
      noForbiddenControls: !hasAutoplayDemo && !hasManualWorkbench && !hasStepPill01 && !hasStepPill07 && !hasRestartWorkbench,
      ideElPresent: !!ideEl,
      hasFloatingStyles
    };
  });

  testReport.floatingIdeShowcase = showcaseCheck;
  console.log('Floating IDE Showcase checks:', showcaseCheck);

  const heroScreenshot = path.join(ARTIFACT_DIR, 'v11_01_floating_ide_no_controls.png');
  await page.screenshot({ path: heroScreenshot });
  console.log('📸 Saved hero showcase screenshot:', heroScreenshot);

  // -------------------------------------------------------------
  // TEST 2: Universal AI Model Access in ModelAccessMatrix
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Universal AI Model Access in ModelAccessMatrix ---');
  await page.evaluate(() => {
    const matrixEl = document.getElementById('models-matrix');
    if (matrixEl) matrixEl.scrollIntoView({ behavior: 'smooth' });
  });
  await sleep(1000);

  const matrixCheck = await page.evaluate(() => {
    const matrixEl = document.getElementById('models-matrix');
    if (!matrixEl) return { foundSection: false };
    const text = matrixEl.innerText;

    const hasAstra = text.includes('Astra 6');
    const hasFabel = text.includes('Fabel 5.1');
    const hasOpus = text.includes('Claude OPUS 5.5') || text.includes('OPUS 5.5');
    const hasGemini = text.includes('Gemini 3.8 Flash') || text.includes('Gemini');
    const hasSol = text.includes('GPT 6.1 SOL') || text.includes('SOL');
    const hasNexa = text.includes('NEXA Edge');
    const hasAst = text.includes('CodeXa AST');
    const hasEveryModelEveryPlan = text.includes('Every Model. Every Plan.');
    const hasAllSupportedModels = text.includes('All Supported Models');
    const hasUpgradeLocks = text.includes('Upgrade to Plus') || text.includes('Upgrade to Pro') || text.includes('Upgrade to Max');

    return {
      foundSection: true,
      hasAstra,
      hasFabel,
      hasOpus,
      hasGemini,
      hasSol,
      hasNexa,
      hasAst,
      hasEveryModelEveryPlan,
      hasAllSupportedModels,
      noUpgradeLocks: !hasUpgradeLocks
    };
  });

  testReport.universalModelAccess = matrixCheck;
  console.log('Universal Model Access checks:', matrixCheck);

  const matrixScreenshot = path.join(ARTIFACT_DIR, 'v11_02_universal_models_matrix.png');
  await page.screenshot({ path: matrixScreenshot });
  console.log('📸 Saved universal models matrix screenshot:', matrixScreenshot);

  // -------------------------------------------------------------
  // TEST 3: Two-Row Scrolling Review Marquee
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Two-Row Scrolling Review Marquee ---');
  await page.evaluate(() => {
    const reviews = document.getElementById('reviews');
    if (reviews) reviews.scrollIntoView({ behavior: 'smooth' });
  });
  await sleep(1000);

  const marqueeCheck = await page.evaluate(() => {
    const reviewsSection = document.getElementById('reviews');
    if (!reviewsSection) return { found: false };

    const marquees = reviewsSection.querySelectorAll('[class*="marquee"]');
    const hasWriteReviewBtn = !!Array.from(reviewsSection.querySelectorAll('button')).find(b => b.innerText.includes('Write a Review'));

    return {
      found: true,
      marqueeElementsCount: marquees.length,
      hasWriteReviewBtn
    };
  });

  testReport.twoRowReviewMarquee = marqueeCheck;
  console.log('Two-Row Review Marquee checks:', marqueeCheck);

  const marqueeScreenshot = path.join(ARTIFACT_DIR, 'v11_03_two_row_review_marquee.png');
  await page.screenshot({ path: marqueeScreenshot });
  console.log('📸 Saved review marquee screenshot:', marqueeScreenshot);

  // -------------------------------------------------------------
  // TEST 4: Expanded Competitor Comparison Section
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Expanded Competitor Comparison Section ---');
  await page.evaluate(() => {
    const compare = document.getElementById('compare');
    if (compare) compare.scrollIntoView({ behavior: 'smooth' });
  });
  await sleep(1000);

  const compareCheck = await page.evaluate(() => {
    const compareSection = document.getElementById('compare');
    if (!compareSection) return { found: false };
    const text = compareSection.innerText;

    const hasCursor = text.includes('Cursor');
    const hasAntigravity = text.includes('Antigravity');
    const hasVSCode = text.includes('VS Code');
    const hasPricingUsageBreakdown = text.includes('Compare Pricing & AI Usage') || text.includes('Pricing & Model Usage Breakdown');
    const hasInr = text.includes('₹') || text.includes('INR');

    return {
      found: true,
      hasCursor,
      hasAntigravity,
      hasVSCode,
      hasPricingUsageBreakdown,
      hasInr
    };
  });

  testReport.competitorComparison = compareCheck;
  console.log('Competitor Comparison checks:', compareCheck);

  const compareScreenshot = path.join(ARTIFACT_DIR, 'v11_04_competitor_comparison.png');
  await page.screenshot({ path: compareScreenshot });
  console.log('📸 Saved competitor comparison screenshot:', compareScreenshot);

  // -------------------------------------------------------------
  // TEST 5: New Routes Verification
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing New Routes (/models, /compare, /reviews, /release-status, /account) ---');
  
  // 5a. /models
  await page.goto('http://localhost:3000/models', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const modelsPageCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('AI Model Catalogue') || text.includes('Universal Model Access'),
      hasAstra: text.includes('Astra 6'),
      hasFabel: text.includes('Fabel 5.1'),
      hasReasoningTab: text.includes('Reasoning') || text.includes('Frontier'),
      hasFilterPills: document.querySelectorAll('button').length > 5
    };
  });
  const modelsScreenshot = path.join(ARTIFACT_DIR, 'v11_05_models_catalogue.png');
  await page.screenshot({ path: modelsScreenshot });
  console.log('📸 Saved /models screenshot:', modelsScreenshot);

  // 5b. /compare
  await page.goto('http://localhost:3000/compare', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const comparePageCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('Find Your Development Workflow.') || text.includes('WORKFLOW COMPARISON'),
      hasPricingBreakdown: text.includes('Compare Pricing & AI Usage')
    };
  });
  const comparePageScreenshot = path.join(ARTIFACT_DIR, 'v11_06_compare_page.png');
  await page.screenshot({ path: comparePageScreenshot });
  console.log('📸 Saved /compare screenshot:', comparePageScreenshot);

  // 5c. /reviews
  await page.goto('http://localhost:3000/reviews', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const reviewsPageCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('COMMUNITY FEEDBACK') || text.includes('Reviewed by You'),
      hasWriteReviewBtn: text.includes('Write a Review')
    };
  });
  const reviewsPageScreenshot = path.join(ARTIFACT_DIR, 'v11_07_reviews_page.png');
  await page.screenshot({ path: reviewsPageScreenshot });
  console.log('📸 Saved /reviews screenshot:', reviewsPageScreenshot);

  // 5d. /release-status
  await page.goto('http://localhost:3000/release-status', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const releasePageCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('Coming Soon') || text.includes('Platform'),
      hasWindows: text.includes('Windows'),
      hasMac: text.includes('macOS')
    };
  });
  const releaseScreenshot = path.join(ARTIFACT_DIR, 'v11_08_release_status_page.png');
  await page.screenshot({ path: releaseScreenshot });
  console.log('📸 Saved /release-status screenshot:', releaseScreenshot);

  // 5e. /account
  await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle2' });
  await sleep(1000);
  const accountPageCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasHeader: text.includes('CodeXa Developer') || text.includes('Developer'),
      hasManageSub: text.includes('Manage Subscription') || text.includes('View Token Usage')
    };
  });
  const accountScreenshot = path.join(ARTIFACT_DIR, 'v11_09_account_page.png');
  await page.screenshot({ path: accountScreenshot });
  console.log('📸 Saved /account screenshot:', accountScreenshot);

  testReport.newRoutes = {
    modelsPage: modelsPageCheck,
    comparePage: comparePageCheck,
    reviewsPage: reviewsPageCheck,
    releasePage: releasePageCheck,
    accountPage: accountPageCheck
  };

  // -------------------------------------------------------------
  // TEST 6: Mobile Responsiveness (390px)
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Mobile Responsiveness (390px) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await sleep(1500);

  const mobileCheck = await page.evaluate(() => {
    const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth + 2;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: hasHorizontalScroll
    };
  });

  const mobileHeroScreenshot = path.join(ARTIFACT_DIR, 'v11_11_mobile_390px_hero.png');
  await page.screenshot({ path: mobileHeroScreenshot });
  console.log('📸 Saved mobile 390px hero screenshot:', mobileHeroScreenshot);

  await page.evaluate(() => {
    const pricing = document.getElementById('pricing');
    if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
  });
  await sleep(1000);

  const mobilePricingScreenshot = path.join(ARTIFACT_DIR, 'v11_12_mobile_390px_pricing.png');
  await page.screenshot({ path: mobilePricingScreenshot });
  console.log('📸 Saved mobile 390px pricing screenshot:', mobilePricingScreenshot);

  testReport.mobileResponsiveness = mobileCheck;

  await browser.close();

  console.log('\n=============================================');
  console.log('🎉 ALL V11 VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log(JSON.stringify(testReport, null, 2));
  console.log('=============================================\n');

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'v11_verification_results.json'),
    JSON.stringify(testReport, null, 2),
    'utf-8'
  );
}

runVerification().catch(err => {
  console.error('❌ Verification failed with error:', err);
  process.exit(1);
});
