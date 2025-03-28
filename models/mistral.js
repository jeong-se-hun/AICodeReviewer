import { Mistral } from "@mistralai/mistralai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new Mistral({ apiKey: AI_API_KEY });

// Mistral API 호출
export async function getMistralReview(diff) {
  const prompt = getPrompt(diff);

  const chatResponse = await client.chat.complete({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return chatResponse.choices[0].message.content;
}
