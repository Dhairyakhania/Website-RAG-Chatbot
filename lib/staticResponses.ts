import { Intent } from "./intent";

export function getStaticResponse(intent: Intent): string | null {
  switch (intent) {
    case "greeting":
      return (
        "Hi! 👋 I’m the Kenmark ITan virtual assistant.\n\n" +
        "You can ask me about:\n" +
        "- Our services\n" +
        "- Technologies we use\n" +
        "- Industries we serve\n" +
        "- Company information"
      );

    case "help":
      return (
        "I can help you with information about Kenmark ITan Solutions.\n\n" +
        "Try asking:\n" +
        "- What services do you offer?\n" +
        "- What technologies do you use?\n" +
        "- Which industries do you serve?"
      );

    case "thanks":
      return "You’re welcome! 😊 Let me know if you have any other questions.";

    case "goodbye":
      return "Goodbye! 👋 Feel free to reach out anytime.";

    default:
      return null;
  }
}
