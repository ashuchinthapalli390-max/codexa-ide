const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'nexcloud.in',
  path: '/assets/index-ClBfdsQ2.css',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('nexcloud_real.css', data);
    console.log('Saved nexcloud_real.css, size:', data.length);

    // Extract all font-family definitions
    const fontMatches = data.match(/font-family:[^;}]+/gi) || [];
    const unique = Array.from(new Set(fontMatches));
    console.log('Font families in CSS:', unique);

    // Search for #pricing or h2 or Our Products
    const rules = data.split('}');
    rules.forEach(r => {
      if (r.includes('Orbitron') || r.includes('Syne') || r.includes('Quicksand') || r.includes('DM Sans') || r.includes('pricing') || r.includes('font-')) {
        if (r.includes('font-family')) {
          console.log('Rule with font-family:', r.trim().slice(0, 150));
        }
      }
    });
  });
});

req.on('error', console.error);
req.end();

