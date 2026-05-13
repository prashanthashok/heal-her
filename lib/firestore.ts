import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from './types';
import type { JournalEntry } from './journal';
import type { TrackerEntry } from './tracker';
import type { WeekPlan } from './meals';

// All user data lives under /users/{uid}/data/{document}
function userDoc(uid: string, name: string) {
  return doc(db, 'users', uid, 'data', name);
}

// ── Profile ────────────────────────────────────────────────────────────────

export async function fsGetProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userDoc(uid, 'profile'));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function fsSaveProfile(uid: string, profile: UserProfile): Promise<void> {
  await setDoc(userDoc(uid, 'profile'), profile);
}

// ── Journal ────────────────────────────────────────────────────────────────

export async function fsGetJournalEntries(uid: string): Promise<JournalEntry[]> {
  const snap = await getDoc(userDoc(uid, 'journalEntries'));
  return snap.exists() ? ((snap.data().entries ?? []) as JournalEntry[]) : [];
}

export async function fsSaveJournalEntries(uid: string, entries: JournalEntry[]): Promise<void> {
  await setDoc(userDoc(uid, 'journalEntries'), { entries });
}

// ── Tracker ────────────────────────────────────────────────────────────────

export async function fsGetTrackerLog(uid: string): Promise<TrackerEntry[]> {
  const snap = await getDoc(userDoc(uid, 'trackerLog'));
  return snap.exists() ? ((snap.data().entries ?? []) as TrackerEntry[]) : [];
}

export async function fsSaveTrackerLog(uid: string, entries: TrackerEntry[]): Promise<void> {
  await setDoc(userDoc(uid, 'trackerLog'), { entries });
}

// ── Meal plan ──────────────────────────────────────────────────────────────

export async function fsGetMealPlan(uid: string): Promise<WeekPlan | null> {
  const snap = await getDoc(userDoc(uid, 'mealPlan'));
  return snap.exists() ? (snap.data() as WeekPlan) : null;
}

export async function fsSaveMealPlan(uid: string, plan: WeekPlan): Promise<void> {
  await setDoc(userDoc(uid, 'mealPlan'), plan);
}

// ── Herb checks ────────────────────────────────────────────────────────────

export async function fsGetHerbChecks(uid: string): Promise<Record<string, string[]>> {
  const snap = await getDoc(userDoc(uid, 'herbChecks'));
  return snap.exists() ? ((snap.data().data ?? {}) as Record<string, string[]>) : {};
}

export async function fsSaveHerbChecks(uid: string, data: Record<string, string[]>): Promise<void> {
  await setDoc(userDoc(uid, 'herbChecks'), { data });
}

// ── Checklist ──────────────────────────────────────────────────────────────

export async function fsGetChecklist(uid: string): Promise<Record<string, string[]>> {
  const snap = await getDoc(userDoc(uid, 'checklist'));
  return snap.exists() ? ((snap.data().data ?? {}) as Record<string, string[]>) : {};
}

export async function fsSaveChecklist(uid: string, data: Record<string, string[]>): Promise<void> {
  await setDoc(userDoc(uid, 'checklist'), { data });
}

// ── Learn ──────────────────────────────────────────────────────────────────

export async function fsGetLearnRead(uid: string): Promise<string[]> {
  const snap = await getDoc(userDoc(uid, 'learnRead'));
  return snap.exists() ? ((snap.data().ids ?? []) as string[]) : [];
}

export async function fsSaveLearnRead(uid: string, ids: string[]): Promise<void> {
  await setDoc(userDoc(uid, 'learnRead'), { ids });
}
