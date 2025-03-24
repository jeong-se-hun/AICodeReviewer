import OpenAI from "openai";
import { AI_API_KEY, AI_MODEL } from "../utils/env.js";
import { getPrompt } from "../utils/prompt.js";

const client = new OpenAI({
  apiKey: AI_API_KEY,
});

// openAi API 호출
export async function getOpenAiReview(diff) {
  const prompt = getPrompt(diff);

  const chatResponse = await client.responses.create({
    model: AI_MODEL,
    input: prompt,
  });

  console.log(chatResponse); // TODO: remove this line after testing is done

  return chatResponse.output_text;
}
