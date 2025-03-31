import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: AI_API_KEY,
});

// azure API 호출
export async function getAzureReview(reviewData) {
  const prompt = getPrompt(reviewData);

  const chatResponse = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "",
      },
      { role: "user", content: prompt },
    ],
    model: AI_MODEL,
  });

  return chatResponse.choices[0].message.content;
}
