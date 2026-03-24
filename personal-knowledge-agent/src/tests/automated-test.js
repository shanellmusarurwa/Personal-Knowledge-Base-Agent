// tests/automated-test.js
const puppeteer = require("puppeteer");

async function runAutomatedTest() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Starting automated RAG agent tests...");

  // Navigate to the app
  await page.goto("http://localhost:3000");
  await page.waitForTimeout(2000);

  const testQuestions = [
    "What happens if I get locked out of my bank account?",
    "How can I view my recent transactions?",
    "What are the fees and interest rates for personal loans?",
  ];

  const results = [];

  for (let i = 0; i < testQuestions.length; i++) {
    console.log(`\nTesting question ${i + 1}: ${testQuestions[i]}`);

    // Find input field and type question
    await page.type(
      'input[placeholder*="Ask your documents"]',
      testQuestions[i],
    );
    await page.click('button:has-text("Send")');

    // Wait for response
    await page.waitForTimeout(5000);

    // Get the latest AI response
    const aiMessages = await page.$$eval(".bg-\\[\\#2e6e62\\]", (elements) =>
      elements.map((el) => el.innerText),
    );

    const lastResponse = aiMessages[aiMessages.length - 1];
    console.log(`Response: ${lastResponse.substring(0, 200)}...`);

    results.push({
      question: testQuestions[i],
      response: lastResponse,
    });
  }

  console.log("\n📊 Test Results:");
  results.forEach((result, idx) => {
    console.log(`\n${idx + 1}. ${result.question}`);
    console.log(`   Response: ${result.response.substring(0, 150)}...`);
  });

  await browser.close();
}

// Run tests
runAutomatedTest().catch(console.error);
