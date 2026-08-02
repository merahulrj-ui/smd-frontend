import pool from '@/lib/db';
import BrandsClient from './BrandsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBrands() {
  let dbBrands = [];
  
  try {
    const [brandRows] = await pool.query('SELECT * FROM brands ORDER BY name') as any[];
    dbBrands = brandRows;
  } catch (e) {
    console.error(e);
  }

    return (
        <BrandsClient dbBrands={dbBrands} />
    );
}
