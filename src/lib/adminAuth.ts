import { cookies } from 'next/headers';
import { decryptSession } from './session';

export async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) return false;
  
  const payload = await decryptSession(session.value);
  return !!payload;
}
