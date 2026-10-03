import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, SendHorizonal, X } from "lucide-react";

import { chatWithSourov } from "@/lib/chatbot.functions";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Sourov! Ask me anything about my projects, skills, studies, or how we could work together.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(chatWithSourov);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const { reply } = await ask({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Something went wrong on my end — please try again, or email me at souov.hasan373@gmail.com.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <section className="chat-panel" aria-label="Chat with Sourov">
          <header className="chat-header">
            <div>
              <p className="chat-title">Chat with Sourov</p>
              <p className="chat-subtitle"><span className="status-dot" /> Usually replies instantly</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X />
            </Button>
          </header>
          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <p key={i} className={`chat-bubble ${m.role === "user" ? "from-user" : "from-sourov"}`}>
                {m.content}
              </p>
            ))}
            {sending && <p className="chat-bubble from-sourov chat-typing" role="status">Typing…</p>}
          </div>
          <form className="chat-composer" onSubmit={submit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work…"
              maxLength={2000}
              aria-label="Message Sourov"
            />
            <Button type="submit" size="icon" disabled={sending || !input.trim()} aria-label="Send message">
              <SendHorizonal />
            </Button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Chat with Sourov"}
        aria-expanded={open}
      >
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}
