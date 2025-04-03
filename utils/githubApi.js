// GitHub API 관련 함수 (diff 가져오기, 댓글 작성)
import {
  GITHUB_TOKEN,
  GITHUB_PR_NUMBER,
  GITHUB_REPOSITORY,
  GITHUB_EVENT_ACTION,
  COMMIT_BEFORE,
  COMMIT_AFTER,
} from "./env.js";

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
  if (GITHUB_EVENT_ACTION === "opened") {
    // PR이 열렸을 때의 diff 가져오기
    const diffUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}`;
    const response = await fetchGitHubApi(diffUrl, {
      accept: "application/vnd.github.v4.diff",
    });
    return response.text();
  }

  if (GITHUB_EVENT_ACTION === "synchronize" && COMMIT_BEFORE && COMMIT_AFTER) {
    // 커밋이 추가되었을 때 이전과 이후 변경점 비교
    const beforeCommitUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits/${COMMIT_BEFORE}`;
    const afterCommitUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits/${COMMIT_AFTER}`;

    const [beforeResponse, afterResponse] = await Promise.all([
      fetchGitHubApi(beforeCommitUrl, {
        accept: "application/vnd.github.v4.diff",
      }),
      fetchGitHubApi(afterCommitUrl, {
        accept: "application/vnd.github.v4.diff",
      }),
    ]);

    const [beforeDiff, afterDiff] = await Promise.all([
      beforeResponse.text(),
      afterResponse.text(),
    ]);

    return `Previous Commit Changes:\n\n${beforeDiff}\n\nLatest Commit Changes:\n\n${afterDiff}`;
  }

  throw new Error("Unsupported GitHub event action");
}

//  커밋 정보가져오기
export async function getCommitDetails() {
  const commitsUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}/commits`;
  const response = await fetchGitHubApi(commitsUrl);

  // JSON으로 파싱
  const commits = await response.json();

  // 커밋명과 내용 추출
  const commitDetails = commits.map((commit) => ({
    title: commit.commit.message.split("\n")[0], // 커밋 메시지의 첫 줄 (제목)
    body: commit.commit.message.split("\n").slice(1).join("\n").trim(), // 나머지 (내용)
  }));

  if (GITHUB_EVENT_ACTION === "opened") {
    return commitDetails; // 모든 커밋 반환
  } else if (GITHUB_EVENT_ACTION === "synchronize") {
    return [commitDetails[commitDetails.length - 1]]; // 최신 커밋만 반환
  }

  throw new Error("Unsupported GitHub event action");
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
