import twilioLib from "twilio";
import type { NotificationProvider, SendResult } from "./types";

/** Real SMS via Twilio. Inactive until TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN /
 * TWILIO_PHONE_NUMBER are set -- see getNotificationProvider() in index.ts, which falls
 * back to MockProvider when any of these are missing.
 */
export class TwilioProvider implements NotificationProvider {
  private readonly client: ReturnType<typeof twilioLib>;
  private readonly fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.client = twilioLib(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  async send(toPhone: string, body: string): Promise<SendResult> {
    try {
      const message = await this.client.messages.create({
        to: toPhone,
        from: this.fromNumber,
        body,
      });
      return { success: true, providerMessageId: message.sid };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }
}
