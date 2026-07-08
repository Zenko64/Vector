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
  {
    postId,
    postNanoid,
  }: {
    postId?: string;
    postNanoid?: string;
  },
  userId: string,
) {
  return db.query.postsTable.findFirst({
    where: (r) => {
      const conditions = [
        or(
          eq(r.privacy, "public"),
          userId ? eq(r.authorId, userId) : undefined,
        ),
      ];

      if (postId) conditions.push(eq(r.id, postId));
      if (postNanoid) conditions.push(eq(r.nanoid, postNanoid));

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

export async function createPost() {}
export async function patchPost() {}
export async function deletePost({
  postId,
  postNanoid,
}: {
  postId?: string;
  postNanoid?: string;
}) {
  const conditions = [];

  if (postId) conditions.push(eq(postsTable.id, postId));
  if (postNanoid) conditions.push(eq(postsTable.nanoid, postNanoid));

  return await db.delete(postsTable).where(and(...conditions));
}
