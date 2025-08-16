import { EnvSchema } from './schema';

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    'Invalid ENV',
    parsed.error.issues.map((issue) => issue.message).join(', '),
  );
  process.exit(1);
}

export const env = parsed.data;
