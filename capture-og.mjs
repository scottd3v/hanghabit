import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto('http://localhost:3000/og-generator.html', { waitUntil: 'networkidle0' });

const element = await page.$('.og-image');
await element.screenshot({ path: 'public/og-dead-hang.png' });

await browser.close();
console.log('Screenshot saved to public/og-dead-hang.png');
