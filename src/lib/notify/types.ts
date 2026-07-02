export interface SendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

/** Every notification channel (mock, Twilio, ...) implements this. Message persistence
 * (the Message table) is handled by the caller, not the provider -- a provider's only
 * job is "did this text actually go out."
 */
export interface NotificationProvider {
  send(toPhone: string, body: string): Promise<SendResult>;
}
