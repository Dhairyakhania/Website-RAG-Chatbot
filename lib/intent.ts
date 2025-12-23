export type Intent =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "help"
  | "knowledge";

export function detectIntent(message: string): Intent {
  const text = message.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|hola)\b/.test(text)) {
    return "greeting";
  }

  if (/(thank|thanks|thx)/.test(text)) {
    return "thanks";
  }

  if (/(bye|goodbye|see you)/.test(text)) {
    return "goodbye";
  }

  if (/(help|what can you do|how does this work)/.test(text)) {
    return "help";
  }

  return "knowledge";
}
