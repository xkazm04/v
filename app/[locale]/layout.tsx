import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { QueryProvider } from '../providers/query-provider';
import { NavigationProvider } from '../providers/navigation-provider';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Toaster } from 'sonner';
import '../globals.css';
import { NoFlashThemeProvider } from '../providers/theme-provider';
import { notFound } from 'next/navigation';

// Supported locales for [locale] routes only
const supportedLocales = ['es', 'cs'];

// Font configurations
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    es: 'Vaai - Plataforma de Verificación de la Verdad',
    cs: 'Vaai - Platforma pro Ověřování Pravdy'
  };

  const descriptions = {
    es: 'No confíes, verifica. Plataforma avanzada de verificación de hechos políticos y análisis.',
    cs: 'Nevěř, ověř. Pokročilá platforma pro ověřování politických faktů a analýzu.'
  };

  return {
    title: titles[locale as keyof typeof titles] || 'Vaai - Truth Verification Platform',
    description: descriptions[locale as keyof typeof descriptions] || 'Advanced fact-checking platform',
    keywords: ['fact-check', 'politics', 'verification', 'analysis'],
    authors: [{ name: 'kazi' }],
    manifest: '/manifest.json',
    robots: 'index, follow',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate locale
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
                  
                  document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', shouldBeDark);
                  document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
                  
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