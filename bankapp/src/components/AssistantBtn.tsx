"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/AssistantBtn/assistantBtn.module.css";

type Role = "user" | "assistant";

interface Message {
  id: number;
  role: Role;
  text: string;
}

interface Props {
  /** Send the user's text to your backend (e.g. a Route Handler) and return the reply. */
  onSend: (message: string) => Promise<string>;
  label?: string;
  greeting?: string;
  brandColor?: string;
}

function SmileIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <circle cx="8.6" cy="10" r="1.2" fill={color} />
      <circle cx="15.4" cy="10" r="1.2" fill={color} />
      <path
        d="M7.5 14c1 2 2.7 3 4.5 3s3.5-1 4.5-3"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AssistantButton({
  onSend,
  label = "How can I help you?",
  greeting = "Hi! I'm Julia.\nAsk me anything about your accounts or how to use our banking app.\nI'm happy to help!",
  brandColor = "#004c3f",
}: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: greeting },
  ]);
  const [introPlayed, setIntroPlayed] = useState(false);

  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null); // add this
  const hasOpened = useRef(false);

  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      inputRef.current?.focus();
    } else if (hasOpened.current) {
      // give focus back to the launcher after closing
      launcherRef.current?.focus();
    }
  }, [open]);

  // keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text },
    ]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const reply = await onSend(text);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "assistant", text: reply },
      ]);
    } catch {
      setError("Couldn't get a reply. Check your connection and try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="position-fixed bottom-0 end-0 me-3 d-flex flex-column align-items-end"
      style={{ zIndex: 1050 }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <section
        id="assistant-panel"
        aria-label="Assistant chat"
        aria-hidden={!open}
        className={`${styles.panel} ${open ? styles.isOpen : ""} position-absolute bottom-0 end-0 mb-3 bg-white border rounded-4 shadow d-flex flex-column overflow-hidden`}
        style={{
          width: "min(360px, calc(100vw - 2rem))",
          height: "min(440px, 65vh)",
        }}
      >
        <header
          className="d-flex justify-content-between align-items-center px-3 py-2 text-white"
          style={{ backgroundColor: brandColor }}
        >
          <span className="fw-semibold">AI Assistant</span>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
          />
        </header>

        <div
          className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2"
          role="log"
          aria-live="polite"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`px-3 py-2 rounded-3 small ${
                m.role === "user"
                  ? "align-self-end text-white"
                  : "align-self-start bg-light text-dark"
              }`}
              style={{
                maxWidth: "85%",
                whiteSpace: "pre-wrap",
                ...(m.role === "user" ? { backgroundColor: brandColor } : {}),
              }}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="align-self-start bg-light text-muted px-3 py-2 rounded-3 small">
              Thinking...
            </div>
          )}

          {error && (
            <div role="alert" className="text-danger small">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="d-flex gap-2 p-2 border-top">
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Type your question"
            aria-label="Your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            maxLength={500}
          />
          <button
            type="submit"
            className="btn text-white fw-semibold"
            style={{ backgroundColor: brandColor }}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </section>

      {/* Floating button:*/}
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          className={`btn ${styles.launcher} border-0 d-flex align-items-center gap-2 px-4 py-3 text-white fw-semibold shadow rounded-top-4 rounded-bottom-0 ${
            introPlayed ? "" : styles.intro
          }`}
          style={{ backgroundColor: brandColor }}
          aria-controls="assistant-panel"
          onAnimationEnd={() => setIntroPlayed(true)}
          onClick={() => {
            setIntroPlayed(true);
            setOpen(true);
          }}
        >
          <SmileIcon color={brandColor} />
          <span>{label}</span>
        </button>
      )}
    </div>
  );
}
