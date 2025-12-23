// export async function askLLM(prompt: string) {
//   const res = await fetch("http://localhost:11434/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "mistral",
//       prompt,
//       stream: true,
//     }),
//   });

//   const reader = res.body!.getReader();
//   const decoder = new TextDecoder();

//   return new ReadableStream({
//     async start(controller) {
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value);
//         const lines = chunk.split("\n").filter(Boolean);

//         for (const line of lines) {
//           try {
//             const json = JSON.parse(line);
//             if (json.response) {
//               controller.enqueue(json.response);
//             }
//           } catch {
//             // ignore malformed chunks
//           }
//         }
//       }

//       controller.close();
//     },
//   });
// }

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function askLLM(prompt: string) {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      stream: true,
      messages: [
        { role: "system", content: "Answer using only provided knowledge." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.body) throw new Error("No response body from Groq");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async start(controller) {
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;

        buffer += decoder.decode(value, { stream: true });

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
          } catch {}
        }
      }

      controller.close();
    },
  });
}


