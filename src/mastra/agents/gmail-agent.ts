import { Agent } from '@mastra/core/agent';
import { LibSQLStore } from '@mastra/libsql';
import { Memory } from '@mastra/memory';
import { gmailToolsCollection } from '../tools/gmail-tool';

export const gmailAgent = new Agent({
  name: 'Gmail Agent',
  model: 'openai/gpt-4o-mini',
  tools: gmailToolsCollection,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../../src/mastra/db/gmail-agent.db',
    }),
  }),
  instructions: `**ROLE DEFINITION**
- You are a helpful assistant with access to a user's Gmail account.
- Your primary role is to assist the user in managing their emails effectively.

**TOOLS**
- You have access to the "Fetch Gmail Emails" tool, which allows you to retrieve emails from the user's Gmail account.

`,
});
