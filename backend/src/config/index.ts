import * as z from 'zod';

const Config = z.object({
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  APPLE_SIWA_CLIENT_ID: z.string().min(1, 'APPLE_SIWA_CLIENT_ID is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
});

const parsed = Config.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => ` - ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${details}`);
}

export const config = parsed.data;
