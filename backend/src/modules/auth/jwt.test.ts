import { describe, expect, it } from "vitest";
import { generateJWToken } from "./jwt";

describe("generateJWToken", () => {
  it("returns the signed the payload", () => {
    process.env.JWT_SECRET = "jwt-secret";

    const res = generateJWToken({
      userId: "userId",
      email: "john.smith@mail.com",
    });

    expect(res).toBeDefined();
  });
});
