
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming these are your chosen fonts
import './globals.css';
import MainLayout from '@/components/layout/main-layout';
import { WishlistProvider } from '@/contexts/wishlist-context';

const geistSans = Geist({ // Assuming these fonts are defined or use Inter as a fallback
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MaisonMate - Your Home Supply Destination',
  description: 'Discover a curated collection of furniture and home goods at MaisonMate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WishlistProvider>
          <MainLayout>{children}</MainLayout>
        </WishlistProvider>
      </body>
    </html>
  );
}
