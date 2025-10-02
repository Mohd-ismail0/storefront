export interface ClerkUser {
  id: string;
  email_addresses: Array<{
    email_address: string;
    verification: {
      status: string;
    };
  }>;
  first_name: string | null;
  last_name: string | null;
  created_at: number;
  updated_at: number;
}

export class CustomerSyncService {
  /**
   * Create a new customer in Saleor when a user is created in Clerk
   */
  static async createSaleorCustomer(clerkUser: ClerkUser) {
    try {
      const primaryEmail = clerkUser.email_addresses.find(
        email => email.verification.status === 'verified'
      ) || clerkUser.email_addresses[0];

      if (!primaryEmail) {
        throw new Error('No email address found for Clerk user');
      }

      // For now, we'll just log the customer creation
      // In a real implementation, you would call the Saleor API
      console.log('Creating Saleor customer for Clerk user:', {
        clerkUserId: clerkUser.id,
        email: primaryEmail.email_address,
        firstName: clerkUser.first_name,
        lastName: clerkUser.last_name
      });

      // TODO: Implement actual Saleor customer creation
      // This requires the proper GraphQL mutations to be available
      
      return {
        id: `temp-${clerkUser.id}`,
        email: primaryEmail.email_address,
        firstName: clerkUser.first_name || '',
        lastName: clerkUser.last_name || '',
        metadata: [
          { key: "clerk_user_id", value: clerkUser.id },
          { key: "clerk_created_at", value: clerkUser.created_at.toString() }
        ]
      };
    } catch (error) {
      console.error('Failed to create Saleor customer:', error);
      throw error;
    }
  }

  /**
   * Update an existing customer in Saleor when user data changes in Clerk
   */
  static async updateSaleorCustomer(clerkUser: ClerkUser) {
    try {
      console.log('Updating Saleor customer for Clerk user:', {
        clerkUserId: clerkUser.id,
        updatedAt: clerkUser.updated_at
      });

      // TODO: Implement actual Saleor customer update
      
      return {
        id: `temp-${clerkUser.id}`,
        email: clerkUser.email_addresses[0]?.email_address || '',
        firstName: clerkUser.first_name || '',
        lastName: clerkUser.last_name || '',
        metadata: [
          { key: "clerk_user_id", value: clerkUser.id },
          { key: "clerk_updated_at", value: clerkUser.updated_at.toString() }
        ]
      };
    } catch (error) {
      console.error('Failed to update Saleor customer:', error);
      throw error;
    }
  }

  /**
   * Find Saleor customer by Clerk user ID
   */
  static async getSaleorCustomerByClerkId(clerkUserId: string) {
    try {
      console.log('Looking up Saleor customer for Clerk user:', clerkUserId);
      
      // TODO: Implement actual Saleor customer lookup
      // For now, return null to indicate no customer found
      
      return null;
    } catch (error) {
      console.error('Failed to get Saleor customer by Clerk ID:', error);
      return null;
    }
  }

  /**
   * Handle customer deletion (soft delete or anonymize)
   */
  static async handleCustomerDeletion(clerkUser: ClerkUser) {
    try {
      console.log('Handling customer deletion for Clerk user:', clerkUser.id);
      
      // TODO: Implement proper customer deletion/anonymization logic
      
    } catch (error) {
      console.error('Failed to handle customer deletion:', error);
      throw error;
    }
  }
}