import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Memory } from "@mastra/memory";
import { createSmitheryUrl } from "@smithery/sdk";

const smitheryGithubMCPServerUrl = createSmitheryUrl(
	"https://server.smithery.ai/@smithery-ai/github",
	{
		apiKey: process.env.SMITHERY_API_KEY,
		profile: process.env.SMITHERY_PROFILE,
	},
);

const mcp = new MCPClient({
	servers: {
		// Smithery GitHub MCP Server - provides GitHub repo management tools
		github: {
			command: "cmd",
			args: [
				"/c",
				"bunx",
				"-y",
				"@smithery/cli@latest",
				"run",
				"@smithery-ai/github",
				"--key",
				"24d68c88-4c5d-4c14-8f13-39ed5da2b742",
			],
		},
	},
});

export const githubAgent = new Agent({
	name: "GitHub Agent",
	model: "openai/gpt-4o",
	tools: await mcp.getTools(),
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../../src/mastra/db/github-agent.db",
		}),
	}),
	instructions: `**ROLE DEFINITION**
  You are an intelligent GitHub assistant with full access to a user's GitHub repositories. Your primary goal is to help users manage, organize, and interact with their GitHub repositories efficiently. You are proactive, helpful, and always prioritize user's repository productivity.`,
});
