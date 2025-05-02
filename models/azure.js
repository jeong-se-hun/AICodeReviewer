import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { ERROR_MESSAGES, TIMEOUT } from "../config/constants.js";

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: AI_API_KEY,
});

// azure API 호출
export async function getAzureReview(reviewData) {
  console.log("azure API 호출");
  console.log(AI_MODEL, "ai model");
  try {
    const prompt = getPrompt(reviewData);

    const chatResponse = await client.chat.completions.create(
      {
        messages: [{ role: "user", content: prompt }],
        model: AI_MODEL,
      },
      {
        timeout: TIMEOUT,
      }
    );
    console.log(chatResponse, "chat response");
    console.log(chatResponse.choices, "chat response");
    console.log(chatResponse.choices[0].message?.content, "chat response");

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
