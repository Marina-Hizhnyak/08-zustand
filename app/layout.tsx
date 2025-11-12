// app/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'NoteHub — Simple notes manager',
  description: 'Create, search, and manage notes with tags, filters, and a clean UI.',
  openGraph: {
    title: 'NoteHub — Simple notes manager',
    description: 'Create, search, and manage notes with tags, filters, and a clean UI.',
    url: siteUrl,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal, 
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          {children}
            <Footer />
        {modal}  
        </TanStackProvider>
      </body>
    </html>
  );
}


