import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  if (key !== 'smd_bulk_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = [
    { name: '100mA Fixed X-Ray Machine With Horizontal Bucky Table', slug: '100ma-fixed-x-ray-machine-with-horizontal-bucky-table', brand: 'Sunmax', category_id: 1, mrp: 213600, price: 178000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"System Type","description":"Fixed"},{"name":"Generator Rating","description":"100 mA"},{"name":"kV Range","description":"40–100 kV"},{"name":"Model Name/Number","description":"SE-100DI"},{"name":"Brand","description":"Sunmax"},{"name":"AERB Approved","description":"Yes"}]', image: 'sunmax/sunmax_100ma-fixed-x-ray-machine-with_1787312576499.png', image2: 'sunmax/sunmax_100ma-fixed-x-ray-machine-with_2_1787315062708.jpg', image3: 'sunmax/sunmax_100ma-fixed-x-ray-machine-with_3_1787315063238.png' },
    { name: '300mA X-Ray Machine', slug: '300ma-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 510000, price: 425000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Brand","description":"Sunmax"},{"name":"Generator Capacity","description":"300 mA"},{"name":"Generator Power","description":"24KW"},{"name":"AERB Approved","description":"Yes"},{"name":"Tube Type","description":"Rotating Anode"},{"name":"Voltage","description":"440V"}]', image: 'sunmax/sunmax_300ma-x-ray-machine_1787312577070.png', image2: 'sunmax/sunmax_300ma-x-ray-machine_2_1787315062773.jpg', image3: 'sunmax/sunmax_300ma-x-ray-machine_3_1787315063187.png' },
    { name: 'SUNMAX SPICA 40kW HF Digital Radiography System', slug: 'sunmax-spica-40kw-hf-digital-radiography-system', brand: 'Sunmax', category_id: 1, mrp: 1980000, price: 1650000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Detector Type","description":"DR"},{"name":"Peak Kilo Voltage","description":"125 kVp"},{"name":"Generator Type","description":"High Frequency"},{"name":"Model","description":"SPICA 40"},{"name":"Current","description":"500 mA"},{"name":"Brand","description":"SUNMAX"}]', image: 'sunmax/sunmax_sunmax-spica-40kw-hf-digital-r_1787312577292.png', image2: 'sunmax/sunmax_sunmax-spica-40kw-hf-digital-r_2_1787315062774.png', image3: 'sunmax/sunmax_sunmax-spica-40kw-hf-digital-r_3_1787315063730.png' },
    { name: '100Ma Apr Mobile X-Ray Machine', slug: '100ma-apr-mobile-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 252000, price: 210000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Machine Type","description":"Mobile"},{"name":"Phase","description":"Single Phase"},{"name":"Tube Type","description":"Stationary Anode"},{"name":"Brand","description":"SUNMAX"},{"name":"Generator Capacity","description":"100 mA"}]', image: 'sunmax/sunmax_100ma-apr-mobile-x-ray-machine_1787312577513.jpg', image2: 'sunmax/sunmax_100ma-apr-mobile-x-ray-machine_2_1787315062776.jpg', image3: 'sunmax/sunmax_100ma-apr-mobile-x-ray-machine_3_1787315063220.png' },
    { name: '300mA X-Ray Machine with Floating Top Table', slug: '300ma-x-ray-machine-with-floating-top-table', brand: 'Sunmax', category_id: 1, mrp: 552000, price: 460000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Mobile Radiography Units"},{"name":"Brand","description":"Sunmax"},{"name":"Generator Capacity","description":"300 mA"},{"name":"AERB Approved","description":"Yes"}]', image: 'sunmax/sunmax_300ma-x-ray-machine-with-float_1787312577645.jpeg', image2: 'sunmax/sunmax_300ma-x-ray-machine-with-float_2_1787315062778.png', image3: '' },
    { name: '300mA Multi Position X-Ray Machine', slug: '300ma-multi-position-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 540000, price: 450000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Brand","description":"Sunmax"},{"name":"Generator Capacity","description":"300 mA"},{"name":"AERB Approved","description":"Yes"},{"name":"Peak Kilo Voltage","description":"125 kvP"}]', image: 'sunmax/sunmax_300ma-multi-position-x-ray-mac_1787312577770.jpg', image2: 'sunmax/sunmax_300ma-multi-position-x-ray-mac_2_1787315062780.jpg', image3: 'sunmax/sunmax_300ma-multi-position-x-ray-mac_3_1787315063452.jpg' },
    { name: '100mA Counter Balance Mobile X Ray Machine', slug: '100ma-counter-balance-mobile-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 210000, price: 175000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Mobile Radiography Units"},{"name":"Brand","description":"Sunmax"},{"name":"Generator Capacity","description":"100 mA"},{"name":"AERB Approved","description":"Yes"},{"name":"Model","description":"SE-100 MX"}]', image: 'sunmax/sunmax_100ma-counter-balance-mobile-x_1787312577983.png', image2: '', image3: '' },
    { name: '30mA And 50mA Lightweight Portable X-Ray Machine', slug: '30ma-and-50ma-lightweight-portable-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 102000, price: 85000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Mobile Radiography Units"},{"name":"Brand","description":"Sunmax"},{"name":"Machine Type","description":"Portable (Mobile)"},{"name":"Model Number","description":"SE30"}]', image: 'sunmax/sunmax_30ma-and-50ma-lightweight-port_1787312578117.png', image2: '', image3: '' },
    { name: 'Portable Handheld X Ray Machine', slug: 'portable-handheld-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 540000, price: 450000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Mobile Radiography Units"},{"name":"Brand","description":"Dexcowin"},{"name":"Tube Voltage","description":"70kV"},{"name":"Current","description":"3mA"}]', image: 'sunmax/sunmax_portable-handheld-x-ray-machin_1787312578248.jpeg', image2: '', image3: '' },
    { name: 'DR14W And DR17W JPI X-Ray Detector', slug: 'dr14w-and-dr17w-jpi-x-ray-detector', brand: 'Sunmax', category_id: 1, mrp: 966000, price: 805000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Scintillation detectors"},{"name":"Brand","description":"JPI"},{"name":"Model","description":"DR17W"}]', image: 'sunmax/sunmax_dr14w-and-dr17w-jpi-x-ray-dete_1787312578392.png', image2: 'sunmax/sunmax_dr14w-and-dr17w-jpi-x-ray-dete_2_1787315062781.jpeg', image3: 'sunmax/sunmax_dr14w-and-dr17w-jpi-x-ray-dete_3_1787315063478.png' },
    { name: '100mA Spring Balance Mobile X-Ray Unit', slug: '100ma-spring-balance-mobile-x-ray-unit', brand: 'Sunmax', category_id: 1, mrp: 192000, price: 160000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"System Type","description":"Mobile"},{"name":"Generator Rating","description":"100 mA"},{"name":"Brand","description":"Sunmax"},{"name":"AERB Approved","description":"Yes"},{"name":"Model","description":"SUNMAX-100MX"}]', image: 'sunmax/sunmax_100ma-spring-balance-mobile-x-_1787312578559.png', image2: 'sunmax/sunmax_100ma-spring-balance-mobile-x-_3_1787315062783.jpg', image3: '' },
    { name: '100mA Double Tank Mobile X-Ray Machine', slug: '100ma-double-tank-mobile-x-ray-machine', brand: 'Sunmax', category_id: 1, mrp: 246000, price: 205000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Type","description":"Mobile Radiography Units"},{"name":"Generator Capacity","description":"100 mA"},{"name":"Tube Type","description":"Stationary Anode"},{"name":"Brand","description":"Sunmax"}]', image: 'sunmax/sunmax_100ma-double-tank-mobile-x-ray_1787312578629.jpg', image2: 'sunmax/sunmax_100ma-double-tank-mobile-x-ray_2_1787315062784.jpg', image3: '' },
    { name: 'DR Holder', slug: 'dr-holder', brand: 'Sunmax', category_id: 1, mrp: 84000, price: 70000, description: 'High-quality X-Ray Machine manufactured by Sunmax.', specification: '[{"name":"Accessory Type","description":"X Ray Stand"},{"name":"Application","description":"General X Ray"},{"name":"Mount Type","description":"Free Standing"},{"name":"Brand","description":"Sunmax"}]', image: 'sunmax/sunmax_dr-holder_1787312578751.png', image2: 'sunmax/sunmax_dr-holder_2_1787315062787.png', image3: '' },
  ];

  const results: any[] = [];

  for (const p of products) {
    try {
      // Check if already exists
      const [existing] = await pool.query('SELECT id FROM products WHERE slug = ?', [p.slug]) as any[];
      if (existing && existing.length > 0) {
        results.push({ slug: p.slug, status: 'skipped', reason: 'already exists', id: existing[0].id });
        continue;
      }

      const [result] = await pool.query(
        "INSERT INTO products (name, slug, brand, category, category_id, mrp, price, stock_quantity, description, specification, image, image2, image3, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live')",
        [p.name, p.slug, p.brand, 'X-Ray Machines', p.category_id, p.mrp, p.price, 10, p.description, p.specification, p.image, p.image2 || null, p.image3 || null]
      ) as any;
      results.push({ slug: p.slug, status: 'inserted', id: result.insertId });
    } catch (e: any) {
      results.push({ slug: p.slug, status: 'error', error: e.message });
    }
  }

  const inserted = results.filter(r => r.status === 'inserted').length;
  const skipped = results.filter(r => r.status === 'skipped').length;

  return NextResponse.json({ 
    message: `Done! Inserted: ${inserted}, Skipped: ${skipped}`, 
    results 
  });
}
