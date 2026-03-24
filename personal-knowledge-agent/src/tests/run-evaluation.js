// tests/run-evaluation.js
const { runEvaluation } = require("./evaluation.test");

// Get chatId and kbId from command line or use default
const chatId = process.argv[2] || "chat_1742854800000"; // Replace with your actual chat ID
const kbId = process.argv[3] || "kb_1742854800000"; // Replace with your actual KB ID

console.log("RAG Agent Evaluation Tool");
console.log("Usage: node run-evaluation.js <chatId> <kbId>");
console.log("");

runEvaluation(chatId, kbId).catch(console.error);
