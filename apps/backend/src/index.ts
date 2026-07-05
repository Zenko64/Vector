import { Elysia } from "elysia";
import { env } from "./core/env";
import postsRouter from "./posts/routes";
import videosRouter from "./videos/routes";

const app = new Elysia()
  .onError(({ error, code }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
    }
  })
  .mount("/api/videos", videosRouter)
  .mount("/api/posts", postsRouter)
  .listen({ hostname: env.HOST, port: env.PORT });

console.log(
  `🦊 Foxfire is running at: ${app.server?.hostname}:${app.server?.port}`,
);
