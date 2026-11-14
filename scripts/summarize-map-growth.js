const fs = require('fs');
const data = JSON.parse(fs.readFileSync('nexcloud_full_sections.json', 'utf8'));

console.log('--- LOCATIONS DETAIL ---');
console.log(data.locationsHtml ? data.locationsHtml.slice(0, 2000) : 'None');

console.log('--- GROWTH DETAIL ---');
console.log(data.growthHtml ? data.growthHtml.slice(0, 2000) : 'None');

