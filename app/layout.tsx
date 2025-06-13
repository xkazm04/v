import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { QueryProvider } from '@/app/providers/query-provider';
import { NavigationProvider } from './providers/navigation-provider';
import { Toaster } from '@/app/components/ui/sonner';
import { LayoutShell } from './components/layout/LayoutShell';

// Font configurations with improved performance
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: false,
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
});

// Fixed metadata (removed viewport and themeColor)
export const metadata: Metadata = {
  title: 'Verify - Political Fact Checking',
  description: 'Don\'t trust, verify. Advanced political fact-checking and analysis platform.',
  keywords: ['fact-check', 'politics', 'verification', 'analysis'],
  authors: [{ name: 'Verify Team' }],
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'Verify',
    title: 'Verify - Political Fact Checking',
    description: 'Advanced political fact-checking and analysis platform.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// Moved viewport and themeColor to separate export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
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
        {/* Critical theme script - runs before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
                  
                  document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        
        {/* Preload critical routes */}
        <link rel="prefetch" href="/reel" />
        <link rel="prefetch" href="/upload" />
      </head>
      
      <body className="min-h-screen bg-background font-sans antialiased relative overflow-x-hidden">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="theme"
          >
            <NavigationProvider>
              <LayoutShell>
                {children}
              </LayoutShell>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </NavigationProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}