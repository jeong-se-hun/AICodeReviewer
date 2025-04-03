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
  } catch (error) {
    throw error(error);
  }
}

runReview();
