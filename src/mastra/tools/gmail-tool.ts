import {
	authenticateToolkit,
	composio,
	gmail_auth_config,
	userId,
} from "../utils/composio";

// Authenticate the toolkit
const connectionId = await authenticateToolkit(userId, gmail_auth_config);

const connectedAccount = await composio.connectedAccounts.get(connectionId);
console.log("Connected account:", connectedAccount);

export const fetchGmailEmails = await composio.tools.get(connectedAccount.id, {
	tools: ["GMAIL_FETCH_EMAILS"],
});
