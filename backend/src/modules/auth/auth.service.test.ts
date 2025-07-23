import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { createUser, getUserByEmail } from "./auth.service";

describe("auth.service", () => {
  beforeEach(async () => {
    await db.delete(usersTable);
  });

  it("getUserByEmail returns null if not found", async () => {
    const user = await getUserByEmail("notfound@example.com");
    expect(user).toBeNull();
  });

  it("createUser inserts a user", async () => {
    const success = await createUser("john@mail.com", "hashedpass", {
      firstName: "John",
      lastName: "Doe",
    });
    expect(success).toBe(true);

    const found = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, "john@mail.com"),
    });
    expect(found).toBeDefined();
    expect(found?.firstName).toBe("John");
  });

  it("getUserByEmail returns existing user", async () => {
    await createUser("jane@mail.com", "somehash", {
      firstName: "Jane",
      lastName: "Doe",
    });

    const user = await getUserByEmail("jane@mail.com");
    expect(user?.firstName).toBe("Jane");
  });
});
