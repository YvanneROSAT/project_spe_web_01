import z from "zod";

export const accessTokenPayloadSchema = z.object({
  sub: z.cuid2(),
  exp: z.number(),
  jti: z.cuid2(),
});
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

export const refreshTokenPayloadSchema = z.object({
  sub: z.cuid2(),
  exp: z.number(),
});
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
