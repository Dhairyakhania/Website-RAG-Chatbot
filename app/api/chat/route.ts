export const runtime = "nodejs";

import { cookies } from "next/headers";
import crypto from "crypto";

import { retrieveKnowledge } from "@/lib/retriever";
import { buildPrompt } from "@/lib/prompt";
import { askLLM } from "@/lib/llm";
import { detectIntent } from "@/lib/intent";
import { getStaticResponse } from "@/lib/staticResponses";
import { trackQuestion } from "@/lib/analytics";
import { getSession, updateSession } from "@/lib/sessionMemory";

export async function POST(req: Request) {
  const { message } = await req.json();

  /* =========================
     Session handling
     ========================= */
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  const sessionHistory = getSession(sessionId);

  /* =========================
     Analytics
     ========================= */
  trackQuestion(message);

  /* =========================
     Intent detection
     ========================= */
  const intent = detectIntent(message);
  const staticReply = getStaticResponse(intent);

  if (staticReply) {
    updateSession(sessionId, { role: "user", content: message });
    updateSession(sessionId, { role: "assistant", content: staticReply });

    return new Response(staticReply, {
      headers: {
        "Content-Type": "text/plain",
        "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly`,
      },
    });
  }

  /* =========================
     Knowledge-based RAG
     ========================= */
  const knowledge = retrieveKnowledge(message);

  if (knowledge.length === 0) {
    const fallback = "I don't have that information yet.";

    updateSession(sessionId, { role: "user", content: message });
    updateSession(sessionId, { role: "assistant", content: fallback });

    return new Response(fallback, {
      headers: {
        "Content-Type": "text/plain",
        "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly`,
      },
    });
  }

  /* =========================
     Build prompt with memory
     ========================= */
  const historyText = sessionHistory
    .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
    .join("\n");

  const context = knowledge
    .map((k) => `- (${k.category.toUpperCase()}) ${k.answer}`)
    .join("\n");

  const prompt = `
Conversation so far:
${historyText}

${buildPrompt(context, message)}
`;

  /* =========================
     Stream Groq response
     ========================= */
  const llmStream = await askLLM(prompt);
  let fullReply = "";

  const stream = new ReadableStream<string>({
    async start(controller) {
      const reader = llmStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;

        fullReply += value;
        controller.enqueue(value);
      }

      updateSession(sessionId, { role: "user", content: message });
      updateSession(sessionId, { role: "assistant", content: fullReply });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly`,
    },
  });
}
