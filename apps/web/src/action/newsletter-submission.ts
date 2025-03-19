"use server";

type SubscriberRequest = {
  email: string;
  firstName?: string;
  lastName?: string;
  segment_ids?: string[];
  double_optin?: boolean;
  optin_ip?: string;
  optin_timestamp?: string;
};

export async function newsletterSubmission(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  if (!email) {
    throw new Error("Email is required");
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    throw new Error("Flodesk API key is missing");
  }

  const endpoint = "https://api.flodesk.com/v1/subscribers";

  const subscriberData: SubscriberRequest = {
    email,
    firstName: "", // Optional, modify as needed
    lastName: "", // Optional, modify as needed
    segment_ids: ["leads"],
    double_optin: true, // Change to false if you don't want confirmation emails
    optin_ip: "", // Optionally capture user's IP
    optin_timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
        "User-Agent": "Mark H Mendez Group (www.markhmendez.com)",
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Flodesk API error:", errorResponse);
      throw new Error(`Flodesk API error: ${JSON.stringify(errorResponse)}`);
    }
  } catch (error) {
    console.error("Error submitting to Flodesk:", error);
    throw error;
  }
}
