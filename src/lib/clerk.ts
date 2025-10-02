// Client-side Clerk configuration (only publishable key)
export const CLERK_CLIENT_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
} as const;

// Validate client-side environment variables
if (!CLERK_CLIENT_CONFIG.publishableKey) {
  throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
}

// Server-side Clerk configuration (includes secret key)
export const CLERK_SERVER_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
  webhookSecret: process.env.CLERK_WEBHOOK_SECRET!,
} as const;

// Server-side validation function
export function validateServerConfig() {
  if (!CLERK_SERVER_CONFIG.publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
  }
  if (!CLERK_SERVER_CONFIG.secretKey) {
    throw new Error('Missing CLERK_SECRET_KEY environment variable');
  }
  return CLERK_SERVER_CONFIG;
}

// Webhook secret validation function (only called when webhook is used)
export function validateWebhookSecret() {
  if (!CLERK_SERVER_CONFIG.webhookSecret) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
  }
  return CLERK_SERVER_CONFIG.webhookSecret;
}