import { eq } from "drizzle-orm";
import type { Context } from "hono";
import db from "../db";
import * as handlers from "./handlers";

export async function getPosts(c: Context) {
	const { query, author } = c.req.param();

	const authorId = author
		? (
				await db.query.user.findFirst({
					where: (u) => eq(u.username, author),
					columns: { id: true },
				})
			)?.id
		: undefined;

	try {
		handlers.getPosts({
			query,
			authorId,
		});
	} catch (e) {
		console.error("Query Failed: ", e);
	}
}

export async function getPost(c: Context) {}
export async function createPost(c: Context) {}
export async function patchPost(c: Context) {}
export async function deletePost(c: Context) {}
