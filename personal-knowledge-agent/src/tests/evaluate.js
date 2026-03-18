import { evaluationQuestions } from "./questions.js";

async function run() {
  for (const q of evaluationQuestions) {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: q.question,
      }),
    });

    const data = await res.json();

    const pass = data.answer.toLowerCase().includes(q.expected);

    console.log(q.question);
    console.log(pass ? "PASS" : "FAIL");
  }
}

run();
