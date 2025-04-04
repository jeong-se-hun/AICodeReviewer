// GitHub API 관련 함수 (diff 가져오기, 댓글 작성)
import {
  GITHUB_TOKEN,
  GITHUB_PR_NUMBER,
  GITHUB_REPOSITORY,
  GITHUB_EVENT_ACTION,
  COMMIT_BEFORE,
  COMMIT_AFTER,
} from "../config/env.js";

async function fetchGitHubApi(url, options = {}) {
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: options.accept || "application/vnd.github+json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GitHub API request failed (${response.status}): ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? response.json()
      : response.text();
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    throw error;
  }
}

// PR diff 가져오기

async function fetchDiff(path) {
  return fetchGitHubApi(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/${path}`,
    {
      accept: "application/vnd.github.v4.diff",
    }
  );
}

export async function getPRDiff() {
  if (GITHUB_EVENT_ACTION === "opened") {
    return fetchDiff(`pulls/${GITHUB_PR_NUMBER}`);
  }

  if (GITHUB_EVENT_ACTION === "synchronize") {
    if (!COMMIT_BEFORE || !COMMIT_AFTER) {
      throw new Error("Missing commit references for comparison.");
    }

    const [beforeDiff, afterDiff] = await Promise.all([
      fetchDiff(`commits/${COMMIT_BEFORE}`),
      fetchDiff(`commits/${COMMIT_AFTER}`),
    ]);

    return `Previous Commit Changes:\n\n${beforeDiff}\n\nLatest Commit Changes:\n\n${afterDiff}`;
  }

  throw new Error("Unsupported GitHub event action");
}

//  커밋 정보가져오기
export async function getCommitDetails() {
  const commitsUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${GITHUB_PR_NUMBER}/commits`;
  const commits = await fetchGitHubApi(commitsUrl);

  if (!Array.isArray(commits) || commits.length === 0) {
    return [];
  }

  // 커밋명과 내용 추출
  const commitDetails = commits.map(({ commit }) => {
    const [title, ...body] = commit.message.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });

  if (GITHUB_EVENT_ACTION === "opened") {
    return commitDetails; // 모든 커밋 반환
  } else if (GITHUB_EVENT_ACTION === "synchronize") {
    return [commitDetails.at(-1)]; // 최신 커밋만 반환
  }

  throw new Error("Unsupported GitHub event action");
}

// GitHub PR에 댓글 작성
export async function postComment(comment) {
  const commentUrl = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`;

  const response = await fetchGitHubApi(commentUrl, {
    method: "POST",
    body: JSON.stringify({ body: comment }),
  });

  console.log("✅ Review comment posted successfully!");
  return response;
}
