import pool from '@/lib/db';
import EnquiriesClient from './EnquiriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminEnquiries() {
  let enquiries = [];
  let totalVisits = 0;
  
  try {
    const [enqRows] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 50') as any[];
    enquiries = enqRows;

    const [visitRows] = await pool.query('SELECT COUNT(*) as c FROM visitor_logs') as any[];
    totalVisits = visitRows[0].c;
  } catch (e) {
    console.error(e);
  }

    return (
        <EnquiriesClient enquiries={enquiries} totalVisits={totalVisits} />
    );
}
