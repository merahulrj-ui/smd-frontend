import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const results: any[] = [];

    // 1. Fix Patients Transfer Trolly Price, MRP, Description
    const trollyDesc = 'DHPT-1150 Emergency & Recovery Hydraulic Patient Transfer Trolley with foot-operated hydraulic pump, X-ray cassette tray, oxygen cylinder holder, and safety side rails. Heavy-duty MS framework with epoxy powder coating.';
    const [res1] = await pool.query(`
      UPDATE products 
      SET price = 42000, 
          mrp = 58000, 
          description = ?
      WHERE id = 206 OR slug = 'patients-transfer-trolly'
    `, [trollyDesc]) as any[];
    results.push({ item: 'Patients Transfer Trolly', affected: res1?.affectedRows });

    // 2. Fix Technomed OT Table Description
    const techDesc = 'The Technomed TMI-1202 is a premium C-Arm compatible hydraulic operating table designed for general surgery, orthopedic, urology, and gynecological procedures. Built with high-grade stainless steel (SS 304) construction, it features smooth hydraulic height adjustment, radio-translucent four-section tabletop for seamless fluoroscopic imaging, eccentric column design for maximum C-arm access, and precision lateral tilt and Trendelenburg positioning.';

    const [res2] = await pool.query(`
      UPDATE products 
      SET description = ?
      WHERE id = 19 OR slug = 'technomed-c-arm-compatible-hydraulic-ot-table-tmi-1202'
    `, [techDesc]) as any[];
    results.push({ item: 'Technomed OT Table', affected: res2?.affectedRows });

    // 3. Fix Fineone 1501 BP Monitor Brand
    const [res3] = await pool.query(`
      UPDATE products 
      SET brand = 'FINEONE' 
      WHERE id = 155 OR (name LIKE '%Fineone 1501%' AND (brand = '0' OR brand IS NULL OR brand = ''))
    `) as any[];
    results.push({ item: 'Fineone 1501 BP Monitor', affected: res3?.affectedRows });

    return NextResponse.json({ success: true, updates: results });
  } catch (error: any) {
    console.error('Patch products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
