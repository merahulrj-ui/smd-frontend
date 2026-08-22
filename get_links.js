const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('C:\\Users\\merah\\.gemini\\antigravity\\brain\\49f4ab21-e64b-40e8-9896-3aca64349a4b\\scratch\\sunmaxray_xray.html', 'utf8');
const $ = cheerio.load(html);
const links = [];
$('.prdCard').each((i, el) => {
  const name = $(el).find('h2').text().trim();
  
  // Find multi-images inside data-multiimg attribute
  const multiImgStr = $(el).find('img[data-multiimg]').attr('data-multiimg');
  const images = multiImgStr ? multiImgStr.split(',') : [];

  // Find the exact product page link. Usually IndiaMart template wraps the name in an <a> tag.
  let href = '';
  $(el).find('a').each((j, ael) => {
     const link = $(ael).attr('href');
     if (link && link.includes('.html')) {
       href = link;
     }
  });

  links.push({ name, href, images });
});
console.log(JSON.stringify(links, null, 2));
