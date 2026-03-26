import { describe, expect, it } from "vitest";
import { add } from "../src/math.ts";

describe("add", () => {
	it("should add two numbers correctly", () => {
		expect(add(1, 2)).toBe(3);
	});

	it("should handle negative numbers", () => {
		expect(add(-1, 1)).toBe(0);
	});
});
