import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'samadhan-setu-secret-key-2024';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const payload = verifyToken(token);
    if (!payload) return null;
    
    return payload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  return {
    name: 'auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
  };
}

export function clearAuthCookie() {
  return {
    name: 'auth-token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax' as const,
  };
}
