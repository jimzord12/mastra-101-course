import { gmailAgent } from "./gmail-agent";

/**
 * Gmail Agent Test Suite
 *
 * This file demonstrates various ways to use your enhanced Gmail agent.
 * Run individual tests to verify your setup works correctly.
 */

// Color output for console
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	blue: "\x1b[34m",
	red: "\x1b[31m",
};

function log(title: string, message: string, color = "blue") {
	const colorCode = colors[color as keyof typeof colors] || colors.blue;
	console.log(`\n${colorCode}${colors.bright}${title}${colors.reset}`);
	console.log(message);
}

/**
 * TEST 1: Email Summary & Analysis
 * Tests the agent's ability to read and summarize emails
 */
export async function testEmailSummary() {
	log(
		"TEST 1: Email Summary & Analysis",
		"Fetching and summarizing unread emails...",
		"blue",
	);

	try {
		const response = await gmailAgent.generate(
			`Please provide a summary of my unread emails. For each email:
      1. Who sent it?
      2. What's the main topic?
      3. Is it urgent or action-required?

      Prioritize by importance and provide a quick summary.`,
		);

		log("✅ TEST 1 PASSED", response.text, "green");
		return response;
	} catch (error) {
		log("❌ TEST 1 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}
/**
 * TEST 2: Email Search
 * Tests the agent's ability to find specific emails
 */
export async function testEmailSearch() {
	log("TEST 2: Email Search", "Searching for specific emails...", "blue");

	try {
		const response = await gmailAgent.generate(
			`Search for emails in my inbox that:
      1. Are from any team members
      2. Contain keywords like "project", "deadline", or "review"
      3. Were received in the last week

      List them with sender and subject.`,
		);

		log("✅ TEST 2 PASSED", response.text, "green");
		return response;
	} catch (error) {
		log("❌ TEST 2 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}

/**
 * TEST 3: Email Organization with Labels
 * Tests the agent's ability to manage labels and organize emails
 */
export async function testEmailOrganization() {
	log(
		"TEST 3: Email Organization",
		"Creating labels and organizing emails...",
		"blue",
	);

	try {
		const response = await gmailAgent.generate(
			`Help me organize my inbox:
      1. Check if I have a "follow-up" label. If not, create it.
      2. Find emails from the last week that might need follow-up
      3. Apply the "follow-up" label to those emails
      4. Tell me how many emails you labeled`,
		);

		log("✅ TEST 3 PASSED", response.text, "green");
		return response;
	} catch (error) {
		log("❌ TEST 3 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}

/**
 * TEST 4: Multi-Step Workflow with Memory
 * Tests the agent's memory capabilities across multiple requests
 */
export async function testMultiStepWorkflow() {
	log(
		"TEST 4: Multi-Step Workflow (Memory Test)",
		"Running multi-step workflow...",
		"blue",
	);

	try {
		// Step 1: Find emails
		log("  Step 1/3", "Finding recent emails...", "yellow");
		const step1 = await gmailAgent.generate(
			"Find my unread emails from today. Focus on emails from colleagues.",
		);
		console.log(step1.text);

		// Step 2: Use memory to reference previous emails
		log("  Step 2/3", "Using memory to reference previous emails...", "yellow");
		const step2 = await gmailAgent.generate(
			"For those emails you just showed me, create a summary with 2-3 key takeaways from each.",
		);
		console.log(step2.text);

		// Step 3: Take action based on previous steps
		log("  Step 3/3", "Taking action based on memory...", "yellow");
		const step3 = await gmailAgent.generate(
			"Based on those emails, list any action items I need to address in priority order.",
		);
		console.log(step3.text);

		log(
			"✅ TEST 4 PASSED",
			"Multi-step workflow completed with memory!",
			"green",
		);
		return { step1, step2, step3 };
	} catch (error) {
		log("❌ TEST 4 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}

/**
 * TEST 5: Draft & Send Workflow
 * Tests the agent's ability to compose and send emails
 * NOTE: This will NOT actually send without explicit confirmation
 */
export async function testDraftEmail() {
	log(
		"TEST 5: Draft Email Workflow",
		"Composing professional email...",
		"blue",
	);

	try {
		const response = await gmailAgent.generate(
			`Compose a professional email reply to a recent message:
      1. Subject should be "Re: [original subject]"
      2. Tone: Professional and concise
      3. Content: Thank them for their message, confirm receipt, and ask if you need any clarification
      4. DO NOT SEND - just show me the draft first`,
		);

		log("✅ TEST 5 PASSED", response.text, "green");
		return response;
	} catch (error) {
		log("❌ TEST 5 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}

/**
 * TEST 6: Inbox Maintenance
 * Tests bulk operations for inbox cleanup
 */
export async function testInboxMaintenance() {
	log("TEST 6: Inbox Maintenance", "Performing maintenance tasks...", "blue");

	try {
		const response = await gmailAgent.generate(
			`Perform light inbox maintenance:
      1. Count total emails in my inbox
      2. Identify newsletters or promotional emails
      3. Tell me about archiving opportunities without actually archiving
      4. Suggest a labeling strategy for better organization`,
		);

		log("✅ TEST 6 PASSED", response.text, "green");
		return response;
	} catch (error) {
		log("❌ TEST 6 FAILED", `Error: ${error}`, "red");
		throw error;
	}
}

/**
 * RUN ALL TESTS
 * Execute all tests sequentially
 */
export async function runAllTests() {
	log("🚀 Gmail Agent Test Suite", "Starting all tests...", "bright");
	console.log("═".repeat(60));

	const tests = [
		{ name: "testEmailSummary", fn: testEmailSummary },
		{ name: "testEmailSearch", fn: testEmailSearch },
		{ name: "testEmailOrganization", fn: testEmailOrganization },
		{ name: "testMultiStepWorkflow", fn: testMultiStepWorkflow },
		{ name: "testDraftEmail", fn: testDraftEmail },
		{ name: "testInboxMaintenance", fn: testInboxMaintenance },
	];

	const results: { name: string; passed: boolean; error?: string }[] = [];

	for (const test of tests) {
		try {
			await test.fn();
			results.push({ name: test.name, passed: true });
		} catch (error) {
			results.push({
				name: test.name,
				passed: false,
				error: String(error),
			});
		}
	}

	// Print summary
	console.log("\n" + "═".repeat(60));
	log("📊 TEST SUMMARY", "", "bright");

	const passed = results.filter((r) => r.passed).length;
	const total = results.length;

	for (const result of results) {
		const status = result.passed ? "✅ PASS" : "❌ FAIL";
		console.log(`${status} - ${result.name}`);
	}

	console.log(`\n${passed}/${total} tests passed`);

	if (passed === total) {
		log(
			"🎉 ALL TESTS PASSED!",
			"Your Gmail agent is working perfectly!",
			"green",
		);
	} else {
		log("⚠️  Some tests failed", "Check the errors above", "red");
	}
}

// Run tests if this file is executed directly
// Usage: npx ts-node gmail-agent.test.ts
export default runAllTests;
