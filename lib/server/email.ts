import "server-only";

export type EmailDelivery = { configured: boolean; sent: boolean; id?: string; error?: string };

export async function sendEmail(input: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailDelivery> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { configured: false, sent: false, error: "Resend is not configured." };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    return { configured: true, sent: false, error: details.slice(0, 240) || `Resend returned ${response.status}.` };
  }
  const body = await response.json() as { id?: string };
  return { configured: true, sent: true, id: body.id };
}
