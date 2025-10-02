'use client';

import { ClerkProvider, useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CustomerSyncService } from '@/lib/customer-sync-simple';
import { CLERK_CLIENT_CONFIG } from '@/lib/clerk';

// Types
export interface SaleorCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  metadata: Array<{ key: string; value: string }>;
}

export interface AuthContextType {
  clerkUser: any;
  saleorCustomer: SaleorCustomer | null;
  isLoading: boolean;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Main provider component
export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_CLIENT_CONFIG.publishableKey}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ClerkProvider>
  );
}

// Internal context provider
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const [saleorCustomer, setSaleorCustomer] = useState<SaleorCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    if (!clerkUser) {
      setSaleorCustomer(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Fetch Saleor customer data
    const fetchSaleorCustomer = async () => {
      try {
        setError(null);
        const customer = await CustomerSyncService.getSaleorCustomerByClerkId(clerkUser.id);
        setSaleorCustomer(customer);
      } catch (err) {
        console.error('Failed to fetch Saleor customer:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSaleorCustomer();
  }, [clerkUser, isLoaded]);

  return (
    <AuthContext.Provider value={{ 
      clerkUser, 
      saleorCustomer, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within UnifiedAuthProvider');
  }
  return context;
}