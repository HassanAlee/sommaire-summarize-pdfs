"use server";

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
      summary = getSummaryFromOpenAi(pdfText);
      console.log("this is openai magic", summary);
    } catch (error) {
      console.log(error);
      // call gemini
    }
    if (!summary) {
      return { success: false, data: null, message: "File upload failed" };
    }
  } catch {
    return { success: false, data: null, message: "File upload failed" };
  }
}
