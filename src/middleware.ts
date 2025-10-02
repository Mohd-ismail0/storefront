import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';
import { NextRequest } from 'next/server';

// Create internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  // TODO: Add Firebase authentication protection for protected routes
  // This will be implemented in Phase 3
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, _vercel, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};