"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";

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
    console.log(pdfText);
  } catch {
    return { success: false, data: null, message: "File upload failed" };
  }
}
