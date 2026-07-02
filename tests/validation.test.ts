import { describe, expect, it } from "vitest";
import { loginSchema, shiftSchema, signupSchema, staffSchema } from "@/lib/validation";

describe("signupSchema", () => {
  it("accepts valid input", () => {
    const result = signupSchema.safeParse({
      orgName: "Joe's Diner",
      name: "Joe",
      email: "joe@example.com",
      password: "supersecret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({
      orgName: "Joe's Diner",
      name: "Joe",
      email: "joe@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      orgName: "Joe's Diner",
      name: "Joe",
      email: "not-an-email",
      password: "supersecret",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "joe@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("staffSchema", () => {
  it("defaults priority to 0 when omitted", () => {
    const result = staffSchema.parse({ name: "Alex", phone: "+15551234567" });
    expect(result.priority).toBe(0);
  });

  it("rejects a phone number that's too short", () => {
    const result = staffSchema.safeParse({ name: "Alex", phone: "123" });
    expect(result.success).toBe(false);
  });
});

describe("shiftSchema", () => {
  it("accepts a shift without an assigned staff member", () => {
    const result = shiftSchema.safeParse({
      role: "Server",
      startsAt: "2026-01-01T10:00",
      endsAt: "2026-01-01T18:00",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing role", () => {
    const result = shiftSchema.safeParse({
      role: "",
      startsAt: "2026-01-01T10:00",
      endsAt: "2026-01-01T18:00",
    });
    expect(result.success).toBe(false);
  });
});
