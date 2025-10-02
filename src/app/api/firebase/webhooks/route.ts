import { NextRequest, NextResponse } from 'next/server';
import { CustomerSyncService, FirebaseUser } from '@/lib/customer-sync-simple';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    
    // Firebase webhook events
    const eventType = body.eventType;
    const userData = body.data;

    console.log(`Firebase webhook received: ${eventType}`);

    // Convert Firebase user data to our interface
    const firebaseUser: FirebaseUser = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
      photoURL: userData.photoURL,
      emailVerified: userData.emailVerified,
      createdAt: userData.metadata?.creationTime ? new Date(userData.metadata.creationTime).getTime() : Date.now(),
      lastSignInTime: userData.metadata?.lastSignInTime ? new Date(userData.metadata.lastSignInTime).getTime() : Date.now(),
    };

    switch (eventType) {
      case 'providers/firebase.auth/user.create':
        await CustomerSyncService.createSaleorCustomer(firebaseUser);
        break;

      case 'providers/firebase.auth/user.update':
        await CustomerSyncService.updateSaleorCustomer(firebaseUser);
        break;

      case 'providers/firebase.auth/user.delete':
        await CustomerSyncService.handleCustomerDeletion(firebaseUser);
        break;

      default:
        console.log(`Unhandled Firebase webhook event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Firebase webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}