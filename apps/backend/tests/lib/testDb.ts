import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

const db = drizzle({ client: new PGlite() });

export default db;
