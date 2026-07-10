import type { User } from "better-auth";

export type MockUser = {
	header: Headers | undefined;
	user: User | undefined;
};
