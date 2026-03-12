import Cookies from 'js-cookie';

const COOKIE_NAME = 'gama-seguimiento-vehiculos.token';

export function getToken(): string | undefined {
  return Cookies.get(COOKIE_NAME);
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
  Cookies.remove(COOKIE_NAME);
}

export function saveToken(token: string): void {
  Cookies.set(COOKIE_NAME, token, { expires: 1 });
}
