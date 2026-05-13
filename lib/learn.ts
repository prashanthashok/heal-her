import ARTICLES from '@/data/learn';
import { getCurrentUid } from './uid';
import { fsSaveLearnRead } from './firestore';

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
  const ids = Array.from(current);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // silent
  }
  const uid = getCurrentUid();
  if (uid) fsSaveLearnRead(uid, ids).catch(console.error);
  return current;
}
