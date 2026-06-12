import type { Metadata } from 'next';
import './globals.css';
import AdminShell from './admin-shell';

export const metadata: Metadata = {
  title: 'JAC CMS',
  description: 'JAC Media Land content administration'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><AdminShell>{children}</AdminShell></body>
    </html>
  );
}
