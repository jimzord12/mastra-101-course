import { composio, userId } from "../utils/composio";

console.log("[gmail-tool.ts]: Initializing Gmail tools from Composio...");

export const gmailToolsCollection = await composio.tools
	.get(userId, {
		toolkits: ["GMAIL"],
	})
	.then((tools) => {
		console.log("[gmail-tool.ts]: ✅ Gmail tools loaded successfully");
		console.log(
			`[gmail-tool.ts]: Available Gmail tools: ${Object.keys(tools).length} tools`,
		);

		if (Object.keys(tools).length > 0) {
			console.log(
				"[gmail-tool.ts]: Tools available:",
				Object.keys(tools).join(", "),
			);
		}

		return tools;
	})
	.catch((error) => {
		console.error("[gmail-tool.ts]: ❌ Error loading Gmail tools:", error);
		console.error("[gmail-tool.ts]: Make sure:");
		console.error("  1. COMPOSIO_API_KEY is set in .env");
		console.error("  2. Gmail is connected in Composio dashboard");
		console.error("  3. User authentication is configured correctly");

		throw error;
	});
