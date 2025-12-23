const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function askLLM(prompt: string): Promise<ReadableStream<string>> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for Kenmark ITan Solutions. Answer only using the provided knowledge base.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.body) {
    throw new Error("Groq response body is null");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  return new ReadableStream<string>({
    async start(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          buffer += decoder.decode(value, { stream: true });

          // Split SSE events
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            if (!event.startsWith("data:")) continue;

            const data = event.replace("data:", "").trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(token);
            } catch {
              // ignore malformed chunks
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
}



