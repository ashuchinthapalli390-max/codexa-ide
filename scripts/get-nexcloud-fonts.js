const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'nexcloud.in',
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('nexcloud_raw.html', data);
    console.log('Saved nexcloud_raw.html, size:', data.length);

    // Find font links
    const matches = data.match(/https?:\/\/[^\s"'<>]+\.(?:woff2?|ttf|otf)/gi) || [];
    console.log('Font files direct:', matches);

    const googleFonts = data.match(/https?:\/\/fonts\.[^\s"'<>]+/gi) || [];
    console.log('Google Fonts URLs:', googleFonts);

    // Look for style tags or link tags
    const links = data.match(/<link[^>]+>/gi) || [];
    links.forEach(l => {
      if (l.includes('stylesheet') || l.includes('font')) console.log('Link:', l);
    });

    // Check next.js font hashes or bundled css
    const cssLinks = data.match(/href="([^"]+\.css)"/gi) || [];
    console.log('CSS Links:', cssLinks);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();

