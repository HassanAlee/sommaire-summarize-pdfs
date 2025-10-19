import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSummaryFromOpenAi(pdfText: string) {
  try {
    const response = await client.responses.create({
      model: "gpt-5-nano",
      // `input` accepts a string or an array of messages (object form shown here)
      input: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Transform this document into an angaging, easy-to-read summary with contextually relevant emojisand proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      store: false,
    });
    return response.output_text;
  } catch (error: any) {
    if (error.status == 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
