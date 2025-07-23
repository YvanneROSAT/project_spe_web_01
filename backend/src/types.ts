import { Request } from "express";

export interface AuthPayload {
  userId: string;
  email: string;
}

export type RequestWithUser = Request & {
  user: AuthPayload;
};
