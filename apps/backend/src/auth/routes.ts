import { Hono } from "hono";
import type { AuthType } from "../lib/auth";
import { auth } from "../lib/auth";

const authRouter = new Hono<{ Bindings: AuthType }>({
	strict: false,
});

authRouter.on(["POST", "GET"], "/*", (c) => {
	return auth.handler(c.req.raw);
});

export default authRouter;
