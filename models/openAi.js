import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new OpenAI({
  apiKey: AI_API_KEY,
});

// openAi API 호출
export async function getOpenAiReview(diff) {
  const prompt = getPrompt(diff);

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
