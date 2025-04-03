import { REVIEW_FEEDBACK_LANGUAGE } from "./env.js";

const DEFAULT_PROMPT = `
You are an expert code reviewer. Review PR diff and provide concise feedback on key issues in ${
  REVIEW_FEEDBACK_LANGUAGE || "Korean"
} only. Use below criteria.

**Priority:** Focus on logic changes, new features, or performance. Ignore minor issues (typos, style).

**Criteria:**
* **Code Quality:** Enhance readability (naming, structure), performance (efficiency), stability (error handling), security (data protection).
* **Best Practices:** Recommend better approaches (patterns, efficiency, API design); warn against suboptimal choices and suggest fixes.

**Style:** Clear, professional, constructive. Each feedback item must be 300 characters or less. Do not include character count in the output. No "Maybe" or opinions. Provide actionable suggestions.

**No Feedback Case:** If no significant issues are found, provide this in ${
  REVIEW_FEEDBACK_LANGUAGE || "Korean"
}: "✅ Code Review Passed: Changes reviewed."

**Instructions:** Use ${
  REVIEW_FEEDBACK_LANGUAGE || "Korean"
} only. Review diff and commits together (e.g., detect intent like 'fix' or 'feature'). If commits are vague, prioritize diff.
`;

function formatCommitDetails(commitDetails) {
  if (!Array.isArray(commitDetails) || commitDetails.length === 0) {
    return "";
  }

  return commitDetails
    .map((c) => `title: ${c.title}${c.body ? `\ncontent: ${c.body}` : ""}`)
    .join("\n---\n");
}

export function getPrompt({ diff, commitDetails }) {
  if (!diff || typeof diff !== "string" || diff.trim().length === 0) {
    throw new Error("Please provide a valid PR diff.");
  }

  const commitSection = formatCommitDetails(commitDetails);
  let prompt = `${DEFAULT_PROMPT}\n\n### PR Diff\n\`\`\`\n${diff}\n\`\`\``;

  if (commitSection) {
    prompt += `\n\n### commit info\n\`\`\`\n${commitSection}\n\`\`\``;
  }

  return prompt;
}
