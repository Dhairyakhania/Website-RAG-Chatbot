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

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function askLLM(prompt: string): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for Kenmark ITan Solutions. Answer only using the provided knowledge base. Be concise and accurate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from Groq.";
}



