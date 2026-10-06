import z from "zod";

export const createUserBodySchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export const loginUserBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});
