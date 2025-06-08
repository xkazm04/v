import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { QueryProvider } from '@/app/providers/query-provider';
import { DesktopNavbar } from '@/app/sections/navigation/DesktopNavbar';
import { MobileNavbar } from '@/app/sections/navigation/MobileNavbar';

import { Toaster } from '@/app/components/ui/sonner';
import { PageTransition } from '@/app/components/layout/PageTransition';
import { NavigationProvider } from './providers/navigation-provider';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'V',
  description: 'Dont trust, verify.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
                
                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased relative overflow-x-hidden">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <NavigationProvider>
              <div className="relative flex min-h-screen flex-col">
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <DesktopNavbar />
                </div>

                {/* Main Content */}
                <main className="flex-1 relative z-10">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>

                {/* Mobile Navigation - Bottom Tab Bar */}
                <div className="md:hidden">
                  <MobileNavbar />
                </div>
              </div>
              <Toaster />
            </NavigationProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}