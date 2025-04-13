import * as z from "zod";

export const authSchema = z.object({
  username: z.string().min(6).max(15),
  password: z.string().min(8).max(20),
});

export type AuthSchemaType = z.infer<typeof authSchema>;

export const forgotPasswordSchema = z.object({
  username: z.string().min(6).max(15),
  secretWord: z.string().array().length(24),
  newPassword: z.string().min(8).max(20),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  username: z.string().min(6).max(15),
  oldPassword: z.string().min(8).max(20),
  newPassword: z.string().min(8).max(20),
  secretWord: z.string().array().length(24),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const confirmCompletionSchema = z.object({
  userId: z.string(),
});

export type ConfirmCompletionSchema = z.infer<typeof confirmCompletionSchema>;

export const Wallets = z.enum([
  'BTC',
  'ETH',
  'SOL',
  'PALO'
]);

export const selectedWallteSchema = z.object({
  wallets: z.array(Wallets)
})