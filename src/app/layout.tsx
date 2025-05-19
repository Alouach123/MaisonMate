
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

// SVG data URI for the Armchair icon
const armchairSvgDataUri = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/%3E%3Cpath d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4.5-1.5L15 8"/%3E%3Cpath d="M5 18v2"/%3E%3Cpath d="M19 18v2"/%3E%3C/svg%3E';

export const metadata: Metadata = {
  title: 'MaisonMate - Your Home Supply Destination',
  description: 'Discover a curated collection of furniture and home goods at MaisonMate.',
  icons: {
    icon: {
      url: armchairSvgDataUri,
      type: 'image/svg+xml',
    },
  },
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
