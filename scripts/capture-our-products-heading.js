const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  // Set localStorage before loading page to prevent popup from showing
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('has_seen_prebeta_offer', 'true');
    localStorage.setItem('codexa_offer_dismissed', 'true');
    sessionStorage.setItem('has_seen_prebeta_offer', 'true');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Remove any popup modal that might have rendered
  await page.evaluate(() => {
    // Dismiss popup by clicking close or removing backdrop
    const closeBtns = document.querySelectorAll('button[aria-label="Close"], button svg.lucide-x');
    closeBtns.forEach(b => {
      const parentBtn = b.closest('button');
      if (parentBtn) parentBtn.click();
    });
    
    // Also remove any fixed overlays if still present
    document.querySelectorAll('.fixed.z-50, .fixed.inset-0').forEach(el => {
      // Don't remove navbar if it has fixed
      if (!el.classList.contains('z-[1000]') && !el.closest('header')) {
        el.remove();
      }
    });

    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  await new Promise(r => setTimeout(r, 1000));

  // Find the header element inside #products
  const headerSelector = '#products .text-center.mb-16';
  const header = await page.$(headerSelector);
  
  if (header) {
    const artifactPath = path.resolve(
      'C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d/our_products_heading_exact.png'
    );
    await header.screenshot({ path: artifactPath });
    console.log('Saved header screenshot to:', artifactPath);
  } else {
    console.error('Header element not found');
  }

  // Also capture full products section
  const section = await page.$('#products');
  if (section) {
    const sectionPath = path.resolve(
      'C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d/our_products_section_full.png'
    );
    await section.screenshot({ path: sectionPath });
    console.log('Saved section screenshot to:', sectionPath);
  }

  await browser.close();
})();
