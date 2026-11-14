const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:\\Users\\ashuc\\.gemini\\antigravity\\brain\\61670bd1-1d57-4534-aaea-3a4206600e3d';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const wf = await page.$('#workflow-infrastructure');
  if (wf) await wf.screenshot({ path: `${OUT}\\codexa_workflow_section.png` });

  const ai = await page.$('#ai');
  if (ai) await ai.screenshot({ path: `${OUT}\\codexa_ai_section.png` });

  const faq = await page.$('#faq');
  if (faq) await faq.screenshot({ path: `${OUT}\\codexa_faq_section.png` });

  const footer = await page.$('footer');
  if (footer) await footer.screenshot({ path: `${OUT}\\codexa_footer_section.png` });

  console.log('Sections captured successfully.');
  await browser.close();
})();

