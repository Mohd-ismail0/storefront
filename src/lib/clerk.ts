// Clerk configuration constants
export const CLERK_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
  webhookSecret: process.env.CLERK_WEBHOOK_SECRET!,
} as const;

// Validate environment variables (only for required ones)
if (!CLERK_CONFIG.publishableKey) {
  throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
}

if (!CLERK_CONFIG.secretKey) {
  throw new Error('Missing CLERK_SECRET_KEY environment variable');
}

// Webhook secret validation function (only called when webhook is used)
export function validateWebhookSecret() {
  if (!CLERK_CONFIG.webhookSecret) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
  }
  return CLERK_CONFIG.webhookSecret;
}