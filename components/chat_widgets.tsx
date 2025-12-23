"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Welcome message on first open */
  useEffect(() => {
    if (open && !hasWelcomed) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! 👋 I’m Kenmark AI.\n\nI can help you with our services, hosting, development, marketing, and more. What would you like to know?",
        },
      ]);
      setHasWelcomed(true);
    }
  }, [open, hasWelcomed]);

  async function sendMessage() {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput("");
    setIsTyping(true);

    // 1️⃣ Add user message
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    const reader = res.body?.getReader();
    if (!reader) {
      setIsTyping(false);
      return;
    }

    // 2️⃣ Add assistant placeholder and capture index
    let assistantIndex = -1;
    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    const decoder = new TextDecoder();
    let assistantText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      assistantText += decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const updated = [...prev];
        if (assistantIndex >= 0 && updated[assistantIndex]) {
          updated[assistantIndex] = {
            role: "assistant",
            content: assistantText,
          };
        }
        return updated;
      });
}


    setIsTyping(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="w-[360px] max-w-[90vw] h-[500px] glass rounded-2xl shadow-2xl flex flex-col animate-chat-open">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                K
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Kenmark AI
                </p>
                <p className="text-xs text-slate-400">
                  Virtual Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl leading-relaxed animate-message ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-black/40 backdrop-blur text-slate-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs text-slate-400 italic">
                Kenmark AI is typing…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/20">
            <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isTyping}
                placeholder="Ask something..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder-slate-400"
              />
              <button
                onClick={sendMessage}
                disabled={isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg transition disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center text-xl hover:bg-indigo-700 transition"
        >
          💬
        </button>
      )}
    </div>
  );
}
