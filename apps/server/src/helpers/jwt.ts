import { verify, sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

export function createJWT(id: string) {
  return sign(id, JWT_SECRET);
}

export function verifyJWT(jwt: string): string | null {
  try {
    return verify(jwt, JWT_SECRET) as string;
  } catch {
    return null;
  }
}
