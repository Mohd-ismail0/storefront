// Environment variable validation for debugging
export function validateEnvironmentVariables() {
  const errors: string[] = [];
  
  // Client-side variables (these are safe to expose)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    errors.push('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  
  if (!process.env.NEXT_PUBLIC_SALEOR_API_URL) {
    errors.push('Missing NEXT_PUBLIC_SALEOR_API_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_STOREFRONT_URL) {
    errors.push('Missing NEXT_PUBLIC_STOREFRONT_URL');
  }
  
  // Server-side variables (these should only be checked on server)
  if (typeof window === 'undefined') {
    if (!process.env.CLERK_SECRET_KEY) {
      errors.push('Missing CLERK_SECRET_KEY (server-side only)');
    }
    
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      errors.push('Missing CLERK_WEBHOOK_SECRET (server-side only)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Log environment status (only in development)
if (process.env.NODE_ENV === 'development') {
  const validation = validateEnvironmentVariables();
  if (!validation.isValid) {
    console.warn('Environment variable validation failed:', validation.errors);
  } else {
    console.log('✅ All environment variables are properly configured');
  }
}