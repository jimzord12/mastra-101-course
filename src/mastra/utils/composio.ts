import { Composio } from '@composio/core';
import { MastraProvider } from '@composio/mastra';

// User ID must be in UUID format (required by Composio)
// For single-user learning, this static UUID is fine
// In production, you'd use actual user UUIDs from your database
export const userId = 'cc01d802-52d7-4a6c-828b-f61207b441c3';

export const gmail_auth_config = 'ac_5IgwM2BCc0Eq';

export const composio = new Composio({
  provider: new MastraProvider(),
  apiKey: process.env.COMPOSIO_API_KEY,
});

export async function authenticateToolkit(userId: string, authConfigId: string) {
  try {
    // First, check if there's already a connected account
    const existingAccounts = await composio.connectedAccounts.list({
      authConfigIds: [authConfigId],
      userIds: [userId],
    });

    // If a connected account already exists, return its ID
    if (existingAccounts.items.length > 0) {
      const accountId = existingAccounts.items[0]?.id;
      if (accountId) {
        console.log(`Using existing connected account: ${accountId}`);
        return accountId;
      }
    }

    // If no account exists, initiate a new connection with allowMultiple option
    const connectionRequest = await composio.connectedAccounts.initiate(userId, authConfigId, {
      allowMultiple: true,
    });
    console.log(`Visit this URL to authenticate Gmail: ${connectionRequest.redirectUrl}`);
    await connectionRequest.waitForConnection(60 * 1000);

    return connectionRequest.id;
  } catch (error) {
    console.error('[composio.ts]: Error during authentication:', error);
    throw error;
  }
}
