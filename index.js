import { getPRDiff, postComment } from "./utils/githubApi.js";
import { getGeminiReview } from "./models/gemini.js";

async function runReview() {
  try {
    // PR diff 가져오기
    const diff = await getPRDiff();

    // 코드 리뷰 생성
    const reviewComment = await getGeminiReview(diff);

    // GitHub PR에 리뷰 댓글 작성
    await postComment(reviewComment);
  } catch (error) {
    console.error("Error during AI review:", error);
  }
}

runReview();
