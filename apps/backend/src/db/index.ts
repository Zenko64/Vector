import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../core/env";

const db = drizzle(new Pool({ connectionString: env.DATABASE_URL }));

export default db;
