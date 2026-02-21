import {generateText} from "../config/gemini.js";

function extractJSON(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error("AI response parsing failed");
  }
}

// Generate quick roadmap based on goal and experience
export const generateQuickRoadmap = async ({
  goal,
  experienceLevel,
  timeline,
}) => {
  const prompt = `
You are an expert career mentor.

Create a structured learning roadmap.

Return ONLY valid JSON in this format:

{
  "summary": "short summary",
  "roadmap": [
    {
      "phase": "Phase name",
      "duration": "e.g., 2 weeks",
      "skills": ["skill1", "skill2"],
      "projects": ["project idea"],
      "resources": ["resource suggestion"]
    }
  ],
  "estimatedCompletion": "total timeline"
}

User Goal: ${goal}
Experience Level: ${experienceLevel}
Timeline: ${timeline}
`;

  const result = await generateText.generateContent(prompt);
  const text = result.response.text();

  const jsonData = extractJSON(text);

  return {
    json: jsonData,
    formatted: text,
  };
};

//Assessment analysis
export const generateAssessmentResult = async ({ goal, answers }) => {
  const prompt = `
You are a technical evaluator.

Analyze the user's assessment answers and return ONLY valid JSON:

{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "skillLevel": "Beginner/Intermediate/Advanced",
  "recommendation": "short recommendation paragraph"
}

Goal: ${goal}
Answers: ${JSON.stringify(answers)}
`;

  const result = await generateText.generateContent(prompt);
  const text = result.response.text();

  const jsonData = extractJSON(text);

  return {
    json: jsonData,
    formatted: text,
  };
};

//Generate final personalized roadmap based on goal, experience, timeline, assessment answers and analysis
export const generateFinalRoadmap = async ({
  goal,
  experienceLevel,
  timeline,
  answers,
  analysis,
}) => {
  const prompt = `
You are a senior AI career architect.

Using the assessment analysis, generate a personalized roadmap.

Return ONLY valid JSON:

{
  "summary": "personalized summary",
  "skillGapFocus": ["skill1", "skill2"],
  "roadmap": [
    {
      "phase": "Phase name",
      "duration": "duration",
      "focus": ["topics"],
      "projects": ["projects"],
      "resources": ["resources"]
    }
  ],
  "finalAdvice": "motivational advice"
}

User Goal: ${goal}
Experience Level: ${experienceLevel}
Timeline: ${timeline}
Assessment Answers: ${JSON.stringify(answers)}
Assessment Analysis: ${JSON.stringify(analysis)}
`;

  const result = await generateText.generateContent(prompt);
  const text = result.response.text();

  const jsonData = extractJSON(text);

  return {
    json: jsonData,
    formatted: text,
  };
};