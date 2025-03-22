import { GoogleGenAI } from "@google/genai";
import { AI_API_KEY, AI_MODEL } from "../utils/env";

const ai = new GoogleGenAI({
  apiKey: AI_API_KEY,
});

export async function getGeminiReview(diff) {
  const prompt = `당신은 전문적인 코드 리뷰어입니다. 다음 PR diff를 검토하고, 아래 기준에 따라 품질 높은 피드백을 한글로 작성해 주세요:
- 코드의 가독성, 유지보수성, 성능을 평가하세요.
- 잠재적인 버그나 에러를 지적하세요.
- 모범 사례를 따르지 않은 부분이 있다면 지적하고 개선 방안을 제안하세요.
- 코드의 의도와 목적을 이해하고, 더 나은 구현 방법을 제안하세요.
- 불필요하거나 중복된 코드가 있다면 지적하세요.
피드백은 간결하고 명확하게, 전문적인 톤으로 작성하며, 구체적인 문제와 개선 제안을 포함해 주세요. 필요하면 코드 예시를 포함해도 됩니다.:\n${diff}`;

  // Gemini API 호출
  const review = await ai.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
  });

  return review.text;
}
