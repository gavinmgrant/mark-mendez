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

export async function newsletterSubmission(
  formData: FormData,
): Promise<{ success: boolean; message?: string }> {
  const email = formData.get("email") as string;
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    return { success: false, message: "Flodesk API key is missing" };
  }

  const endpoint = "https://api.flodesk.com/v1/subscribers";

  const subscriberData: SubscriberRequest = {
    email,
    firstName: "", // Optional, modify as needed
    lastName: "", // Optional, modify as needed
    segment_ids: [], // Optional, modify as needed
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
      return {
        success: false,
        message: "Failed to subscribe. Please try again.",
      };
    }

    return {
      success: true,
      message: "Subscription successful! Check your email.",
    };
  } catch (error) {
    console.error("Error submitting to Flodesk:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
