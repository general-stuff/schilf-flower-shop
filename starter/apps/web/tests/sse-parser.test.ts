import { describe, expect, it, vi } from "vitest";
import {
	createSSELineParser,
	parseSSEEvents,
	type SSEEvent,
} from "../src/lib/sse-parser";

describe("parseSSEEvents", () => {
	it("parses a single named event", () => {
		const input = 'event: text\ndata: "hello"\n\n';
		const result = parseSSEEvents(input);
		expect(result).toEqual([{ event: "text", data: '"hello"' }]);
	});

	it("parses multiple events", () => {
		const input =
			'event: text\ndata: "hello"\n\nevent: text\ndata: "world"\n\n';
		const result = parseSSEEvents(input);
		expect(result).toEqual([
			{ event: "text", data: '"hello"' },
			{ event: "text", data: '"world"' },
		]);
	});

	it("parses events with different names", () => {
		const input = 'event: text\ndata: "chunk"\n\nevent: done\ndata: [DONE]\n\n';
		const result = parseSSEEvents(input);
		expect(result).toEqual([
			{ event: "text", data: '"chunk"' },
			{ event: "done", data: "[DONE]" },
		]);
	});

	it("defaults to 'message' event when no event field", () => {
		const input = "data: hello\n\n";
		const result = parseSSEEvents(input);
		expect(result).toEqual([{ event: "message", data: "hello" }]);
	});

	it("skips blocks with no data", () => {
		const input = "event: text\n\n";
		const result = parseSSEEvents(input);
		expect(result).toEqual([]);
	});

	it("handles empty input", () => {
		expect(parseSSEEvents("")).toEqual([]);
	});

	it("handles whitespace-only input", () => {
		expect(parseSSEEvents("  \n\n  ")).toEqual([]);
	});

	it("parses error events", () => {
		const input = 'event: error\ndata: "Something went wrong"\n\n';
		const result = parseSSEEvents(input);
		expect(result).toEqual([
			{ event: "error", data: '"Something went wrong"' },
		]);
	});

	it("handles extra whitespace around event and data values", () => {
		const input = "event:  text \ndata:  hello \n\n";
		const result = parseSSEEvents(input);
		expect(result).toEqual([{ event: "text", data: "hello" }]);
	});
});

describe("createSSELineParser", () => {
	it("parses a complete event in one chunk", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser('event: text\ndata: "hello"\n\n');

		expect(events).toEqual([{ event: "text", data: '"hello"' }]);
	});

	it("handles an event split across multiple chunks", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser("event: text\n");
		parser('data: "hello"\n');
		parser("\n");

		expect(events).toEqual([{ event: "text", data: '"hello"' }]);
	});

	it("handles multiple events across chunks", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser('event: text\ndata: "a"\n\nevent: text\ndata: "b"\n\n');

		expect(events).toEqual([
			{ event: "text", data: '"a"' },
			{ event: "text", data: '"b"' },
		]);
	});

	it("buffers incomplete events", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser("event: text\ndata: ");
		expect(events).toEqual([]);

		parser('"hello"\n\n');
		expect(events).toEqual([{ event: "text", data: '"hello"' }]);
	});

	it("handles chunks splitting in the middle of a line", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser("eve");
		parser("nt: text\nda");
		parser('ta: "split"\n\n');

		expect(events).toEqual([{ event: "text", data: '"split"' }]);
	});

	it("handles done event", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser("event: done\ndata: [DONE]\n\n");

		expect(events).toEqual([{ event: "done", data: "[DONE]" }]);
	});

	it("calls handler for each event as it arrives", () => {
		const handler = vi.fn();
		const parser = createSSELineParser(handler);

		parser('event: text\ndata: "first"\n\n');
		expect(handler).toHaveBeenCalledTimes(1);

		parser('event: text\ndata: "second"\n\n');
		expect(handler).toHaveBeenCalledTimes(2);
	});

	it("handles rapid successive chunks", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		const chunks = [
			'event: text\ndata: "a"\n\n',
			'event: text\ndata: "b"\n\n',
			'event: text\ndata: "c"\n\n',
			"event: done\ndata: [DONE]\n\n",
		];

		for (const chunk of chunks) {
			parser(chunk);
		}

		expect(events).toHaveLength(4);
		expect(events[3]).toEqual({ event: "done", data: "[DONE]" });
	});

	it("handles empty chunks without errors", () => {
		const events: SSEEvent[] = [];
		const parser = createSSELineParser((e) => events.push(e));

		parser("");
		parser("");
		parser('event: text\ndata: "ok"\n\n');

		expect(events).toEqual([{ event: "text", data: '"ok"' }]);
	});
});
