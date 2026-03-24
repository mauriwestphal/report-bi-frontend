export type Theme = 'light' | 'dark';

export const THEME_KEY = 'bipro-theme';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(THEME_KEY) as Theme) || 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}
