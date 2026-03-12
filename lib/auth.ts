import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from './constants';

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

export function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

export function removeToken(): void {
  Cookies.remove(TOKEN_COOKIE_NAME);
}

export function saveToken(token: string): void {
  Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 1 });
}
