import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { QueryProvider } from './providers/query-provider';
import { NavigationProvider } from './providers/navigation-provider';
import { LayoutShell } from './components/layout/LayoutShell';
import { Toaster } from 'sonner';
import './globals.css';
import { NoFlashThemeProvider } from './providers/theme-provider';

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

export const metadata: Metadata = {
  title: 'Vaai',
  description: 'Don\'t trust, verify. Advanced political fact-checking and analysis platform.',
  keywords: ['fact-check', 'politics', 'verification', 'analysis'],
  authors: [{ name: 'kazi' }],
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'Verify',
    title: 'Vaai - The keeper of truth',
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
        {/* Enhanced no-flash theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
                  
                  // Set theme immediately
                  document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', shouldBeDark);
                  document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
                  
                  // Set CSS variables immediately to prevent flashing
                  const root = document.documentElement;
                  if (shouldBeDark) {
                    root.style.setProperty('--background', '222.2 84% 4.9%');
                    root.style.setProperty('--foreground', '210 40% 98%');
                    root.style.setProperty('--card', '222.2 84% 4.9%');
                    root.style.setProperty('--card-foreground', '210 40% 98%');
                    root.style.setProperty('--primary', '217.2 91.2% 59.8%');
                    root.style.setProperty('--border', '217.2 32.6% 17.5%');
                    root.style.setProperty('--muted', '217.2 32.6% 17.5%');
                    root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
                  } else {
                    root.style.setProperty('--background', '0 0% 100%');
                    root.style.setProperty('--foreground', '222.2 84% 4.9%');
                    root.style.setProperty('--card', '0 0% 100%');
                    root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
                    root.style.setProperty('--primary', '217.2 91.2% 59.8%');
                    root.style.setProperty('--border', '214.3 31.8% 91.4%');
                    root.style.setProperty('--muted', '210 40% 96%');
                    root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
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
          <NoFlashThemeProvider>
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
          </NoFlashThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}