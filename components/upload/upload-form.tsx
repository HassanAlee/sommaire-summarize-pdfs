"use client";
import React, { useRef, useState } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    try {
      const resp = await startUpload([file]);
      if (!resp) {
        toast("Please use a different file");
        return;
      }
      toast("📃 Processing PDF");
      const summary = await generatePdfSummary(resp);
      const { data = null, message = null } = summary || {};
      if (data) {
        toast("📃 Saving PDF");
        formRef.current?.reset();
      }
    } catch (error) {
      console.log("Error", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        ref={formRef}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
