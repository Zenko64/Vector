import { Hono } from "hono";
import authRouter from "./auth/routes";
import { env } from "./core/env";
import postsRouter from "./posts/routes";

const app = new Hono()
	.route("/api/auth", authRouter)
	.route("/api/posts", postsRouter);

export type AppType = typeof app;
export default { fetch: app.fetch, port: env.PORT, hostname: env.HOST };
