"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);

    if (!validatedFields.success) {
      console.log(
        validatedFields?.error?.flatten().fieldErrors?.file?.[0] ??
          "Invalid file"
      );
      return;
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
