"use client";

// import { Button } from "@workspace/ui/components/button";
// import { Input } from "@workspace/ui/components/input";
// import { Textarea } from "@workspace/ui/components/textarea";
// import { useState } from "react";
import { RichText } from "../richtext";

import type { PagebuilderType } from "@/types";

import { BookAMeetingButton } from "../book-a-meeting-button";

type ContactFormProps = PagebuilderType<"contactForm">;

// interface FormData {
//   honeypot: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   message: string;
// }
// interface Status {
//   success: boolean | null;
//   message: string;
// }

export function ContactForm({ title, content }: ContactFormProps) {
  // const [formData, setFormData] = useState<FormData>({
  //   honeypot: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   message: "",
  // });
  // const [status, setStatus] = useState<Status>({ success: null, message: "" });
  // const [isLoading, setIsLoading] = useState(false);

  // type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

  // const handleChange = (e: ChangeEvent) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // interface SubmitEvent {
  //   preventDefault: () => void;
  // }

  // interface FetchResponse {
  //   ok: boolean;
  //   json: () => Promise<{ message?: string }>;
  // }

  // const handleSubmit = async (e: SubmitEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setStatus({ success: null, message: "" });

  //   const requiredFields: (keyof FormData)[] = [
  //     "firstName",
  //     "lastName",
  //     "email",
  //     "message",
  //   ];
  //   const isFormValid = requiredFields.every((field) => formData[field].trim());
  //   if (!isFormValid) {
  //     setStatus({
  //       success: false,
  //       message: "Please fill in all of the fields above.",
  //     });
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const response: FetchResponse = await fetch("/api/resend", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.ok) {
  //       setFormData({
  //         honeypot: "",
  //         firstName: "",
  //         lastName: "",
  //         email: "",
  //         message: "",
  //       });
  //       setStatus({
  //         success: true,
  //         message:
  //           "Thank you, your message has been sent! I will get back to you as soon as possible.",
  //       });
  //     } else {
  //       const errorData = await response.json();
  //       setStatus({
  //         success: false,
  //         message: errorData.message || "Failed to send your message.",
  //       });
  //     }
  //   } catch {
  //     setStatus({ success: false, message: "An unexpected error occurred." });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const inputClasses =
    "focus-visible:ring-0 outline-none w-full dark:text-zinc-50 dark:placeholder:text-zinc-500 bg-background items-center border p-6 w-full justify-between";

  return (
    <div className="relative w-full flex items-center justify-center container mx-auto px-4 md:px-6">
      <section
        id="contact-form"
        className="relative container w-full spx-4 md:px-8 py-8 sm:py-16 md:py-20 lg:py-24 bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden"
      >
        <div className="container px-4 flex items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center gap-5 w-full text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-neutral-300 sm:text-3xl md:text-5xl text-balance">
              {title}
            </h2>
            <BookAMeetingButton />
            <RichText richText={content} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactForm;
