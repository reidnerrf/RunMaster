import { config } from 'dotenv';
import { z } from 'zod';

config();

const EnvSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PORT: z.coerce.number().int().positive().default(4000),
	JWT_SECRET: z.string().min(16),
	MONGODB_URI: z.string().url().optional(),
	ENABLE_DB: z
		.enum(["true", "false"]) // ensure strings "true"/"false" are handled explicitly
		.default("false")
		.transform((v) => v === "true"),
	RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
	RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().int().positive().default(60_000)
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
