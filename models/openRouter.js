import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { ERROR_MESSAGES, TIMEOUT } from "../config/constants.js";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: AI_API_KEY,
});

// openRouter API 호출
export async function getOpenRouterReview(reviewData) {
  try {
    const prompt = getPrompt(reviewData);

    const chatResponse = await client.chat.completions.create(
      {
        messages: [{ role: "user", content: prompt }],
        model: AI_MODEL,
      },
      {
        timeout: 1, // 테스트 용
        // timeout: TIMEOUT,
      }
    );

    if (
      !chatResponse ||
      !chatResponse.choices ||
      chatResponse.choices.length === 0 ||
      !chatResponse.choices[0].message?.content
    ) {
      throw new Error(ERROR_MESSAGES.AI_EMPTY_RESPONSE);
    }

    return chatResponse.choices[0].message.content;
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.AI_REVIEW_FAILED}: ${error.message}`);
  }
}
