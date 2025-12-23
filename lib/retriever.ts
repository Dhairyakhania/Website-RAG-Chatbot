// lib/retriever.ts

import { loadKnowledge } from "./excelParser";
import { websiteContent } from "../data/website/content";

type KnowledgeItem = {
  category: string;
  question?: string;
  answer: string;
  score?: number;
  source?: "excel" | "website";
};

/* =====================
   Load knowledge
   ===================== */

const excelKnowledge: KnowledgeItem[] = loadKnowledge().map((item) => ({
  ...item,
  source: "excel",
}));

const websiteKnowledge: KnowledgeItem[] = websiteContent.map((item) => ({
  category: item.page.toLowerCase(),
  answer: item.content,
  source: "website",
}));

const knowledgeBase: KnowledgeItem[] = [
  ...excelKnowledge,
  ...websiteKnowledge,
];

/* =====================
   Utility functions
   ===================== */

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function similarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);

  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);

  return intersection.length / union.size;
}

/* =====================
   Retrieval logic
   ===================== */

export function retrieveKnowledge(query: string): KnowledgeItem[] {
  const queryTokens = normalize(query);

  const scored = knowledgeBase.map((item) => {
    const answerTokens = normalize(item.answer);
    const questionTokens = item.question
      ? normalize(item.question)
      : [];

    const answerScore = similarity(queryTokens, answerTokens);
    const questionScore = similarity(queryTokens, questionTokens);

    const score = Math.max(answerScore, questionScore * 1.1);

    return { ...item, score };
  });

  let filtered = scored
    .filter((item) => item.score && item.score > 0.12)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Non-static ordering for similar scores
  filtered = filtered.sort((a, b) => {
    if (Math.abs((a.score ?? 0) - (b.score ?? 0)) < 0.05) {
      return Math.random() - 0.5;
    }
    return (b.score ?? 0) - (a.score ?? 0);
  });

  const queryLength = queryTokens.length;
  const topK = queryLength <= 3 ? 3 : queryLength <= 6 ? 4 : 5;

  return filtered.slice(0, Math.min(filtered.length, topK));
}
