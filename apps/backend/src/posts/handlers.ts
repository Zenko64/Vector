import { and, eq, ilike, or } from "drizzle-orm";
import db from "../db";
import { postsTable } from "../db/schema";

/**
 * @name getPosts
 * @description Queries The Posts Table.
 * @param { query, authorId } - Filters.
 * @param userId - Logged In UserID, to return private user data.
 * @returns
 */
export async function getPosts(
	{ query, authorId }: { query?: string; authorId?: string },
	userId?: string,
) {
	return db.query.postsTable.findMany({
		where: (r) => {
			const conditions = [
				or(
					eq(r.privacy, "public"),
					userId ? eq(r.authorId, userId) : undefined,
				),
			];

			if (query) conditions.push(ilike(r.text, `%${query}%`));
			if (authorId) conditions.push(eq(r.authorId, authorId));

			return and(...conditions);
		},
		columns: {
			createdAt: true,
			nanoid: true,
			pinned: true,
			privacy: true,
			text: true,
		},
		with: {
			author: {
				columns: {
					image: true,
					name: true,
				},
			},
		},
	});
}

export async function getPost(
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
	userId?: string,
) {
	return await db.query.postsTable.findFirst({
		where: (r) => {
			const conditions = [
				or(
					eq(r.privacy, "public"),
					userId ? eq(r.authorId, userId) : undefined,
				),
			];

			if (postId.id) conditions.push(eq(r.id, postId.id));
			if (postId.nanoid) conditions.push(eq(r.nanoid, postId.nanoid));

			return and(...conditions);
		},
		columns: {
			createdAt: true,
			nanoid: true,
			pinned: true,
			privacy: true,
			text: true,
		},
		with: {
			author: {
				columns: {
					image: true,
					name: true,
				},
			},
		},
	});
}

export async function createPost(
	postData: Omit<
		typeof postsTable.$inferInsert,
		"id" | "createdAt" | "updatedAt"
	>,
) {
	return await db.transaction(async (tx) => {
		const id = (
			await tx
				.insert(postsTable)
				.values(postData)
				.returning({ id: postsTable.id })
		)[0]?.id;

		if (!id)
			throw new Error("An unknown error has occurred while creating a post.");

		return tx.query.postsTable.findFirst({
			where: (p) => eq(p.id, id),
			columns: {
				nanoid: true,
				text: true,
				pinned: true,
				privacy: true,
				createdAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						displayUsername: true,
						image: true,
					},
				},
			},
		});
	});
}

export async function updatePost(
	postData: Partial<
		Pick<typeof postsTable.$inferInsert, "text" | "privacy" | "pinned">
	>,
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
) {
	return await db.transaction(async (tx) => {
		const conditions = [];

		if (postId.id) conditions.push(eq(postsTable.id, postId.id));
		if (postId.nanoid) conditions.push(eq(postsTable.nanoid, postId.nanoid));

		const id = (
			await tx
				.update(postsTable)
				.set(postData)
				.where(and(...conditions))
				.returning({ id: postsTable.id })
		)[0]?.id;

		if (!id)
			throw new Error("An unknown error has occurred while creating a post.");

		return tx.query.postsTable.findFirst({
			where: (p) => eq(p.id, id),
			columns: {
				nanoid: true,
				text: true,
				pinned: true,
				privacy: true,
				createdAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						displayUsername: true,
						image: true,
					},
				},
			},
		});
	});
}

export async function deletePost(
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
) {
	const conditions = [];

	if (postId.id) conditions.push(eq(postsTable.id, postId.id));
	if (postId.nanoid) conditions.push(eq(postsTable.nanoid, postId.nanoid));

	return await db.delete(postsTable).where(and(...conditions));
}
