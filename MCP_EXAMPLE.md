# Complete MCP Integration Example

This example shows how MCP (Model Context Protocol) works in Mastra with a weather server.

## The Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   MCP Server    │◄─────┤   MCPClient     │◄─────┤     Mastra      │
│   (Weather)     │      │                 │      │   Framework     │
│                 │      │  Fetches tools  │      │                 │
│  - get-forecast │      │  from servers   │      │  Orchestrates   │
│  - get-alerts   │      │                 │      │  everything     │
└─────────────────┘      └─────────────────┘      └────────┬────────┘
                                                            │
                                                            │ provides
                                                            │ tools to
                                                            ▼
                                                   ┌─────────────────┐
                                                   │     Agent       │
                                                   │                 │
                                                   │  Uses MCP tools │
                                                   │  seamlessly     │
                                                   └─────────────────┘
```

## Step-by-Step Flow

### 1. MCPClient Configuration (in `src/mastra/index.ts`)

```typescript
const mcp = new MCPClient({
  servers: {
    weather: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-weather'],
    },
  },
});
```

**What happens:**

- Defines an MCP server named "weather"
- Command to start it: `npx -y @modelcontextprotocol/server-weather`
- MCPClient will spawn this process and connect to it

### 2. Mastra Framework Integration

```typescript
export const mastra = new Mastra({
  agents: { mcpDemoAgent },
  // ... other config
});
```

**What happens:**

- Mastra framework initializes
- It discovers the MCPClient configuration
- Connects to MCP servers in the background
- Fetches available tools from each server
- Makes tools available to agents

### 3. Agent Uses MCP Tools

The agent can reference MCP tools using the pattern: `mcp__<servername>__<toolname>`

```typescript
export const mcpDemoAgent = new Agent({
  name: 'MCP Demo Agent',
  model: 'openai/gpt-4o',

  // Option 1: Let agent discover tools automatically
  // (Mastra makes all MCP tools available)

  // Option 2: Explicitly list MCP tools (if supported)
  // toolIds: ["mcp__weather__get-forecast"],

  instructions: 'Use weather tools to answer questions...',
});
```

### 4. Runtime Execution

When you chat with the agent:

```
User: "What's the weather in San Francisco?"

Agent thinks:
  → Needs weather data
  → Searches available tools
  → Finds: mcp__weather__get-forecast
  → Calls tool through Mastra

Mastra receives tool call:
  → Recognizes "mcp__weather__*" pattern
  → Routes to MCPClient
  → MCPClient forwards to weather server process

Weather Server:
  → Receives request
  → Fetches real weather data
  → Returns forecast

Response flows back:
  Weather Server → MCPClient → Mastra → Agent → User
```

## Available MCP Servers (Examples)

```typescript
const mcp = new MCPClient({
  servers: {
    // Weather data
    weather: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-weather'],
    },

    // Filesystem access
    filesystem: {
      command: 'npx',
      args: [
        '-y',
        '@modelcontextprotocol/server-filesystem',
        'C:\\allowed-directory', // Directory to allow access to
      ],
    },

    // GitHub integration
    github: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      },
    },

    // Google Drive
    gdrive: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gdrive'],
      env: {
        GDRIVE_CLIENT_ID: process.env.GDRIVE_CLIENT_ID,
        GDRIVE_CLIENT_SECRET: process.env.GDRIVE_CLIENT_SECRET,
      },
    },
  },
});
```

## Key Insights

1. **MCPClient is separate from Mastra**
   - MCPClient manages MCP server connections
   - Mastra orchestrates the whole framework
   - They work together but have different roles

2. **Agents don't talk directly to MCP servers**
   - All communication goes through: Agent → Mastra → MCPClient → MCP Server
   - This provides logging, observability, error handling, etc.

3. **Tool naming pattern**
   - MCP tools follow: `mcp__<servername>__<toolname>`
   - Custom tools: just use their defined ID
   - Example: `mcp__weather__get-forecast` vs `getTransactionsTool`

4. **No code needed for each tool**
   - Traditional approach: Write a function for each API
   - MCP approach: Connect to server, get all tools automatically
   - Example: Weather server provides multiple tools without writing any code

5. **Process management**
   - MCPClient spawns and manages MCP server processes
   - Handles crashes, restarts, connection issues
   - You just define the command to start each server

## Testing in Playground

1. Start your dev server: `npm run dev`
2. Open http://localhost:4111/
3. Select the MCP Demo Agent
4. Ask: "What's the weather in New York?"
5. Watch the agent use MCP tools automatically!

## The Big Picture

**Without MCP:**

- Want weather? Write a weather API client
- Want GitHub? Write GitHub API integration
- Want Gmail? Write Gmail API integration
- = Lots of custom code

**With MCP:**

- Connect to weather MCP server
- Connect to GitHub MCP server
- Connect to Gmail MCP server
- = Configuration only, tools provided automatically

MCP standardizes how agents access external services, so you can add capabilities without writing integration code!
