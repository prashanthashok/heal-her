// Module-level uid so lib write functions can fire Firestore writes
// without requiring uid to be threaded through every call site.
// Set by AuthContext on every auth state change.

let _uid: string | null = null;

export function setCurrentUid(uid: string | null): void {
  _uid = uid;
}

export function getCurrentUid(): string | null {
  return _uid;
}
