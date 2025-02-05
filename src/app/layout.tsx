import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prismy - Your Music Journey",
  description: "Discover and analyze your music with Prismy. A privacy-focused music analytics platform.",
  metadataBase: new URL('https://prismy.app'),
  authors: [{ name: 'Prismy Team' }],
  keywords: ['music', 'analytics', 'privacy', 'spotify', 'playlists'],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://prismy.app',
    title: 'Prismy - Your Music Journey',
    description: 'Discover and analyze your music with Prismy. A privacy-focused music analytics platform.',
    siteName: 'Prismy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-20 max-w-7xl">
                {children}
              </main>
              <Footer />
              <CookieConsent />
            </div>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
