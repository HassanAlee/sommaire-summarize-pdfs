"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

const schema = z.object({
  file: z
    .instanceof(File, { error: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20mb"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("upload successfully");
    },
    onUploadError: (e) => {
      console.log("an error occured while uploading", e);
      toast("An error uploading the document");
    },
    onUploadBegin: () => {
      console.log("upload begins");
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      toast(
        validatedFields?.error?.flatten().fieldErrors?.file?.[0] ??
          "Invalid file"
      );
      return;
    }
    toast("📃 Uploading PDF");
    const resp = await startUpload([file]);
    if (!resp) {
      toast("Please use a different file");
      return;
    }
    toast("📃 Processing PDF");
    const summary = await generatePdfSummary(resp);
    console.log("this is summary", summary);
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
