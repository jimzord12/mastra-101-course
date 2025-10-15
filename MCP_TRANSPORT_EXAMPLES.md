# MCP Server Transport Examples

## Understanding `command` and `args`

The `command` and `args` tell MCPClient **how to start the MCP server process**. It's like writing a command in your terminal.

---

## Example 1: Wikipedia (Simple NPX Package)

```typescript
{
  command: "npx",
  args: ["-y", "wikipedia-mcp"]
}
```

**What it runs:**

```bash
npx -y wikipedia-mcp
```

**Breakdown:**

- `npx` = Node package executor
- `-y` = Skip confirmation, auto-yes
- `wikipedia-mcp` = NPM package name

**What happens:**

1. NPX downloads `wikipedia-mcp` package (if not cached)
2. Runs the package's executable
3. Server starts and communicates via stdio (standard input/output)

---

## Example 2: Filesystem Server (With Arguments)

```typescript
{
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\MyName\\Documents"]
}
```

**What it runs:**

```bash
npx -y @modelcontextprotocol/server-filesystem "C:\Users\MyName\Documents"
```

**Breakdown:**

- `npx -y` = Run package without confirmation
- `@modelcontextprotocol/server-filesystem` = Package name (scoped package)
- `C:\Users\MyName\Documents` = Argument to the server (which directory to allow access to)

**What happens:**

1. Server starts with permission to access only the specified directory
2. Provides file reading/writing tools limited to that folder

---

## Example 3: Smithery Registry (With Custom Args)

```typescript
{
  command: "npx",
  args: [
    "-y",
    "@smithery/cli@latest",
    "run",
    "@smithery-ai/server-sequential-thinking",
    "--config",
    "{}"
  ]
}
```

**What it runs:**

```bash
npx -y @smithery/cli@latest run @smithery-ai/server-sequential-thinking --config {}
```

**Breakdown:**

- `npx -y @smithery/cli@latest` = Run Smithery CLI tool (latest version)
- `run` = Smithery CLI command
- `@smithery-ai/server-sequential-thinking` = Server to run from Smithery registry
- `--config {}` = Configuration JSON

**What happens:**

1. Smithery CLI downloads and runs the specified MCP server
2. Passes configuration to the server
3. Server starts with custom config

---

## Example 4: HTTP/SSE Transport (No Command)

```typescript
{
  url: new URL('https://mcp.composio.dev/googlesheets/abc123xyz');
}
```

**What happens:**

- No local process spawned
- MCPClient connects to remote HTTP endpoint
- Communication via Server-Sent Events (SSE)
- Server is already running somewhere else

---

## Example 5: Custom Python Server

```typescript
{
  command: "python",
  args: ["my-custom-mcp-server.py", "--port", "8080"]
}
```

**What it runs:**

```bash
python my-custom-mcp-server.py --port 8080
```

**Breakdown:**

- `python` = Python interpreter
- `my-custom-mcp-server.py` = Your custom MCP server script
- `--port 8080` = Custom argument your server accepts

---

## Example 6: With Environment Variables

```typescript
{
  command: "npx",
  args: ["-y", "github-mcp-server"],
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_REPO: "owner/repo"
  }
}
```

**What it runs:**

```bash
GITHUB_TOKEN=<your-token> GITHUB_REPO=owner/repo npx -y github-mcp-server
```

**Breakdown:**

- Sets environment variables before running
- Server can access these via `process.env.GITHUB_TOKEN`
- Useful for API keys and configuration

---

## The MCP Protocol Communication

Once the server starts, MCPClient and the server communicate using **JSON-RPC** messages:

### Request (MCPClient → Server)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

### Response (Server → MCPClient)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "search_wikipedia",
        "description": "Search Wikipedia for information",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### Tool Call (Agent → MCPClient → Server)

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "search_wikipedia",
    "arguments": {
      "query": "Albert Einstein"
    }
  }
}
```

---

## Transport Comparison

| Transport    | Command     | URL         | Use Case                        |
| ------------ | ----------- | ----------- | ------------------------------- |
| **Stdio**    | ✅ Required | ❌ Not used | Local MCP servers, packages     |
| **HTTP/SSE** | ❌ Not used | ✅ Required | Remote servers, hosted services |

---

## Why Two Transports?

### Stdio (Local)

- ✅ No network needed
- ✅ Fast communication
- ✅ Full control over process
- ❌ Must run on same machine

### HTTP/SSE (Remote)

- ✅ Can be hosted anywhere
- ✅ Shared across users
- ✅ No local process management
- ❌ Requires network
- ❌ Potential latency

---

## Summary

**The `command` and `args` pattern is literally:**

```typescript
spawn(command, args);
```

It's the same as typing a command in your terminal:

- `command: "npx"` → The program to run
- `args: ["-y", "wikipedia-mcp"]` → Arguments to pass

MCPClient spawns this as a child process, then talks to it using the MCP protocol (JSON-RPC messages over stdin/stdout).

The MCP protocol itself is separate from the transport - it's the **standardized way of asking for tools, resources, and prompts**, regardless of whether you're using stdio or HTTP!
