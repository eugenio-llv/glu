import { defineMiddleware } from 'astro:middleware';

const defaultCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "connect-src 'self' https://www.google-analytics.com https://formfy.layline.ventures",
  "form-action 'self' https://formfy.layline.ventures",
  'upgrade-insecure-requests',
].join('; ');

const authCallbackCsp = [
  "default-src 'self'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "form-action 'none'",
].join('; ');

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const pathname = new URL(context.request.url).pathname;
  const isAuthCallback = pathname === '/signin-callback';

  response.headers.set('Content-Security-Policy', isAuthCallback ? authCallbackCsp : defaultCsp);
  response.headers.set('Referrer-Policy', isAuthCallback ? 'no-referrer' : 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  );

  return response;
});
