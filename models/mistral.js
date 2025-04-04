import { Mistral } from "@mistralai/mistralai";
import { HTTPClient } from "@mistralai/mistralai/lib/http.js";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { ERROR_MESSAGES, TIMEOUT } from "../config/constants.js";

const httpClient = new HTTPClient({
  fetcher: (request) => fetch(request),
});

httpClient.addHook(
  "beforeRequest",
  (request) =>
    new Request(request, {
      signal: AbortSignal.timeout(TIMEOUT),
    })
);

const client = new Mistral({ apiKey: AI_API_KEY, httpClient });

// Mistral API 호출
export async function getMistralReview(reviewData) {
  try {
    const prompt = getPrompt(reviewData);

    const chatResponse = await client.chat.complete({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

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
