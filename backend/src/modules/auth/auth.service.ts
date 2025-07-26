import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { User } from "@/db/types";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return res.length === 1 ? res[0] : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.userId, userId));

  return res.length === 1 ? res[0] : null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  metadata: Pick<User, "firstName" | "lastName">
): Promise<boolean> {
  const res = await db.insert(usersTable).values({
    ...metadata,
    email,
    passwordHash,
  });

  return res[0].affectedRows > 0;
}
