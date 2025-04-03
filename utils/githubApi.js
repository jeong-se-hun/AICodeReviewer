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
  let response;

  if (GITHUB_EVENT_ACTION === "opened") {
    // PR이 열렸을 때의 diff 가져오기
    console.log("PR이 열렸을 때의 diff 가져오기 @@@@@@@@@@@@"); // TODO 테스트 후 삭제 예정
    const diffUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}`;
    response = await fetchGitHubApi(diffUrl, {
      accept: "application/vnd.github.v4.diff",
    });
  } else if (
    GITHUB_EVENT_ACTION === "synchronize" &&
    COMMIT_BEFORE &&
    COMMIT_AFTER
  ) {
    // PR이 업데이트 됐을 때의 diff 가져오기
    console.log("PR이 업데이트 됐을 때의 diff 가져오기"); // TODO 테스트 후 삭제 예정
    // const diffUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits/${COMMIT_AFTER}`;
    const diffUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits`;
    response = await fetchGitHubApi(diffUrl, {
      accept: "application/vnd.github.v4.diff",
    });
  } else {
    throw new Error("Unsupported GitHub event action");
  }

  return response.text();
}

//  커밋 정보가져오기
export async function getCommitDetails() {
  console.log("커밋 정보가져오기"); // TODO 테스트 후 삭제 예정
  const commitsUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}/commits`;
  const response = await fetchGitHubApi(commitsUrl);

  // JSON으로 파싱
  const commits = await response.json();

  // 커밋명과 내용 추출
  const commitDetails = commits.map((commit) => ({
    title: commit.commit.message.split("\n")[0], // 커밋 메시지의 첫 줄 (제목)
    body: commit.commit.message.split("\n").slice(1).join("\n").trim(), // 나머지 (내용)
  }));
  console.log("커밋 정보가져오기 commitDetails", commitDetails, "@@@@@@@@@@@@"); // TODO 테스트 후 삭제 예정
  return commitDetails;
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

export async function getCommitDiff(commitSha) {
  const commitUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits/${commitSha}`;
  const response = await fetchGitHubApi(commitUrl, {
    accept: "application/vnd.github.v3.diff",
  });

  return response.text();
}
