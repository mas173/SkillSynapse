import { generateText } from "../config/gemini.js";

export async function interpretGoal(goalText) {
  const prompt = `
You are analyzing a learning goal.

Return ONLY valid JSON in this format:
{
  "suggestedRole": "string",
  "skillFocus": ["skill1", "skill2"],
  "estimatedDifficulty": "Beginner | Intermediate | Advanced"
}

Goal:
${goalText}
`;

  const text = await generateText(prompt);

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON from Gemini (goal interpretation)");
  }
}