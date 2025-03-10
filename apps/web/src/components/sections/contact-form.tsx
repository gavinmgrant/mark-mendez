"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";

import type { PagebuilderType } from "@/types";

type ContactFormProps = PagebuilderType<"contactForm">;

interface FormData {
  honeypot: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}
interface Status {
  success: boolean | null;
  message: string;
}

export function ContactForm({ title }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    honeypot: "",
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>({ success: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  interface SubmitEvent {
    preventDefault: () => void;
  }

  interface FetchResponse {
    ok: boolean;
    json: () => Promise<{ message?: string }>;
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ success: null, message: "" });

    const requiredFields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "email",
      "message",
    ];
    const isFormValid = requiredFields.every((field) => formData[field].trim());
    if (!isFormValid) {
      setStatus({
        success: false,
        message: "Please fill in all of the fields above.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response: FetchResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          honeypot: "",
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        setStatus({
          success: true,
          message:
            "Thank you, your message has been sent! I will get back to you as soon as possible.",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          success: false,
          message: errorData.message || "Failed to send your message.",
        });
      }
    } catch {
      setStatus({ success: false, message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "rounded-e-none border-e-0 focus-visible:ring-0 outline-none w-full dark:text-zinc-50 dark:placeholder:text-zinc-500 bg-background items-center border rounded-xl p-6 drop-shadow-lg w-full justify-between";

  return (
    <div className="relative w-full flex items-center justify-center">
      <section
        id="contact-form"
        className="relative container w-full spx-4 md:px-8 py-8 sm:py-16 md:py-20 lg:py-24 bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden mx-4"
      >
        <div className="container px-4 flex items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-neutral-300 sm:text-3xl md:text-5xl text-balance">
              {title}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full max-w-3xl"
            >
              <Input
                className="hidden"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  className={inputClasses}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  className={inputClasses}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <Input
                className={inputClasses}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                className={inputClasses}
                type="text"
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
              />
              <div className="flex items-center justify-center w-full mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
              {status.message && (
                <p
                  className={`text-center text-sm ${
                    status.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactForm;
