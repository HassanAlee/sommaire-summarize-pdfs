"use server";

import fs from "fs/promises";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileUrl: string) {
  console.log("Downloading PDF from:", fileUrl);

  // 1. Fetch the file
  const response = await fetch(fileUrl);
  if (!response.ok)
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);

  // 2. Convert to buffer
  const buffer = Buffer.from(await response.arrayBuffer());

  // 3. Save temporarily to /tmp
  const tempPath = path.join("/tmp", `temp-${Date.now()}.pdf`);
  await fs.writeFile(tempPath, buffer);

  // 4. Load PDF content using PDFLoader
  const loader = new PDFLoader(tempPath);
  const docs = await loader.load();

  // 5. Clean up the file
  await fs.unlink(tempPath);

  // 6. Combine pages into one string
  const text = docs.map((doc) => doc.pageContent).join("\n");

  console.log("Extracted text length:", text.length);
  return text;
}
