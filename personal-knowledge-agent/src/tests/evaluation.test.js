// tests/evaluation.test.js
// Run with: node tests/evaluation.test.js

const testCases = [
  {
    id: 1,
    question: "What happens if I get locked out of my bank account?",
    expectedAnswer:
      "Account gets locked after 3 failed attempts for 30 minutes. Recovery options include: 'Forgot Password' on login page, calling customer service at 1-800-555-0123, or visiting a branch with government ID.",
    keyPhrases: [
      "3 failed attempts",
      "30 minutes",
      "Forgot Password",
      "1-800-555-0123",
      "government ID",
    ],
    category: "Account Access",
  },
  {
    id: 2,
    question: "How can I view my recent transactions?",
    expectedAnswer:
      "Recent transactions can be viewed through the mobile app (real-time updates), online banking portal (updated daily), monthly statements, or by visiting a branch. Transactions show: date, merchant name, amount, and transaction type.",
    keyPhrases: [
      "mobile app",
      "online banking portal",
      "monthly statements",
      "branch visits",
      "date, merchant name, amount",
    ],
    category: "Transaction Inquiry",
  },
  {
    id: 3,
    question: "What are the fees and interest rates for personal loans?",
    expectedAnswer:
      "Personal loans up to $50,000 with APR ranging from 6.99% to 15.99%, terms from 12 to 60 months. Approval takes 2-3 business days.",
    keyPhrases: [
      "$50,000",
      "6.99% - 15.99%",
      "12-60 months",
      "2-3 business days",
    ],
    category: "Loan Inquiry",
  },
  {
    id: 4,
    question: "How do I report a lost or stolen card and what are the fees?",
    expectedAnswer:
      "Report immediately at 1-800-555-0199 (24/7). Card replacement costs $10 and arrives in 5-7 business days. Fraud alerts available via text.",
    keyPhrases: ["1-800-555-0199", "$10", "5-7 business days", "fraud alerts"],
    category: "Card Services",
  },
  {
    id: 5,
    question: "What are the different account types available and their fees?",
    expectedAnswer:
      "Personal Checking: No monthly fee with direct deposit, $5 otherwise. Savings Account: 0.5% APY, $100 minimum, $3 monthly fee if below $100. Business Account: $15 monthly fee, 200 free transactions.",
    keyPhrases: [
      "Personal Checking",
      "Savings Account",
      "Business Account",
      "direct deposit",
      "$100 minimum",
      "$15 monthly fee",
    ],
    category: "Account Types",
  },
  {
    id: 6,
    question: "How do I dispute an unauthorized charge on my account?",
    expectedAnswer:
      "File dispute within 60 days. You'll receive temporary credit within 10 business days while they investigate.",
    keyPhrases: ["60 days", "temporary credit", "10 business days", "dispute"],
    category: "Billing Issue",
  },
  {
    id: 7,
    question:
      "What are the customer service hours and how can I contact support?",
    expectedAnswer:
      "Customer Service Hours: Mon-Fri 7am-9pm EST, Sat 8am-5pm EST, Sun closed. Call 1-800-555-0123 for general inquiries.",
    keyPhrases: [
      "Mon-Fri 7am-9pm",
      "Sat 8am-5pm",
      "Sun closed",
      "1-800-555-0123",
    ],
    category: "General Information",
  },
  {
    id: 8,
    question: "What information is included in my monthly account statement?",
    expectedAnswer:
      "Statements include: account summary (beginning/ending balance), transaction details, fees charged, and interest earned. Available through online banking. Paper statements cost $2 per month unless enrolled in e-statements.",
    keyPhrases: [
      "account summary",
      "transaction details",
      "fees charged",
      "interest earned",
      "$2 per month",
      "e-statement",
    ],
    category: "Account Statement",
  },
];

// Evaluation metrics
const metrics = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  partialMatches: 0,
  results: [],
};

async function evaluateAnswer(question, expected, actual) {
  const actualLower = actual.toLowerCase();
  const expectedLower = expected.toLowerCase();

  // Check for key phrases
  const keyPhrasesFound = [];
  const keyPhrases = expected.keyPhrases || [];

  keyPhrases.forEach((phrase) => {
    if (actualLower.includes(phrase.toLowerCase())) {
      keyPhrasesFound.push(phrase);
    }
  });

  const matchPercentage = (keyPhrasesFound.length / keyPhrases.length) * 100;

  // Check if answer contains all key phrases
  const exactMatch = keyPhrasesFound.length === keyPhrases.length;

  return {
    success: exactMatch,
    matchPercentage,
    keyPhrasesFound,
    missingPhrases: keyPhrases.filter((p) => !keyPhrasesFound.includes(p)),
  };
}

