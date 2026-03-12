import type { Metadata } from 'next';
// Kit Digital USS — provee variables CSS y estilos base (fuentes, tokens de color, etc.)
// Importar antes de cualquier estilo propio.
import '@ussebastian/kitdigital/dist/css/main.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Plataforma BI USS',
  description: 'Plataforma de reportes Power BI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
