import z from "zod";

const isPostgresUrl = (val: string) => {
  try {
    const url = new URL(val);
    if (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      Boolean(url.hostname) &&
      url.pathname.length > 1
    )
      return true;
  } catch {
    return false;
  }
};

export const validationSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().refine(isPostgresUrl),
  REFRESH_SECRET: z.string().max(32),
  ACCESS_SECRET: z.string().max(32),
  REFRESH_TOKEN_EXPIRATION_TIME: z.coerce.number(),
  ACCESS_TOKEN_EXPIRATION_TIME: z.coerce.number(),
  AUTH_ISSUER: z.string(),
  AUTH_AUDIENCE: z.string(),
});

export type Environments = z.infer<typeof validationSchema>;
