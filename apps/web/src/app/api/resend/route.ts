import { EmailTemplateContact } from "../../../components/email-template-contact";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const domain = "markhmendez.com";

export async function POST(req: any, res: any) {
  if (req.body.honeypot) {
    return res.status(400).json({ message: "Spam detected." });
  }

  if (!req.headers.referer || !req.headers.referer.includes(domain)) {
    return res.status(400).json({ message: "Invalid referer." });
  }

  const { firstName, lastName, email, message } = req.body;

  const { data, error } = await resend.emails.send({
    from: "Mark Mendez <mark.mendez@compass.com>",
    to: ["mark.mendez@compass.com"],
    subject: "New Lead from Website",
    react: EmailTemplateContact({ firstName, lastName, email, message }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
}
