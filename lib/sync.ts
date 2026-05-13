import { STORAGE_KEYS } from './storage';
import {
  fsGetProfile, fsGetJournalEntries, fsGetTrackerLog,
  fsGetMealPlan, fsGetHerbChecks, fsGetChecklist, fsGetLearnRead,
  fsSaveProfile, fsSaveJournalEntries, fsSaveTrackerLog,
  fsSaveMealPlan, fsSaveHerbChecks, fsSaveChecklist, fsSaveLearnRead,
} from './firestore';

/**
 * Downloads all Firestore data and writes it to localStorage.
 * Returns true if the user had a profile in the cloud (i.e. has completed onboarding).
 */
export async function hydrateFromFirestore(uid: string): Promise<boolean> {
  const profile = await fsGetProfile(uid);
  if (!profile) return false;

  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');

  const [journal, tracker, mealPlan, herbChecks, checklist, learnRead] = await Promise.all([
    fsGetJournalEntries(uid),
    fsGetTrackerLog(uid),
    fsGetMealPlan(uid),
    fsGetHerbChecks(uid),
    fsGetChecklist(uid),
    fsGetLearnRead(uid),
  ]);

  if (journal.length)              localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journal));
  if (tracker.length)              localStorage.setItem(STORAGE_KEYS.TRACKER_LOG, JSON.stringify(tracker));
  if (mealPlan)                    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
  if (Object.keys(herbChecks).length) localStorage.setItem(STORAGE_KEYS.HERB_CHECKS, JSON.stringify(herbChecks));
  if (Object.keys(checklist).length)  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  if (learnRead.length)            localStorage.setItem(STORAGE_KEYS.LEARN_READ, JSON.stringify(learnRead));

  return true;
}

/**
 * Uploads all existing localStorage data to Firestore.
 * Called once on first sign-in when the user has existing local data to migrate.
 */
export async function pushToFirestore(uid: string): Promise<void> {
  const profileRaw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  const journalRaw = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
  const trackerRaw = localStorage.getItem(STORAGE_KEYS.TRACKER_LOG);
  const mealRaw    = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
  const herbRaw    = localStorage.getItem(STORAGE_KEYS.HERB_CHECKS);
  const checkRaw   = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
  const learnRaw   = localStorage.getItem(STORAGE_KEYS.LEARN_READ);

  await Promise.all([
    profileRaw ? fsSaveProfile(uid, JSON.parse(profileRaw))           : Promise.resolve(),
    journalRaw ? fsSaveJournalEntries(uid, JSON.parse(journalRaw))    : Promise.resolve(),
    trackerRaw ? fsSaveTrackerLog(uid, JSON.parse(trackerRaw))        : Promise.resolve(),
    mealRaw    ? fsSaveMealPlan(uid, JSON.parse(mealRaw))             : Promise.resolve(),
    herbRaw    ? fsSaveHerbChecks(uid, JSON.parse(herbRaw))           : Promise.resolve(),
    checkRaw   ? fsSaveChecklist(uid, JSON.parse(checkRaw))           : Promise.resolve(),
    learnRaw   ? fsSaveLearnRead(uid, JSON.parse(learnRaw))           : Promise.resolve(),
  ]);
}
