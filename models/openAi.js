import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../config/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new OpenAI({
  apiKey: AI_API_KEY,
});

// openAI API 호출
export async function getOpenAiReview(reviewData) {
  try {
    const prompt = getPrompt(reviewData);

    const chatResponse = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "",
        },
        { role: "user", content: prompt },
      ],
      model: AI_MODEL,
    });

    if (
      !chatResponse ||
      !chatResponse.choices ||
      chatResponse.choices.length === 0 ||
      !chatResponse.choices[0].message?.content
    ) {
      throw new Error("⚠️ AI response is empty: Please check the API response");
    }

    return chatResponse.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI review generation failed: ${error.message}`);
  }
}
