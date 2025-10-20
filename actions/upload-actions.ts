"use server";

import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { getSummaryFromOpenAi } from "@/lib/openai";

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return { success: false, data: null, message: "File upload failed" };
  }
  const {
    serverData: {
      file: { url: pdfUrl, name: fileName },
      userId,
    },
  } = uploadResponse[0];
  if (!pdfUrl) {
    return { success: false, data: null, message: "File upload failed" };
  }
  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (error) {
      try {
        // summary = await getSummaryFromOpenAi(pdfText);
        console.log("Look for some other model");
      } catch (error) {
        console.log("Gemini failed after open Ai", error);
        throw new Error(
          "Failed to generate summary with available AI providers"
        );
      }
    }
    if (!summary) {
      return { success: false, data: null, message: "File upload failed" };
    }
    if (summary) {
      return {
        success: true,
        data: { summary },
        message: "Summary generated successfully",
      };
    }
  } catch {
    return { success: false, data: null, message: "File upload failed" };
  }
}
