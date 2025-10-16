import { composio, userId } from '../utils/composio';

// Ensure Gmail is connected and get the tools
// const connectionId = await authenticateToolkit(userId, gmail_auth_config);

console.log('[gmail-tool.ts]: Getting Gmail tools from Composio...');

// Get all Gmail tools as Mastra tools using userId (not connectionId)
// The Composio SDK will find the connected account for this user automatically

export const gmailToolsCollection = await composio.tools.get(userId, {
  toolkits: ['GMAIL'],
});

console.log('[gmail-tool.ts]: Gmail tools loaded successfully');

// Export the fetch emails tool
