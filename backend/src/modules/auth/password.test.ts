import crypto from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { comparePassword, getIsPasswordSafe, hashPassword } from "./password";

// https://stackoverflow.com/a/31417424
const bcryptHashRegex = /^\$2[ayb]\$.{56}$/;

const mGetHIBPMatches = vi.hoisted(() => vi.fn());
vi.mock("./hibp", () => ({
  getHIBPMatches: mGetHIBPMatches,
}));

describe("bcrypt password utils", () => {
  const plain = "SuperSecret123!";
  let hash: string;

  it("returns valid hash", async () => {
    hash = await hashPassword(plain);
    expect(hash).toMatch(bcryptHashRegex);
  });

  it.each([
    {
      password: plain,
      expectedResult: true,
    },
    {
      password: "wrong",
      expectedResult: false,
    },
  ])("returns expectedResult %o", async ({ password, expectedResult }) => {
    const result = await comparePassword(password, hash);
    expect(result).toBe(expectedResult);
  });
});

describe("getIsPasswordSafe", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns true when password suffix is not in HIBP", async () => {
    mGetHIBPMatches.mockResolvedValue(["abc123:5", "fffff:2"]);

    const result = await getIsPasswordSafe("notBreached");
    expect(result).toBe(true);
  });

  it("returns false when password suffix is found in HIBP", async () => {
    const hash = crypto
      .createHash("sha1")
      .update("breached")
      .digest("hex")
      .toLowerCase();
    const suffix = hash.slice(5);

    mGetHIBPMatches.mockResolvedValue([`${suffix}:1000`]);

    const result = await getIsPasswordSafe("breached");
    expect(result).toBe(false);
  });
});
