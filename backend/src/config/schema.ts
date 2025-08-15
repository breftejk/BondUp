import { z } from 'zod'

/**
 * Environment variables schema using Zod for validation.
 * This schema defines the expected environment variables for the application.
 */
export const EnvSchema = z.object({
    DOPPLER_ENVIRONMENT: z.enum(['dev', 'prd', 'stg']).default('dev'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(32),
    REDIS_URL: z.string().optional(),
    APNS_KEY_ID: z.string().optional(),
    APNS_TEAM_ID: z.string().optional(),
    APNS_PRIVATE_KEY: z.string().optional(),
    FCM_SERVER_KEY: z.string().optional(),
})

export type Env = z.infer<typeof EnvSchema>