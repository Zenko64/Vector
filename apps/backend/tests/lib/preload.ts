import { mock } from "bun:test";
import testDb from "./db";

mock.module("../../src/db", () => ({ default: testDb }));
