const DEFAULT_PROMPT = `당신은 전문 코드 리뷰어입니다. 다음 PR diff를 검토하고, 아래 기준에 따라 한글로 품질 높은 피드백을 작성하세요:
- 코드의 가독성, 유지보수성, 성능을 평가하고 개선점을 제안하세요.
- 잠재적 버그나 에러를 식별하고 구체적인 문제를 지적하세요.
- 모범 사례를 따르지 않은 부분을 발견하면 대안을 제시하세요.
- 코드의 의도를 파악하고, 더 효율적인 구현 방법을 추천하세요.
- 중복되거나 불필요한 코드를 찾아 제거 또는 간소화를 제안하세요.
피드백은 간결하고 명확하며 전문적인 톤으로, 구체적인 문제와 실행 가능한 개선안을 포함하세요. 필요 시 코드 예시를 추가해도 됩니다.`;

export function getPrompt(diff) {
  if (!diff || typeof diff !== "string") {
    throw new Error("유효한 PR diff를 제공해주세요.");
  }

  const prompt = `${DEFAULT_PROMPT}\n\n### PR Diff\n\`\`\`\n${diff}\n\`\`\``;
  return prompt;
}
