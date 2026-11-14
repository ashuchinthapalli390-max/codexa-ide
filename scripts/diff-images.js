const fs = require('fs');

const userBuf = fs.readFileSync('C:/Users/ashuc/.gemini/antigravity/brain/61670bd1-1d57-4534-aaea-3a4206600e3d/.user_uploaded/media_1794319536535_a450e830.png');
const nexBuf = fs.readFileSync('nexcloud_rendered_header.png');

console.log('User image length:', userBuf.length);
console.log('Nex rendered length:', nexBuf.length);

