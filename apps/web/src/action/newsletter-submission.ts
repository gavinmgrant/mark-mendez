"use server";

export async function newsletterSubmission(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;

  if (!email) {
    console.error("Email is required");
    return;
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    console.error("Flodesk API key is missing");
    return;
  }

  const endpoint = "https://api.flodesk.com/v1/subscribers";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
        "User-Agent": "Mark H Mendez (www.markhmendez.com)",
      },
      body: JSON.stringify({
        email,
        firstName: "", // Optional, modify as needed
        lastName: "", // Optional, modify as needed
        customFields: {}, // Optional, add any custom fields here
      }),
    });

    if (!response.ok) {
      console.error("Flodesk API error:", await response.text());
    }
  } catch (error) {
    console.error("Error submitting to Flodesk:", error);
  }
}
