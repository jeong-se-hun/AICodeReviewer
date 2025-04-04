import { GoogleGenAI } from "@google/genai";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { ERROR_MESSAGES, TIMEOUT } from "../config/constants.js";

const ai = new GoogleGenAI({
  apiKey: AI_API_KEY,
  httpOptions: {
    timeout: 100,
  },
});

export async function getGeminiReview(reviewData) {
  try {
    const prompt = getPrompt(reviewData);

    // Gemini API 호출
    const review = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    if (!review || !review.text) {
      throw new Error(ERROR_MESSAGES.AI_EMPTY_RESPONSE);
    }

    return review.text;
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.AI_REVIEW_FAILED}: ${error.message}`);
  }
}
