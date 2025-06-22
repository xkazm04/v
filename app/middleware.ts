import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // Only add locale prefix when not default
});

export default function middleware(request: NextRequest) {
  // Check if user has a preference stored
  const userPreference = request.cookies.get('user-preferences')?.value;
  
  if (userPreference) {
    try {
      const preferences = JSON.parse(userPreference);
      const preferredLocale = preferences.language;
      
      // If user has a preferred locale different from URL locale
      if (preferredLocale && locales.includes(preferredLocale)) {
        const pathname = request.nextUrl.pathname;
        const pathnameIsMissingLocale = locales.every(
          (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        );
        
        // Redirect to preferred locale if missing
        if (pathnameIsMissingLocale && preferredLocale !== defaultLocale) {
          return NextResponse.redirect(
            new URL(`/${preferredLocale}${pathname}`, request.url)
          );
        }
      }
    } catch (error) {
      console.warn('Failed to parse user preferences:', error);
    }
  }

  // Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|es|fr)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};