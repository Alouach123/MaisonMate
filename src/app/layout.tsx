
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MainLayout from '@/components/layout/main-layout';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from "@/components/theme-provider"; // New import

const geistSans = Geist({ 
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
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning is important */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider> 
            <WishlistProvider>
              <CartProvider>
                <MainLayout>{children}</MainLayout>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
