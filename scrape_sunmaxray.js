const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

const HTML_FILE = path.join(__dirname, 'sunmaxray_xray.html');
const OUT_DIR = 'c:\\wamp64\\www\\smd-frontend\\public\\backend-media\\images\\sunmax';
const SQL_FILE = 'c:\\wamp64\\www\\smd-frontend\\insert_sunmax_products.sql';

async function downloadImage(url, filename) {
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
  const products = [];

  $('.prdCard').each((i, el) => {
    try {
      const name = $(el).find('h2 div').text().trim() || $(el).find('h2').text().trim();
      if (!name) return;

      const imgEl = $(el).find('.prdCardImgBx img').first();
      let imgUrl = imgEl.attr('dataimg') || imgEl.attr('data-bimg') || imgEl.attr('src');
      if (imgUrl && imgUrl.startsWith('data:')) {
        imgUrl = imgEl.attr('data-bimg') || imgEl.attr('dataimg');
      }

      const priceText = $(el).find('.prdCardNameP .fwb').first().text().trim();
      let price = 0;
      let mrp = 0;
      if (priceText.includes('Rs') || priceText.includes('?')) {
        const num = priceText.replace(/[^0-9]/g, '');
        if (num) price = parseInt(num, 10);
      }
      if (price > 0) mrp = Math.round(price * 1.2);

      let specs = [];
      $(el).find('.prdCardDesTbl tr').each((j, tr) => {
        const label = $(tr).find('td').first().text().trim();
        const value = $(tr).find('td').last().text().trim();
        if (label && value) {
          specs.push({ name: label, description: value });
        }
      });

      const features = [];
      $(el).find('.prdCardDes > ul li').each((j, li) => {
        features.push($(li).text().trim());
      });
      const featuresHtml = features.map(f => `<li>${f}</li>`).join('');
      const featuresStr = featuresHtml ? `<ul>${featuresHtml}</ul>` : '';

      products.push({
        name,
        price,
        mrp,
        imgUrl,
        specs: JSON.stringify(specs),
        features: featuresStr
      });
    } catch (e) {
      console.error(e);
    }
  });

  console.log(`Found ${products.length} products. Processing...`);

  const sqlStatements = [
    `-- Generated SQL for Sunmaxray Products`,
    `SET FOREIGN_KEY_CHECKS=0;`
  ];

  for (const p of products) {
    let imageFile = '';
    if (p.imgUrl && p.imgUrl.startsWith('http')) {
      const ext = path.extname(new URL(p.imgUrl).pathname) || '.jpg';
      const filename = `sunmax_${generateSlug(p.name).substring(0, 30)}_${Date.now()}${ext}`;
      console.log(`Downloading ${p.imgUrl} -> ${filename}`);
      const downloaded = await downloadImage(p.imgUrl, filename);
      if (downloaded) {
        imageFile = `sunmax/${downloaded}`;
      }
    }

    const slug = generateSlug(p.name);
    const eName = p.name.replace(/'/g, "\\'");
    const eSpecs = p.specs.replace(/'/g, "\\'");
    const eFeatures = p.features.replace(/'/g, "\\'");
    
    const sql = `INSERT INTO products (name, slug, brand, category, category_id, mrp, price, stock_quantity, description, features, specification, image, status) VALUES ('${eName}', '${slug}', 'Sunmax', 'X-Ray Machines', 1, ${p.mrp}, ${p.price}, 10, 'High-quality X-Ray Machine manufactured by Sunmax.', '${eFeatures}', '${eSpecs}', '${imageFile}', 'live');`;
    sqlStatements.push(sql);
  }

  sqlStatements.push(`SET FOREIGN_KEY_CHECKS=1;`);
  fs.writeFileSync(SQL_FILE, sqlStatements.join('\n'));
  console.log('Done! Generated SQL:', SQL_FILE);
}

run();
