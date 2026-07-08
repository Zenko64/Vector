import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import * as handler from "../src/posts/handlers";

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "@JohnDoe12341234",
};

describe("Posting Module", () => {
  beforeAll(async () => {}); // Create Account
  afterAll(async () => {}); // Delete Account
  it("Creates a Post", async () => {});
  it("Updates a Post", async () => {});
  it("Deletes a Post", async () => {});
});
