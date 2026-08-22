const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('C:\\Users\\merah\\.gemini\\antigravity\\brain\\49f4ab21-e64b-40e8-9896-3aca64349a4b\\scratch\\sunmaxray_xray.html', 'utf8');
const $ = cheerio.load(html);

$('.prdCard').each((i, el) => {
  const name = $(el).find('h2').text().trim();
  const descNodes = $(el).find('.prdCardDes p').not('.pdf_br').map((j, p) => $(p).text().trim()).get();
  console.log('--- ' + name + ' ---');
  console.log('Features:', $(el).find('.prdCardDes > ul li').length);
  console.log('Descriptions:', descNodes.filter(d => d.length > 0 && !d.includes('Minimum Order Quantity') && !d.includes('Additional Information')).join('\n'));
});
