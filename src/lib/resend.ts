import { Resend } from "resend";

// Deferred: not called from any page or component yet. Campaign/email UI in
// this phase renders entirely from `src/lib/mock/campaigns.ts`.

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set — see .env.example");
  }
  return new Resend(apiKey);
}
