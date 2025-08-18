import * as z from 'zod';

const Config = z.object({
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

const parsed = Config.safeParse(process.env);
if (!parsed.success) {
  console.error(
    'Invalid environment variables',
    parsed.error.issues.map((issue) => `\n - ${issue.message}`).join(''),
  );
  process.exit(1);
}

export const config = parsed.data;
