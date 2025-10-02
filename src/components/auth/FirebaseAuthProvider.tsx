'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CustomerSyncService } from '@/lib/customer-sync-simple';

// Types
export interface FirebaseUser extends User {
  // Extend with any additional properties you need
}

export interface SaleorCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  metadata: Array<{ key: string; value: string }>;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  saleorCustomer: SaleorCustomer | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<{ verificationId: string }>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Main provider component
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [saleorCustomer, setSaleorCustomer] = useState<SaleorCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setError(null);
        setUser(firebaseUser as FirebaseUser);

        if (firebaseUser) {
          // Fetch Saleor customer data
          const customer = await CustomerSyncService.getSaleorCustomerByFirebaseId(firebaseUser.uid);
          setSaleorCustomer(customer);
        } else {
          setSaleorCustomer(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    try {
      setError(null);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return { verificationId: confirmationResult.verificationId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Phone sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const verifyPhoneCode = async (verificationId: string, code: string) => {
    try {
      setError(null);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Phone verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');
      await updateProfile(user, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    user,
    saleorCustomer,
    isLoading,
    error,
    signIn,
    signUp,
    signOut: handleSignOut,
    resetPassword,
    signInWithPhone,
    verifyPhoneCode,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within FirebaseAuthProvider');
  }
  return context;
}