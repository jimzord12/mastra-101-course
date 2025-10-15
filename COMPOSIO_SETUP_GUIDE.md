# Setting Up Composio with Mastra - Quick Guide

Composio is better than Zapier for AI agents! Here's why and how to set it up.

## Why Composio > Zapier

✅ **Built for AI Agents** - Designed specifically for LLM tool use
✅ **Better Security** - Uses proper API keys, not URL-embedded tokens
✅ **More Integrations** - 150+ apps including Gmail, Slack, GitHub, etc.
✅ **Easier Setup** - Direct Mastra integration with `@composio/mastra`
✅ **Free Tier** - Generous free tier for development

---

## Quick Setup (5 minutes)

### Step 1: Create Composio Account

1. Go to **[app.composio.dev](https://app.composio.dev)**
2. Click "Sign Up" (can use GitHub/Google)
3. Complete the onboarding

### Step 2: Get Your API Key

1. Navigate to **Settings → API Keys**
   - Or go directly to: [app.composio.dev/settings/api-keys](https://app.composio.dev/settings/api-keys)
2. Click **"Create New API Key"**
3. Give it a name (e.g., "Mastra Development")
4. **Copy the API key** (you won't see it again!)

### Step 3: Add API Key to .env

Open your `.env` file and add:

```bash
COMPOSIO_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the key you just copied.

### Step 4: Connect Apps You Want to Use

1. Go to **[app.composio.dev/apps](https://app.composio.dev/apps)**
2. Search for "Gmail" (or any app you want)
3. Click **"Connect"**
4. Follow the OAuth flow to authorize
5. Repeat for other apps (Calendar, Slack, etc.)

---

## Using Composio in Your Mastra Agent

### Method 1: Direct Integration (Recommended ✨)

```typescript
import { Agent } from '@mastra/core/agent';
import { getComposioTools } from '@composio/mastra';

// Get tools from Composio
const composioTools = await getComposioTools({
  apiKey: process.env.COMPOSIO_API_KEY!,
  apps: ['gmail', 'googlecalendar', 'slack'],
});

export const assistantAgent = new Agent({
  name: 'Personal Assistant',
  model: 'openai/gpt-4o',
  tools: {
    ...composioTools, // All Gmail, Calendar, Slack tools
  },
  instructions: 'You can send emails, manage calendar, and post to Slack.',
});
```

### Method 2: Via MCP (Alternative)

```typescript
import { MCPClient } from '@mastra/mcp';

const mcp = new MCPClient({
  servers: {
    composio: {
      command: 'npx',
      args: ['-y', '@composio/mcp-server', '--api-key', process.env.COMPOSIO_API_KEY!],
    },
  },
});

const mcpTools = await mcp.getTools();
```

---

## Available Apps (Popular Ones)

### Communication

- **Gmail** - Send/read emails
- **Slack** - Post messages, read channels
- **Discord** - Send messages, manage servers
- **Telegram** - Send/receive messages

### Calendar & Tasks

- **Google Calendar** - Create/read events
- **Notion** - Manage pages and databases
- **Todoist** - Task management
- **Asana** - Project management

### Development

- **GitHub** - Create issues, PRs, manage repos
- **GitLab** - Similar to GitHub
- **Linear** - Issue tracking
- **Jira** - Project management

### Files & Storage

- **Google Drive** - Upload/download files
- **Dropbox** - File operations
- **OneDrive** - Microsoft file storage

### Social Media

- **Twitter/X** - Post tweets, read timeline
- **LinkedIn** - Post updates
- **Instagram** - (limited API access)

### CRM & Sales

- **HubSpot** - Contact/deal management
- **Salesforce** - CRM operations
- **Pipedrive** - Sales pipeline

... and 100+ more!

---

## Example: Gmail Agent

```typescript
import { Agent } from '@mastra/core/agent';
import { getComposioTools } from '@composio/mastra';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

const composioTools = await getComposioTools({
  apiKey: process.env.COMPOSIO_API_KEY!,
  apps: ['gmail'],
});

export const emailAgent = new Agent({
  name: 'Email Assistant',
  model: 'openai/gpt-4o',
  tools: composioTools,
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../../memory.db' }),
  }),
  instructions: `You are an email assistant powered by Gmail.

CAPABILITIES:
- Send emails on behalf of the user
- Read and summarize recent emails
- Search for specific emails
- Draft email responses

GUIDELINES:
- Always confirm before sending emails
- Be concise in summaries
- Respect privacy and confidentiality
- Ask for clarification if email content is unclear`,
});
```

### Testing It

```
User: "Send an email to john@example.com saying I'll be late to the meeting"

Agent:
- Uses gmail_send_email tool
- Composes professional email
- Sends it
- Confirms: "Email sent to john@example.com!"
```

---

## Security Best Practices

### ✅ DO:

- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Revoke unused keys
- Limit tool access to what's needed

### ❌ DON'T:

- Commit API keys to Git
- Share keys publicly
- Use production keys in development
- Give agents access to all apps unnecessarily

---

## Troubleshooting

### "Invalid API Key"

- Check you copied the full key
- Make sure `.env` file is loaded (`process.env.COMPOSIO_API_KEY`)
- Try regenerating the key

### "App not connected"

- Go to [app.composio.dev/apps](https://app.composio.dev/apps)
- Click "Connect" on the app
- Complete OAuth flow
- Wait a few seconds for sync

### "Rate limit exceeded"

- Free tier has limits
- Upgrade to paid plan if needed
- Or wait for rate limit reset

---

## Next Steps

1. ✅ Get Composio API key
2. ✅ Add to `.env` file
3. ✅ Connect apps you want (Gmail, Calendar, etc.)
4. ✅ Update your agent to use Composio tools
5. ✅ Test in playground!

**Ready to build powerful AI agents with real-world integrations!** 🚀
