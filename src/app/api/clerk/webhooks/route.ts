import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { CustomerSyncService } from '@/lib/customer-sync-simple';
import { validateWebhookSecret } from '@/lib/clerk';

export async function POST(request: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.text();

  // Create a new Svix instance with your secret.
  const webhookSecret = validateWebhookSecret();
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type as string;
  console.log(`Webhook received: ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created':
        await CustomerSyncService.createSaleorCustomer(evt.data as any);
        break;
        
      case 'user.updated':
        await CustomerSyncService.updateSaleorCustomer(evt.data as any);
        break;
        
      case 'user.deleted':
        await CustomerSyncService.handleCustomerDeletion(evt.data as any);
        break;
        
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}