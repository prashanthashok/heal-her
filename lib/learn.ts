import ARTICLES from '@/data/learn';
export type { LearnArticle, LearnCategory } from '@/data/learn';
export { ARTICLES };

const STORAGE_KEY = 'learnRead';

export function loadReadArticles(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function markArticleRead(id: string): Set<string> {
  const current = loadReadArticles();
  current.add(id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // silent
  }
  return current;
}
