import { getCommitDetails, getPRDiff, postComment } from "./utils/githubApi.js";
import { getReviewFunction } from "./models/reviewFunctions.js";

async function runReview() {
  try {
    const reviewFunction = getReviewFunction();

    const [diff, commitDetails] = await Promise.all([
      getPRDiff(),
      getCommitDetails(),
    ]);
    console.log(`🔵 diff: ${diff}`);
    console.log(`🔵 commitDetails: ${commitDetails}`);
    const reviewComment = await reviewFunction({ diff, commitDetails });
    console.log(`🔵 reviewComment: ${reviewComment}`);

    await postComment(reviewComment);
  } catch (error) {
    console.error("Review failed:", error.message || error);
    throw error;
  }
}

runReview();
