import { describe, it, expect } from "vitest";
import { loginSchema } from "./login-schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      username: "rebecka",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("trims the username", () => {
    const result = loginSchema.safeParse({
      username: "  rebecka  ",
      password: "secret",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.username).toBe("rebecka");
  });

  it("rejects an empty username", () => {
    const result = loginSchema.safeParse({ username: "", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only username", () => {
    const result = loginSchema.safeParse({
      username: "   ",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ username: "rebecka", password: "" });
    expect(result.success).toBe(false);
  });
});
