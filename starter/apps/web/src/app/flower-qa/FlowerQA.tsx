"use client";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSSELineParser } from "../../lib/sse-parser";
import "./flower-qa.css";

export default function FlowerQA() {
	const [input, setInput] = useState("");
	const [answer, setAnswer] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [embeddingsReady, setEmbeddingsReady] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		let cancelled = false;
		async function updateEmbeddings() {
			try {
				await fetch("/api/flower-qa/update-embeddings", { method: "POST" });
			} finally {
				if (!cancelled) {
					setEmbeddingsReady(true);
				}
			}
		}
		updateEmbeddings();
		return () => {
			cancelled = true;
		};
	}, []);

	const renderMarkdown = useCallback((content: string) => {
		const html = marked.parse(content) as string;
		return DOMPurify.sanitize(html);
	}, []);

	const sendQuestion = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;

		setAnswer("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/flower-qa", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: trimmed }),
			});

			if (!response.ok || !response.body) {
				throw new Error("Failed to send question");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			const parser = createSSELineParser((event) => {
				if (event.event === "text") {
					const text = JSON.parse(event.data) as string;
					setAnswer((prev) => prev + text);
				} else if (event.event === "error") {
					const errorMsg = JSON.parse(event.data) as string;
					setAnswer(`Error: ${errorMsg}`);
				}
			});

			let done = false;
			while (!done) {
				const result = await reader.read();
				done = result.done;
				if (result.value) {
					parser(decoder.decode(result.value, { stream: true }));
				}
			}
			parser("\n\n");
		} catch {
			setAnswer("Sorry, something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendQuestion();
		}
	};

	if (!embeddingsReady) {
		return (
			<div className="flower-qa-container">
				<p className="flower-qa-loading" data-testid="flower-qa-loading">
					Loading flower data...
				</p>
			</div>
		);
	}

	return (
		<div className="flower-qa-container">
			<div className="flower-qa-input-area">
				<textarea
					ref={inputRef}
					className="flower-qa-input"
					data-testid="flower-qa-input"
					rows={2}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Ask a question about flowers..."
				/>
				<button
					type="button"
					className="flower-qa-send-button"
					data-testid="flower-qa-send-button"
					onClick={sendQuestion}
					disabled={isLoading}
					aria-label="Send question"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
			{answer && (
				<div
					className="flower-qa-answer"
					data-testid="flower-qa-answer"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify
					dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }}
				/>
			)}
		</div>
	);
}
