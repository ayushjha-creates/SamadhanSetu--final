import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './providers';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'Samadhan Setu - Civic Issue Reporting Platform',
  description: 'Report civic issues and track their resolution. Together we build a better Bhopal.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Samadhan Setu',
    description: 'Civic Issue Reporting Platform for Bhopal',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}