import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC
    `) as any[];

    const products = rows || [];

    if (format === 'xml') {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>SMD MEDICARE Product Feed</title>
    <link>https://www.smdmedicare.in</link>
    <description>Wholesale Medical Equipment, Hospital Furniture &amp; Diagnostic Supplies</description>
`;

      for (const p of products) {
        const prodPrice = p.price && Number(p.price) > 0 ? `${Number(p.price).toFixed(2)} INR` : '100.00 INR';
        const prodLink = `https://www.smdmedicare.in/product/${p.slug || p.id}`;
        let imgUrl = 'https://www.smdmedicare.in/icon-512.png';
        if (p.image) {
          const cImg = p.image.trim();
          if (cImg.startsWith('http')) imgUrl = cImg;
          else if (cImg.startsWith('/')) imgUrl = `https://www.smdmedicare.in${cImg}`;
          else if (cImg.startsWith('backend-media/')) imgUrl = `https://www.smdmedicare.in/${cImg}`;
          else imgUrl = `https://www.smdmedicare.in/backend-media/${cImg}`;
        }
        const cleanDesc = (p.short_description || p.description || `Buy ${p.name} at wholesale prices in India from SMD Medicare.`).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

        const prodSku = p.sku || ('SMD-' + String(p.id).padStart(3, '0'));

        xml += `    <item>
      <g:id>${prodSku}</g:id>
      <g:mpn>${prodSku}</g:mpn>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${cleanDesc}]]></g:description>
      <g:link>${prodLink}</g:link>
      <g:image_link>${imgUrl}</g:image_link>
      <g:brand><![CDATA[${p.brand || 'SMD MEDICARE'}]]></g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${prodPrice}</g:price>
      <g:google_product_category>Health &amp; Beauty &gt; Healthcare</g:google_product_category>
    </item>
`;
      }

      xml += `  </channel>
</rss>`;

      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
    }

    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'google_product_category'
    ];

    const lines = [headers.join(',')];

    for (const p of products) {
      const prodSku = p.sku || ('SMD-' + String(p.id).padStart(3, '0'));
      const prodPrice = p.price && Number(p.price) > 0 ? `${Number(p.price).toFixed(2)} INR` : '100.00 INR';
      const prodLink = `https://www.smdmedicare.in/product/${p.slug || p.id}`;
      let imgUrl = 'https://www.smdmedicare.in/icon-512.png';
      if (p.image) {
        const cImg = p.image.trim();
        if (cImg.startsWith('http')) imgUrl = cImg;
        else if (cImg.startsWith('/')) imgUrl = `https://www.smdmedicare.in${cImg}`;
        else if (cImg.startsWith('backend-media/')) imgUrl = `https://www.smdmedicare.in/${cImg}`;
        else imgUrl = `https://www.smdmedicare.in/backend-media/${cImg}`;
      }
      const cleanDesc = (p.short_description || p.description || `Buy ${p.name} online at wholesale prices in India with nationwide delivery from SMD Medicare.`).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

      const row = [
        escapeCsv(prodSku),
        escapeCsv(p.name),
        escapeCsv(cleanDesc),
        escapeCsv('in stock'),
        escapeCsv('new'),
        escapeCsv(prodPrice),
        escapeCsv(prodLink),
        escapeCsv(imgUrl),
        escapeCsv(p.brand || 'SMD MEDICARE'),
        escapeCsv('Health & Beauty > Healthcare')
      ];

      lines.push(row.join(','));
    }

    const csvContent = lines.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="datafeed.csv"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Datafeed error:', error);
    return new NextResponse('id,title,description,availability,condition,price,link,image_link,brand\n', {
      status: 500,
      headers: { 'Content-Type': 'text/csv; charset=utf-8' }
    });
  }
}
