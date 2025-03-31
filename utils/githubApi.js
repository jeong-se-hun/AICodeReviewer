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

  const commits = await response.json();

  // 커밋 정보 확인
  console.log("commits", commits, "@@@@@@@@@@@@@@@@@@@@@@@@@@");

  // 커밋명과 내용 추출
  const commitDetails = commits.map((commit) => ({
    sha: commit.sha, // 커밋 해시
    title: commit.commit.message.split("\n")[0], // 커밋 메시지의 첫 줄 (제목)
    body: commit.commit.message.split("\n").slice(1).join("\n").trim(), // 나머지 (내용)
  }));

  return commitDetails;
}

//  커밋 정보가져오기
export async function getCommits() {
  const commitsUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}/commits`;
  const response = await fetchGitHubApi(commitsUrl);
  console.log("commits", response, "@@@@@@@@@@@@@@@@@@@@@@@@@@");
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
