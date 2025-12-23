export default function ChatBubble({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-message`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-line
        ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/80 dark:bg-gray-700 dark:text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
