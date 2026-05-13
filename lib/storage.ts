import type { UserProfile } from './types';
import { getCurrentUid } from './uid';
import { fsSaveProfile } from './firestore';

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboardingComplete',
  USER_PROFILE:        'userProfile',
  CHECKLIST:           'checklistData',
  TRACKER_LOG:         'trackerLog',
  MEAL_PLAN:           'mealPlan',
  HERB_CHECKS:         'herbChecks',
  LEARN_READ:          'learnRead',
  JOURNAL_ENTRIES:     'journalEntries',
} as const;

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  const uid = getCurrentUid();
  if (uid) fsSaveProfile(uid, profile).catch(console.error);
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function setOnboardingComplete(): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

/** Wipes every app key from localStorage and resets to a clean state. */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
