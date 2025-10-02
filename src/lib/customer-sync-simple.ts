export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: number;
  lastSignInTime: number;
}

export class CustomerSyncService {
  /**
   * Create a new customer in Saleor when a user is created in Firebase
   */
  static async createSaleorCustomer(firebaseUser: FirebaseUser) {
    try {
      if (!firebaseUser.email) {
        throw new Error('No email address found for Firebase user');
      }

      // For now, we'll just log the customer creation
      // In a real implementation, you would call the Saleor API
      console.log('Creating Saleor customer for Firebase user:', {
        firebaseUserId: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        phoneNumber: firebaseUser.phoneNumber
      });

      // TODO: Implement actual Saleor customer creation
      // This requires the proper GraphQL mutations to be available
      
      return {
        id: `temp-${firebaseUser.uid}`,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        metadata: [
          { key: "firebase_user_id", value: firebaseUser.uid },
          { key: "firebase_created_at", value: firebaseUser.createdAt.toString() },
          { key: "phone_number", value: firebaseUser.phoneNumber || '' }
        ]
      };
    } catch (error) {
      console.error('Failed to create Saleor customer:', error);
      throw error;
    }
  }

  /**
   * Update an existing customer in Saleor when user data changes in Firebase
   */
  static async updateSaleorCustomer(firebaseUser: FirebaseUser) {
    try {
      console.log('Updating Saleor customer for Firebase user:', {
        firebaseUserId: firebaseUser.uid,
        lastSignInTime: firebaseUser.lastSignInTime
      });

      // TODO: Implement actual Saleor customer update
      
      return {
        id: `temp-${firebaseUser.uid}`,
        email: firebaseUser.email || '',
        firstName: firebaseUser.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        metadata: [
          { key: "firebase_user_id", value: firebaseUser.uid },
          { key: "firebase_last_sign_in", value: firebaseUser.lastSignInTime.toString() },
          { key: "phone_number", value: firebaseUser.phoneNumber || '' }
        ]
      };
    } catch (error) {
      console.error('Failed to update Saleor customer:', error);
      throw error;
    }
  }

  /**
   * Find Saleor customer by Firebase user ID
   */
  static async getSaleorCustomerByFirebaseId(firebaseUserId: string) {
    try {
      console.log('Looking up Saleor customer for Firebase user:', firebaseUserId);
      
      // TODO: Implement actual Saleor customer lookup
      // For now, return null to indicate no customer found
      
      return null;
    } catch (error) {
      console.error('Failed to get Saleor customer by Firebase ID:', error);
      return null;
    }
  }

  /**
   * Handle customer deletion (soft delete or anonymize)
   */
  static async handleCustomerDeletion(firebaseUser: FirebaseUser) {
    try {
      console.log('Handling customer deletion for Firebase user:', firebaseUser.uid);
      
      // TODO: Implement proper customer deletion/anonymization logic
      
    } catch (error) {
      console.error('Failed to handle customer deletion:', error);
      throw error;
    }
  }
}