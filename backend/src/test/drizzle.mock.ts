import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

import { db } from "@/db/connection";
import { beforeEach, vi } from "vitest";

const drizzleMock: DeepMockProxy<typeof db> = mockDeep();

vi.mock("@/db/connection", async (importOriginal) => ({
  __esModule: true,
  ...(await importOriginal()),
  default: drizzleMock,
}));

beforeEach(() => {
  mockReset(drizzleMock);
});

export default drizzleMock;
