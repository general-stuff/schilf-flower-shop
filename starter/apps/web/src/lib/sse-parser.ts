export interface SSEEvent {
	event: string;
	data: string;
}

export function parseSSEEvents(chunk: string): SSEEvent[] {
	const events: SSEEvent[] = [];
	const blocks = chunk.split("\n\n");

	for (const block of blocks) {
		const trimmed = block.trim();
		if (!trimmed) continue;

		let event = "message";
		let data = "";

		const lines = trimmed.split("\n");
		for (const line of lines) {
			if (line.startsWith("event:")) {
				event = line.slice("event:".length).trim();
			} else if (line.startsWith("data:")) {
				data = line.slice("data:".length).trim();
			}
		}

		if (data) {
			events.push({ event, data });
		}
	}

	return events;
}

export function createSSELineParser(
	onEvent: (event: SSEEvent) => void,
): (chunk: string) => void {
	let buffer = "";

	return (chunk: string) => {
		buffer += chunk;

		const parts = buffer.split("\n\n");
		buffer = parts.pop() ?? "";

		for (const part of parts) {
			const trimmed = part.trim();
			if (!trimmed) continue;

			let event = "message";
			let data = "";

			const lines = trimmed.split("\n");
			for (const line of lines) {
				if (line.startsWith("event:")) {
					event = line.slice("event:".length).trim();
				} else if (line.startsWith("data:")) {
					data = line.slice("data:".length).trim();
				}
			}

			if (data) {
				onEvent({ event, data });
			}
		}
	};
}
