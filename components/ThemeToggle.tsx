'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Cambiar a light' : 'Cambiar a dark'}
    </button>
  );
}
