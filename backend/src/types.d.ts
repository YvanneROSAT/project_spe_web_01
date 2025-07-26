declare global {
  namespace Express {
    interface Request {
      user: Readonly<{
        userId: string;
      }> | null;
    }

    interface Locals {
      nonce?: string;
    }
  }
}
