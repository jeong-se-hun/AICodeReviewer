// GitHub API 관련 함수 (diff 가져오기, 댓글 작성)
import { GITHUB_TOKEN, GITHUB_PR_NUMBER, GITHUB_REPOSITORY } from "./env.js";

async function fetchGitHubApi(url, options = {}) {
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: options.accept || "application/vnd.github+json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API request failed: ${errorText}`);
  }
  return response;
}

// PR diff 가져오기
export async function getPRDiff() {
  const diffUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}`;
  const response = await fetchGitHubApi(diffUrl, {
    accept: "application/vnd.github.v3.diff",
  });
  return response.text();
}

// GitHub PR에 댓글 작성
export async function postComment(comment) {
  const commentUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`;
  const body = { body: comment };

  const response = await fetchGitHubApi(commentUrl, {
    method: "POST",
    body: JSON.stringify(body),
  });

  console.log("Review comment posted successfully!");
  return response;
}
