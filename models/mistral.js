import { Mistral } from "@mistralai/mistralai";
import { HTTPClient } from "@mistralai/mistralai/lib/http.js";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";
import { ERROR_MESSAGES, TIMEOUT } from "../config/constants.js";

// HTTPClient 인스턴스 생성
const httpClient = new HTTPClient({
  fetcher: (request) => fetch(request),
});

// 요청 전에 실행되는 Hook (타임아웃 설정 및 헤더 추가)
httpClient.addHook(
  "beforeRequest",
  (request) =>
    new Request(request, {
      signal: AbortSignal.timeout(100),
    })
);

const client = new Mistral({ apiKey: AI_API_KEY, httpClient });

// Mistral API 호출
export async function getMistralReview(reviewData) {
  try {
    console.log("mistral api 호출"); // TODO 삭제 예정
    const prompt = getPrompt(reviewData);

    const chatResponse = await client.chat.complete(
      {
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        timeout: 1,
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
