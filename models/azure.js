import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new OpenAI({
  base_url: "https://models.inference.ai.azure.com",
  api_key: AI_API_KEY,
});

// azure API 호출
export async function getAzureReview(diff) {
  const prompt = getPrompt(diff);

  const chatResponse = await client.chat.complete({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: "",
      },
      { role: "user", content: prompt },
    ],
  });

  return chatResponse.choices[0].message.content;
}
