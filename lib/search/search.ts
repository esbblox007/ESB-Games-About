import type { SearchDocument, SearchResult } from "@/lib/content/types";

const normalise = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

function editDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + cost);
      diagonal = above;
    }
  }
  return previous[b.length];
}

function fuzzyWordMatch(queryWord: string, candidates: string[]) {
  if (queryWord.length < 4) return false;
  return candidates.some((candidate) => {
    if (candidate.length < 4 || Math.abs(candidate.length - queryWord.length) > 2) return false;
    const limit = queryWord.length >= 8 ? 2 : 1;
    return editDistance(queryWord, candidate) <= limit;
  });
}

function scoreDocument(document: SearchDocument, query: string): SearchResult | null {
  const q = normalise(query);
  if (!q) return null;
  const words = q.split(" ").filter(Boolean);
  const title = normalise(document.title);
  const description = normalise(document.description);
  const content = normalise(document.content);
  const keywords = document.keywords.map(normalise);
  const synonyms = document.synonyms.map(normalise);
  const questions = document.questions.map(normalise);

  let score = document.priority;
  let matchedText = "";

  if (title === q) score += 1000;
  else if (title.startsWith(q)) score += 700;
  else if (title.includes(q)) score += 560;

  if (description.includes(q)) { score += 330; matchedText ||= document.description; }
  if (keywords.some((item) => item === q)) score += 520;
  if (keywords.some((item) => item.includes(q) || q.includes(item))) score += 270;
  if (questions.some((item) => item === q)) score += 650;
  if (questions.some((item) => item.includes(q) || q.includes(item))) score += 360;
  if (synonyms.some((item) => item === q)) score += 480;
  if (synonyms.some((item) => item.includes(q) || q.includes(item))) score += 250;
  if (content.includes(q)) { score += 180; matchedText ||= document.description; }

  const haystack = `${title} ${description} ${keywords.join(" ")} ${synonyms.join(" ")} ${questions.join(" ")} ${content}`;
  const matchedWords = words.filter((word) => haystack.includes(word));
  score += matchedWords.length * 70;

  const candidateWords = [...new Set(haystack.split(" ").filter(Boolean))];
  const fuzzyMatches = words.filter((word) => !haystack.includes(word) && fuzzyWordMatch(word, candidateWords));
  score += fuzzyMatches.length * 28;

  if (matchedWords.length === 0 && fuzzyMatches.length === 0 && !haystack.includes(q)) return null;
  return { ...document, score, matchedText: matchedText || document.description };
}

export function rankSearchResults(documents: SearchDocument[], query: string, limit = 12): SearchResult[] {
  return documents
    .map((document) => scoreDocument(document, query))
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score || b.priority - a.priority || a.title.localeCompare(b.title))
    .slice(0, limit);
}
