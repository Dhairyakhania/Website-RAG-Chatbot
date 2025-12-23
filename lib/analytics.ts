const questionCount: Record<string, number> = {};

export function trackQuestion(question: string) {
  const key = question.toLowerCase().trim();
  questionCount[key] = (questionCount[key] || 0) + 1;
}

export function getTopQuestions(limit = 5) {
  return Object.entries(questionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([question, count]) => ({ question, count }));
}
