import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    ANALYTICS_ID: z.string(),
    ANALYTICS_URL: z.string(),
  },
  runtimeEnv: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    ANALYTICS_ID: process.env.ANALYTICS_ID,
    ANALYTICS_URL: process.env.ANALYTICS_URL,
  },
});
