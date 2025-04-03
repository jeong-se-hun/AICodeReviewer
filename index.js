import { getCommitDetails, getPRDiff, postComment } from "./utils/githubApi.js";
import { AI_MODEL_PROVIDER, GITHUB_EVENT_ACTION } from "./utils/env.js";

import {
  getGeminiReview,
  getMistralReview,
  getAzureReview,
  getOpenAiReview,
  getOpenRouterReview,
} from "./models/index.js";

// 모델 제공처에 따른 리뷰 함수 매핑
const reviewFunctionsMap = {
  gemini: getGeminiReview,
  mistral: getMistralReview,
  azure: getAzureReview,
  openai: getOpenAiReview,
  openRouter: getOpenRouterReview,
};

const reviewFunction = reviewFunctionsMap[AI_MODEL_PROVIDER] || null;

async function runReview() {
  console.log("GITHUB_EVENT_ACTION", GITHUB_EVENT_ACTION);
  try {
    // 리뷰 함수 유효성 체크
    if (!reviewFunction) {
      throw new Error(
        `${AI_MODEL_PROVIDER}는 지원하지 않는 AI_MODEL_PROVIDER입니다.`
      );
    }

    // PR diff, 커밋 정보 가져오기
    const [diff, commitDetails] = await Promise.all([
      getPRDiff(),
      getCommitDetails(),
    ]);

    // 코드 리뷰 생성
    const reviewComment = await reviewFunction({ diff, commitDetails });

    // GitHub PR에 리뷰 댓글 작성
    await postComment(reviewComment);
  } catch (error) {
    console.error("Error during AI review:", error);
  }
}

runReview();
