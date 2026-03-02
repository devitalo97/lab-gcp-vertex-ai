import { z } from 'zod';

process.loadEnvFile();

const envSchema = z.object({
  GOOGLE_CLOUD_PROJECT: z.string().min(1),
  GOOGLE_CLOUD_LOCATION: z.string().min(1),
  GOOGLE_GENAI_USE_VERTEXAI: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
