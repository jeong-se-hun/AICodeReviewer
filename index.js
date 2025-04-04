import { getCommitDetails, getPRDiff, postComment } from "./utils/githubApi.js";
import { getReviewFunction } from "./models/reviewFunctions.js";

async function runReview() {
  try {
    const reviewFunction = getReviewFunction();

    const [diff, commitDetails] = await Promise.all([
      getPRDiff(),
      getCommitDetails(),
    ]);

    const reviewComment = await reviewFunction({ diff, commitDetails });

    await postComment(reviewComment);

    process.exit(0); // 정상적으로 완료되면 프로세스 종료
  } catch (error) {
    console.error("Review failed:", error.message || error);
    process.exit(1); // 오류 발생 시 비정상 종료 코드로 프로세스 종료
  }
}

runReview();
