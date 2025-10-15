import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Memory } from "@mastra/memory";

const mcp = new MCPClient({
	servers: {
		// Wikipedia MCP Server - provides Wikipedia search tools
		wikipedia: {
			command: "bunx",
			args: ["-y", "wikipedia-mcp"],
		},
	},
});

// THIS IS THE KEY CONNECTION!
// Create an agent that uses MCP tools by calling mcp.getTools()
export const mcpAgent = new Agent({
	name: "MCP Wikipedia Agent",
	model: "openai/gpt-4o",
	instructions:
		"You are a helpful assistant with access to Wikipedia search tools from the MCP server. Use them to answer questions about any topic.",
	tools: await mcp.getTools(), // <-- This connects MCPClient tools to the Agent!
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../../memory.db",
		}),
	}),
});
