import { defineConfig } from "drizzle-kit";
import { env } from "./src/core/env";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  schema: ["./src/lib/auth-schema.ts", "./src/db/schema.ts"],
});
