import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHIBPMatches } from "./hibp";

describe("getHIBPMatches", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns suffix list when fetch succeeds with 200 OK", async () => {
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue("ABCDEF1234567890:2\nFAFAFA1111111111:5"),
    };

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(mockResponse as unknown as Response);

    const prefix = "5BAA6";
    const result = await getHIBPMatches(prefix);

    expect(fetch).toHaveBeenCalledWith(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    expect(result).toEqual(["ABCDEF1234567890:2", "FAFAFA1111111111:5"]);
  });

  it("returns empty array if fetch response is not OK", async () => {
    const mockResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue("Some error text"),
    };

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(mockResponse as unknown as Response);

    const result = await getHIBPMatches("ABCDE");

    expect(result).toEqual([]);
  });

  it("returns empty array if fetch throws an error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await getHIBPMatches("ERROR");

    expect(result).toEqual([]);
  });
});
