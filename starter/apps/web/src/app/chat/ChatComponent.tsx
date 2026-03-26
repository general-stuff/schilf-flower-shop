"use client";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSSELineParser } from "../../lib/sse-parser";
import "./chat.css";

interface ToolCall {
	toolName: string;
	args: Record<string, unknown>;
}

interface ChatMessage {
	id: number;
	role: "user" | "assistant" | "tool_call";
	content: string;
	toolCall?: ToolCall;
}

let nextMessageId = 0;

export default function ChatComponent() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const chatHistoryRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const scrollToBottom = useCallback(() => {
		if (chatHistoryRef.current) {
			chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const sendMessage = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;

		const userMessage: ChatMessage = {
			role: "user",
			content: trimmed,
			id: nextMessageId++,
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: trimmed }),
			});

			if (!response.ok || !response.body) {
				throw new Error("Failed to send message");
			}

			const assistantId = nextMessageId++;
			setMessages((prev) => [
				...prev,
				{ id: assistantId, role: "assistant", content: "" },
			]);

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			const parser = createSSELineParser((event) => {
				if (event.event === "text") {
					const text = JSON.parse(event.data) as string;
					setMessages((prev) =>
						prev.map((m, idx) =>
							idx === prev.length - 1 && m.role === "assistant"
								? { ...m, content: m.content + text }
								: m,
						),
					);
				} else if (event.event === "tool_call") {
					const toolCall = JSON.parse(event.data) as ToolCall;
					const toolMsg: ChatMessage = {
						id: nextMessageId++,
						role: "tool_call",
						content: toolCall.toolName,
						toolCall,
					};
					setMessages((prev) => {
						// Remove empty trailing assistant message if present
						const filtered =
							prev.length > 0 &&
							prev[prev.length - 1].role === "assistant" &&
							prev[prev.length - 1].content === ""
								? prev.slice(0, -1)
								: prev;
						return [
							...filtered,
							toolMsg,
							{
								id: nextMessageId++,
								role: "assistant",
								content: "",
							},
						];
					});
				} else if (event.event === "error") {
					const errorMsg = JSON.parse(event.data) as string;
					setMessages((prev) =>
						prev.map((m, idx) =>
							idx === prev.length - 1 && m.role === "assistant"
								? { ...m, content: `Error: ${errorMsg}` }
								: m,
						),
					);
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
			// Flush any remaining buffer
			parser("\n\n");

			// Remove trailing empty assistant message
			setMessages((prev) => {
				if (
					prev.length > 0 &&
					prev[prev.length - 1].role === "assistant" &&
					prev[prev.length - 1].content === ""
				) {
					return prev.slice(0, -1);
				}
				return prev;
			});
		} catch {
			setMessages((prev) => [
				...prev.filter(
					(m, i) =>
						!(
							i === prev.length - 1 &&
							m.role === "assistant" &&
							m.content === ""
						),
				),
				{
					id: nextMessageId++,
					role: "assistant",
					content: "Sorry, something went wrong. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const renderMarkdown = (content: string) => {
		const html = marked.parse(content) as string;
		const clean = DOMPurify.sanitize(html);
		return clean;
	};

	return (
		<div className="chat-container">
			<div
				className="chat-history"
				ref={chatHistoryRef}
				data-testid="chat-history"
			>
				{messages.map((msg) =>
					msg.role === "tool_call" ? (
						<ToolCallMessage key={msg.id} msg={msg} />
					) : (
						<div
							key={msg.id}
							className={`chat-message chat-message--${msg.role}`}
						>
							<div
								className="chat-message__bubble"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify
								dangerouslySetInnerHTML={{
									__html: renderMarkdown(msg.content),
								}}
							/>
						</div>
					),
				)}
			</div>
			<div className="chat-input-area">
				<textarea
					ref={inputRef}
					className="chat-input"
					data-testid="chat-input"
					rows={2}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type your message..."
				/>
				<button
					type="button"
					className="chat-send-button"
					data-testid="chat-send-button"
					onClick={sendMessage}
					disabled={isLoading}
					aria-label="Send message"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
		</div>
	);
}

function ToolCallMessage({ msg }: { msg: ChatMessage }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="chat-message chat-message--tool" data-testid="tool-call">
			<div className="tool-call-bubble">
				<button
					type="button"
					className="tool-call-toggle"
					onClick={() => setExpanded((prev) => !prev)}
				>
					Tool: {msg.content} {expanded ? "▲" : "▼"}
				</button>
				{expanded && (
					<pre className="tool-call-details">
						{JSON.stringify(msg.toolCall?.args, null, 2)}
					</pre>
				)}
			</div>
		</div>
	);
}
