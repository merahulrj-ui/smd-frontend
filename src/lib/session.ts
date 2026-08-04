import { SignJWT, jwtVerify } from 'jose';

let secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  console.warn('WARNING: JWT_SECRET environment variable is not set. Using fallback secret. Ensure this is set in production.');
  secretKey = 'development-secret-key-12345';
}

const key = new TextEncoder().encode(secretKey);

export async function encryptSession(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decryptSession(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
