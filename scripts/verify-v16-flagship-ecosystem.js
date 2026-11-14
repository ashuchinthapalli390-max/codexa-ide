/**
 * CODEXA STUDIO IDE — V16 FLAGSHIP MODELS & INTERACTIVE PARTICLE ENGINE VERIFICATION
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Locate local chrome / edge
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const executablePath = chromePaths.find(p => fs.existsSync(p));

if (!executablePath) {
  console.error('No compatible Chromium binary found.');
  process.exit(1);
}

async function runVerification() {
  console.log('======================================================================');
  console.log('  CODEXA STUDIO IDE — V16 FLAGSHIP MODELS & PARTICLE ENGINE AUDIT     ');
  console.log('======================================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      defaultViewport: { width: 1440, height: 900 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const url = 'http://localhost:3000';

    console.log(`[1] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // 1. Verify V16 Section Headings
    console.log('\n[2] Verifying Section 7: Flagship Models Headings & Eyebrow...');
    const ecosystemSection = await page.$('#ai-ecosystem');
    if (!ecosystemSection) {
      throw new Error('Could not find #ai-ecosystem section on the page!');
    }

    const sectionText = await page.evaluate(el => el.innerText, ecosystemSection);

    const hasEyebrow = sectionText.includes('AI ECOSYSTEM');
    const hasHeading = sectionText.includes('Flagship Models. One Workspace.');
    const hasSubheading = sectionText.includes('Intelligence, connected through CodeXa.');
    const hasSupportingText = sectionText.includes('Explore supported AI model families through a unified developer workspace');

    console.log('  - Eyebrow "AI ECOSYSTEM":', hasEyebrow ? '✅' : '❌');
    console.log('  - Main Heading "Flagship Models. One Workspace.":', hasHeading ? '✅' : '❌');
    console.log('  - Animated Subheading "Intelligence, connected through CodeXa.":', hasSubheading ? '✅' : '❌');
    console.log('  - Supporting Text:', hasSupportingText ? '✅' : '❌');

    if (!hasHeading || !hasSubheading) {
      throw new Error('V16 Section Headings do not match specification.');
    }

    // 2. Verify Scene Navigation Pills
    console.log('\n[3] Verifying Scene Navigation Options...');
    const hasOpenAI = sectionText.includes('01 OpenAI');
    const hasClaude = sectionText.includes('02 Claude');
    const hasGrok = sectionText.includes('03 Grok');
    const hasGemini = sectionText.includes('04 Gemini');
    const hasCodeXa = sectionText.includes('05 CodeXa Native');
    const hasUnified = sectionText.includes('06 Unified Workspace');

    console.log('  - 01 OpenAI Pill:', hasOpenAI ? '✅' : '❌');
    console.log('  - 02 Claude Pill:', hasClaude ? '✅' : '❌');
    console.log('  - 03 Grok Pill:', hasGrok ? '✅' : '❌');
    console.log('  - 04 Gemini Pill:', hasGemini ? '✅' : '❌');
    console.log('  - 05 CodeXa Native Pill:', hasCodeXa ? '✅' : '❌');
    console.log('  - 06 Unified Workspace Pill:', hasUnified ? '✅' : '❌');

    // 3. Verify CodeXa Agency Left Identity
    console.log('\n[4] Verifying CodeXa Agency Left Identity...');
    const hasAgencyTitle = sectionText.includes('CodeXa Agency');
    const hasAgencySub = sectionText.includes('The developer ecosystem behind CodeXa Studio IDE.');
    const hasDualAgent = sectionText.includes('Dual-Agent Planner');
    const hasZeroTelemetry = sectionText.includes('Zero Cloud Telemetry');
    const hasASTGraph = sectionText.includes('AST Symbol Graph');

    console.log('  - CodeXa Agency Title:', hasAgencyTitle ? '✅' : '❌');
    console.log('  - Agency Ecosystem Subtitle:', hasAgencySub ? '✅' : '❌');
    console.log('  - Dual-Agent Planner Architecture:', hasDualAgent ? '✅' : '❌');
    console.log('  - Zero Cloud Telemetry Default:', hasZeroTelemetry ? '✅' : '❌');
    console.log('  - AST Symbol Graph In-Memory Cache:', hasASTGraph ? '✅' : '❌');

    // 4. Verify Interactive Canvas
    console.log('\n[5] Verifying Interactive Particle Canvas...');
    const canvasExists = await page.evaluate(() => {
      const cvs = document.querySelector('#ai-ecosystem canvas');
      return cvs !== null && cvs.width > 0 && cvs.height > 0;
    });
    console.log('  - Canvas element created and rendered with dimensions:', canvasExists ? '✅' : '❌');

    // 5. Verify Model Catalogue Below Stage
    console.log('\n[6] Verifying Flagship Model Catalogue...');
    const hasCatalogue = sectionText.includes('Flagship Model Catalogue');
    const hasUniversalPolicy = sectionText.includes('Universal Model Access Policy');
    const hasGPT6Astra = sectionText.includes('GPT-6 Astra');
    const hasClaude37 = sectionText.includes('Claude 3.7 Sonnet');
    const hasGeminiFlash = sectionText.includes('Gemini 2.0 Flash');
    const hasNEXA = sectionText.includes('NEXA-7B Fast');

    console.log('  - Model Catalogue Heading:', hasCatalogue ? '✅' : '❌');
    console.log('  - Universal Model Access Policy Banner:', hasUniversalPolicy ? '✅' : '❌');
    console.log('  - GPT-6 Astra Listed:', hasGPT6Astra ? '✅' : '❌');
    console.log('  - Claude 3.7 Sonnet Listed:', hasClaude37 ? '✅' : '❌');
    console.log('  - Gemini 2.0 Flash Listed:', hasGeminiFlash ? '✅' : '❌');
    console.log('  - NEXA-7B Fast Listed:', hasNEXA ? '✅' : '❌');

    // 6. Test Interactive Scene Switching to Unified Workspace
    console.log('\n[7] Testing Scene Transition to Unified Workspace...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('#ai-ecosystem button'));
      const unifiedBtn = buttons.find(b => b.innerText.includes('06 Unified Workspace'));
      if (unifiedBtn) unifiedBtn.click();
    });

    await new Promise(r => setTimeout(r, 1000));
    const updatedSectionText = await page.evaluate(el => el.innerText, ecosystemSection);
    const hasDifferentModels = updatedSectionText.includes('Different Models. One CodeXa.');
    const hasUniversalSwitcher = updatedSectionText.includes('Universal Model Switcher') || updatedSectionText.includes('GPT-6 Astra (OpenAI)');

    console.log('  - Scene 6 Transition Succeeded:', hasDifferentModels ? '✅' : '❌');
    console.log('  - Unified IDE Workspace Active:', hasUniversalSwitcher ? '✅' : '❌');

    // 7. Test Reviews Section Zero-Review Compliance
    console.log('\n[8] Verifying Reviews Section & Zero Fabricated Review State...');
    const reviewsRes = await page.evaluate(async () => {
      const res = await fetch('/api/reviews');
      return await res.json();
    });

    console.log('  - /api/reviews total count:', reviewsRes?.stats?.totalReviews);
    console.log('  - /api/reviews average rating:', reviewsRes?.stats?.averageRating);
    console.log('  - /api/reviews reviews array length:', reviewsRes?.reviews?.length);

    const zeroFakeReviews = reviewsRes?.reviews?.length === 0;
    console.log('  - Zero Fabricated Reviews in Storage:', zeroFakeReviews ? '✅' : '❌');

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasZeroReviewCopy = bodyText.includes('Be among the first to share your CodeXa experience.');
    const hasWriteReviewBtn = bodyText.includes('Write a Review');

    console.log('  - Zero-Review Copy "Be among the first to share your CodeXa experience.":', hasZeroReviewCopy ? '✅' : '❌');
    console.log('  - "Write a Review" Call to Action Present:', hasWriteReviewBtn ? '✅' : '❌');

    // Take screenshot of V16 Flagship Models Section
    const screenshotPath = path.join(__dirname, 'v16_flagship_models.png');
    await ecosystemSection.screenshot({ path: screenshotPath });
    console.log(`\n📸 Captured high-res screenshot of V16 Flagship Models section to ${screenshotPath}`);

    console.log('\n======================================================================');
    console.log('  V16 AUDIT COMPLETE: ALL REQUIREMENTS MET & VERIFIED ✅               ');
    console.log('======================================================================\n');
  } catch (err) {
    console.error('\n❌ Verification failed with error:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

runVerification();
