const fs = require('fs');
const data = JSON.parse(fs.readFileSync('nexcloud_full_sections.json', 'utf8'));

console.log('--- TICKER HTML ---');
console.log(data.tickerHtml ? data.tickerHtml.slice(0, 800) : 'None');

console.log('--- PRICING HTML (OUR PRODUCTS) ---');
console.log(data.pricingHtml ? data.pricingHtml.slice(0, 1500) : 'None');

console.log('--- BUILT FOR PERFORMANCE ---');
console.log(data.perfHtml ? data.perfHtml.slice(0, 1500) : 'None');

console.log('--- GROWTH SECTION ---');
console.log(data.growthHtml ? data.growthHtml.slice(0, 1000) : 'None');

console.log('--- LOCATIONS SECTION ---');
console.log(data.locationsHtml ? data.locationsHtml.slice(0, 1000) : 'None');

console.log('--- REVIEWS SECTION ---');
console.log(data.reviewsHtml ? data.reviewsHtml.slice(0, 1000) : 'None');

