import { db } from "@/db/connection";
import { sessionsTable, usersTable } from "@/db/schema";
import { User } from "@/db/types";
import { eq } from "drizzle-orm";
import { hashToken } from "./jwt";

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

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

export async function getSession(sessionId: string) {
  const res = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.sessionId, sessionId));

  return res.length === 1 ? res[0] : null;
}

export async function createSession(
  userId: string,
  refreshToken: string,
  userAgent: string,
  ipAddress: string
): Promise<string> {
  const res = await db
    .insert(sessionsTable)
    .values({
      userId,
      userAgent,
      ipAddress,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    .$returningId();

  return res[0].sessionId;
}
