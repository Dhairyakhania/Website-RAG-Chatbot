type Message = { role: "user" | "assistant"; content: string };

const sessions = new Map<string, Message[]>();

export function getSession(id: string): Message[] {
  return sessions.get(id) || [];
}

export function updateSession(id: string, message: Message) {
  const history = sessions.get(id) || [];
  history.push(message);
  sessions.set(id, history.slice(-8));
}
