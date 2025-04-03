import { getGeminiReview } from "../models/gemini.js";
import { getMistralReview } from "../models/mistral.js";
import { getAzureReview } from "../models/azure.js";
import { getOpenAiReview } from "../models/openAi.js";
import { getOpenRouterReview } from "../models/openRouter.js";
import { AI_MODEL_PROVIDER } from "../utils/env.js";

const reviewFunctionsMap = {
  gemini: getGeminiReview,
  mistral: getMistralReview,
  azure: getAzureReview,
  openai: getOpenAiReview,
  openRouter: getOpenRouterReview,
};

export function getReviewFunction() {
  const reviewFunction = reviewFunctionsMap[AI_MODEL_PROVIDER];
  if (!reviewFunction) {
    throw new Error(
      `${AI_MODEL_PROVIDER}는 지원하지 않는 AI_MODEL_PROVIDER입니다.`
    );
  }
  return reviewFunction;
}