async function runTest(testCase, agentResponse) {
  const evaluation = await evaluateAnswer(
    testCase.question,
    testCase,
    agentResponse,
  );

  metrics.totalTests++;

  if (evaluation.success) {
    metrics.passed++;
  } else if (evaluation.matchPercentage >= 50) {
    metrics.partialMatches++;
    metrics.failed++;
  } else {
    metrics.failed++;
  }

  metrics.results.push({
    id: testCase.id,
    question: testCase.question,
    category: testCase.category,
    expectedKeyPhrases: testCase.keyPhrases,
    actualResponse: agentResponse,
    evaluation: evaluation,
    status: evaluation.success
      ? "PASS"
      : evaluation.matchPercentage >= 50
        ? "PARTIAL"
        : "FAIL",
  });

  return evaluation;
}

// Function to query your agent API
async function queryAgent(question, chatId, kbId) {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: question,
        chatId: chatId,
        kbId: kbId,
        history: [],
      }),
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error querying agent:", error);
    return null;
  }
}

// Generate evaluation report
function generateReport() {
  console.log("\n" + "=".repeat(80));
  console.log("RAG AGENT EVALUATION REPORT");
  console.log("=".repeat(80));

  console.log("\n📊 SUMMARY STATISTICS:");
  console.log("-".repeat(40));
  console.log(`Total Tests: ${metrics.totalTests}`);
  console.log(
    `✅ Passed: ${metrics.passed} (${((metrics.passed / metrics.totalTests) * 100).toFixed(1)}%)`,
  );
  console.log(
    `⚠️  Partial Matches: ${metrics.partialMatches} (${((metrics.partialMatches / metrics.totalTests) * 100).toFixed(1)}%)`,
  );
  console.log(
    `❌ Failed: ${metrics.failed} (${((metrics.failed / metrics.totalTests) * 100).toFixed(1)}%)`,
  );

  console.log("\n📝 DETAILED RESULTS:");
  console.log("-".repeat(80));

  metrics.results.forEach((result) => {
    const statusEmoji =
      result.status === "PASS"
        ? "✅"
        : result.status === "PARTIAL"
          ? "⚠️"
          : "❌";
    console.log(`\n${statusEmoji} Test #${result.id}: ${result.category}`);
    console.log(`   Question: ${result.question}`);
    console.log(`   Status: ${result.status}`);
    console.log(
      `   Key Phrases Found: ${result.evaluation.matchPercentage.toFixed(0)}%`,
    );
    console.log(
      `   Found: ${result.evaluation.keyPhrasesFound.join(", ") || "None"}`,
    );
    if (result.evaluation.missingPhrases.length > 0) {
      console.log(`   Missing: ${result.evaluation.missingPhrases.join(", ")}`);
    }
  });

  // Performance recommendations
  console.log("\n🎯 RECOMMENDATIONS:");
  console.log("-".repeat(40));

  const passRate = (metrics.passed / metrics.totalTests) * 100;

  if (passRate >= 90) {
    console.log(
      "✓ Excellent performance! The agent is retrieving context effectively.",
    );
  } else if (passRate >= 70) {
    console.log(
      "✓ Good performance. Consider improving document chunking and retrieval strategies.",
    );
  } else if (passRate >= 50) {
    console.log(
      "⚠️ Moderate performance. Review your chunk size, overlap, and retrieval parameters.",
    );
  } else {
    console.log(
      "❌ Poor performance. Check your document indexing, embedding model, and retrieval configuration.",
    );
  }

  if (metrics.partialMatches > 0) {
    console.log("\n💡 Improvement Suggestions:");
    console.log("1. Increase chunk size to capture more context per retrieval");
    console.log("2. Adjust chunk overlap to maintain context between chunks");
    console.log(
      "3. Consider increasing nResults for broader context retrieval",
    );
    console.log(
      "4. Review prompt engineering to better leverage retrieved context",
    );
    console.log("5. Ensure documents are properly formatted and parsed");
  }
}

// Main evaluation function
async function runEvaluation(chatId, kbId) {
  console.log("🚀 Starting RAG Agent Evaluation...");
  console.log(`Chat ID: ${chatId}`);
  console.log(`KB ID: ${kbId}`);
  console.log("-".repeat(80));

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.question}`);
    console.log(`   Category: ${testCase.category}`);
    console.log(`   Expected key phrases: ${testCase.keyPhrases.join(", ")}`);

    const response = await queryAgent(testCase.question, chatId, kbId);

    if (response) {
      console.log(`   Response received: ${response.substring(0, 150)}...`);
      await runTest(testCase, response);
    } else {
      console.log(`   ❌ No response received`);
      metrics.totalTests++;
      metrics.failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  generateReport();
}

// Export for use in other files
module.exports = { runEvaluation, testCases, metrics };
