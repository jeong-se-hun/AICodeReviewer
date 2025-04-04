import { Mistral } from "@mistralai/mistralai";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { TIMEOUT } from "../config/constants.js";

const client = new Mistral({ apiKey: AI_API_KEY, timeout: 10 });

// Mistral API 호출
export async function getMistralReview(reviewData) {
  console.log("Mistral API 호출"); // TODO: remove this line
  const prompt = getPrompt(reviewData);

  const chatResponse = await client.chat.complete({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return chatResponse.choices[0].message.content;
}
