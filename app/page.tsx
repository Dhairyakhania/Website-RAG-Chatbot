import ChatWidget from "../components/chat_widgets";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Kenmark ITan Solutions
      </h1>

      <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-300">
        AI-powered virtual assistant to help you explore our services,
        technologies, industries, and company information.
      </p>

      {/* Optional admin access */}
      <Link
        href="/admin"
        className="mt-8 text-sm text-indigo-600 dark:text-indigo-400 underline"
      >
        Go to Admin Dashboard
      </Link>

      {/* Chatbot only on home page */}
      <ChatWidget />
    </main>
  );
}
