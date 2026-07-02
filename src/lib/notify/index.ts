import { MockProvider } from "./mock";
import { TwilioProvider } from "./twilio";
import type { NotificationProvider } from "./types";

export * from "./types";

/** Twilio is used automatically once all three env vars are set -- otherwise every
 * "text" is simulated via MockProvider and logged to the Message table like normal.
 */
export function getNotificationProvider(): NotificationProvider {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromNumber) {
    return new TwilioProvider(accountSid, authToken, fromNumber);
  }
  return new MockProvider();
}
