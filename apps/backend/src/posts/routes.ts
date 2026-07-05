import Elysia from "elysia";

const postsRouter = new Elysia()
  .get("/", () => {})
  .post("/", () => {})
  .get("/:nanoid", () => {})
  .patch("/:nanoid", () => {})
  .delete("/:nanoid", () => {});

export default postsRouter;
