import { GoogleGenAI } from "@google/genai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const ai = new GoogleGenAI({
  apiKey: AI_API_KEY,
});

export async function getGeminiReview(diff) {
  const prompt = getPrompt(diff);

  // Gemini API 호출
  const review = await ai.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
  });

  return review.text;
}
