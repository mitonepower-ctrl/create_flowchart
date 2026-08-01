import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EvaluateResult, FlowchartJson } from "@/lib/types";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODEL });
}

export async function evaluateFlowchart(
  problemTitle: string,
  pseudocode: string,
  flowchart: FlowchartJson
): Promise<EvaluateResult> {
  const model = getModel();

  const prompt = `You are a strict but encouraging programming teacher who teaches flowcharting to beginners.

A student is working on this problem: "${problemTitle}"

Reference pseudocode for the correct logic:
"""
${pseudocode}
"""

The student built the following flowchart, represented as React Flow nodes and edges in JSON. Each node has a "type" (start, process, decision, loop, end) and a "data.label" describing what it does. Edges connect nodes and may have a "label" (e.g. "Yes"/"No" out of a decision node).

Flowchart JSON:
${JSON.stringify(flowchart)}

Evaluate whether the flowchart's logic and structure correctly implement the pseudocode. Check for: correct start/end nodes, correct sequencing, correct branching on decisions, correct loop structure and exit conditions, and no missing or dead-end steps.

Respond ONLY with strict JSON in this exact shape, no markdown fences:
{"status": "pass" or "fail", "feedback": "2-4 sentences of feedback"}

Rules for feedback:
- Be encouraging in tone, but honest about correctness.
- If it fails, give a HINT about what's wrong or missing (e.g. "check what happens when the condition is false") - do NOT reveal the exact fixed flowchart or write the answer for them.
- If it passes, briefly say why it's correct and optionally note one good practice.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  try {
    const parsed = JSON.parse(text);
    const status = parsed.status === "pass" ? "pass" : "fail";
    const feedback =
      typeof parsed.feedback === "string" && parsed.feedback.trim().length > 0
        ? parsed.feedback
        : "The AI could not produce detailed feedback this time. Please try again.";
    return { status, feedback };
  } catch {
    return {
      status: "fail",
      feedback:
        "The AI response could not be parsed. Please try checking your answer again.",
    };
  }
}

export async function generatePseudocode(
  title: string,
  description: string,
  type: string
): Promise<string> {
  const model = getModel();

  const prompt = `You write clear beginner-friendly pseudocode for a flowcharting course.

Problem type: ${type}
Problem title: "${title}"
Problem description: "${description}"

Write pseudocode for this problem using simple, numbered, language-agnostic steps (e.g. START, INPUT, IF/ELSE, WHILE/FOR, PROCESS, OUTPUT, END). Keep it concise - roughly 5 to 15 lines. Respond with ONLY the pseudocode text, no explanation, no markdown code fences.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
