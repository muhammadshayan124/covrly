import type { NotificationProvider, SendResult } from "./types";

/** Simulates instant, always-successful delivery. Used until a real Twilio account is
 * connected -- the Message table still records everything, so the manager dashboard and
 * staff portal work exactly as they will with real SMS, just without a phone carrier.
 */
export class MockProvider implements NotificationProvider {
  async send(toPhone: string, body: string): Promise<SendResult> {
    void toPhone;
    void body;
    return { success: true, providerMessageId: `mock_${Date.now()}` };
  }
}
