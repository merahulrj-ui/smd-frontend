const fs = require('fs');
const cheerio = require('cheerio');
const https = require('https');
const path = require('path');
const mysql = require('mysql2/promise');

const HTML_FILE = 'C:\\Users\\merah\\.gemini\\antigravity\\brain\\49f4ab21-e64b-40e8-9896-3aca64349a4b\\scratch\\sunmaxray_xray.html';
const OUT_DIR = 'c:\\wamp64\\www\\smd-frontend\\public\\backend-media\\images\\sunmax';

async function downloadImage(url, filename) {
  if (url.includes('youtube.com')) return null;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(path.join(OUT_DIR, filename)))
           .on('error', reject)
           .once('close', () => resolve(filename));
      } else {
        resolve(null);
      }
    }).on('error', reject);
  });
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  const $ = cheerio.load(html);
  
  const pool = mysql.createPool({ host: '127.0.0.1', port: 3306, database: 'smd_medicare', user: 'root', password: '' });

  let updatedCount = 0;
  
  const promises = $('.prdCard').map(async (i, el) => {
    try {
      const name = $(el).find('h2').text().trim();
      if (!name) return;
      
      const multiImgStr = $(el).find('img[data-multiimg]').attr('data-multiimg');
      const images = multiImgStr ? multiImgStr.split(',') : [];
      
      let img2Path = null;
      let img3Path = null;
      
      if (images.length > 1) {
        const img2Url = images[1];
        if (img2Url && !img2Url.includes('youtube')) {
          const ext = path.extname(new URL(img2Url).pathname) || '.jpg';
          const filename = `sunmax_${generateSlug(name).substring(0, 30)}_2_${Date.now()}${ext}`;
          console.log(`Downloading img2 for ${name}...`);
          const dl = await downloadImage(img2Url, filename);
          if (dl) img2Path = `images/sunmax/${dl}`;
        }
      }
      
      if (images.length > 2) {
        const img3Url = images[2];
        if (img3Url && !img3Url.includes('youtube')) {
          const ext = path.extname(new URL(img3Url).pathname) || '.jpg';
          const filename = `sunmax_${generateSlug(name).substring(0, 30)}_3_${Date.now()}${ext}`;
          console.log(`Downloading img3 for ${name}...`);
          const dl = await downloadImage(img3Url, filename);
          if (dl) img3Path = `images/sunmax/${dl}`;
        }
      }
      
      if (img2Path || img3Path) {
        let q = 'UPDATE products SET ';
        let params = [];
        if (img2Path) { q += 'image2 = ?, '; params.push(img2Path); }
        if (img3Path) { q += 'image3 = ?, '; params.push(img3Path); }
        q = q.slice(0, -2) + ' WHERE name = ? AND brand = ?';
        params.push(name, 'Sunmax');
        
        await pool.query(q, params);
        updatedCount++;
      }
    } catch (e) {}
  }).get();
  
  await Promise.all(promises);
  console.log(`Updated images for ${updatedCount} products.`);
  process.exit(0);
}

run();
