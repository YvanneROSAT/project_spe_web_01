import { describe, expect, it } from "vitest";
import { generateAccessToken } from "./jwt";

describe("generateJWToken", () => {
  it("returns the signed the payload", () => {
    process.env.ACCESS_TOKEN_SECRET = "jwt-secret";

    const res = generateAccessToken({
      userId: "userId",
      email: "john.smith@mail.com",
    });

    expect(res).toBeDefined();
  });
});
