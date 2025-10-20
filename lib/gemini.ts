import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    // const prompt = {
    //   contents: [
    //     {
    //       role: "user",
    //       parts: [
    //         { text: SUMMARY_SYSTEM_PROMPT },
    //         {
    //           text: `Transform this document into an angaging, easy-to-read summary with contextually relevant emojisand proper markdown formatting:\n\n${pdfText}`,
    //         },
    //       ],
    //     },
    //   ],
    // };
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        systemInstruction: `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an angaging, easy-to-read summary with contextually relevant emojisand proper markdown formatting`,
      },
      contents: pdfText,
    });
    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }
    return response.text;
  } catch (error: any) {
    console.log("Gemini API error", error);
    throw error;
  }
};
