// Environment variable validation for debugging
export function validateEnvironmentVariables() {
  const errors: string[] = [];
  
  // Client-side variables (these are safe to expose)
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    errors.push('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
  }
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    errors.push('Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  }
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    errors.push('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }
  
  if (!process.env.NEXT_PUBLIC_SALEOR_API_URL) {
    errors.push('Missing NEXT_PUBLIC_SALEOR_API_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_STOREFRONT_URL) {
    errors.push('Missing NEXT_PUBLIC_STOREFRONT_URL');
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