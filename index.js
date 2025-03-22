import { getPRDiff, postComment } from "./utils/githubApi.js";
import { AI_MODEL_PROVIDER } from "./utils/env.js";

import {
  getGeminiReview,
  getMistralReview,
  getAzureReview,
} from "./models/index.js";

// 모델 제공처에 따른 리뷰 함수 매핑
const reviewFunctionsMap = {
  gemini: getGeminiReview,
  mistral: getMistralReview,
  azure: getAzureReview,
};

const reviewFunction = reviewFunctionsMap[AI_MODEL_PROVIDER] || null;

async function runReview() {
  try {
    // PR diff 가져오기
    const diff = await getPRDiff();

    // 리뷰 함수 유효성 체크
    if (!reviewFunction) {
      throw new Error(
        `${AI_MODEL_PROVIDER}는 지원하지 않는 AI_MODEL_PROVIDER입니다.`
      );
    }

    // 코드 리뷰 생성
    const reviewComment = await reviewFunction(diff);

    // GitHub PR에 리뷰 댓글 작성
    await postComment(reviewComment);
  } catch (error) {
    console.error("Error during AI review:", error);
  }
}

runReview();
