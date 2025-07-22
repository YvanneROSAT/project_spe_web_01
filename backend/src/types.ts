import { Request } from "express";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export type RequestWithUser = Request & {
  user: AuthPayload;
};
