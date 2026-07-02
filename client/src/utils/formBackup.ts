/**
 * Local-storage form backup utilities.
 *
 * Saves user-entered form data to localStorage so nothing is lost
 * when the backend is unavailable or a submission fails.
 * Data is automatically restored on page reload and cleared on success.
 */

const PREFIX = 'jac_form_backup_';

/** Save serialisable form fields under a stable key. */
export function saveFormBackup<T extends Record<string, unknown>>(
  formKey: string,
  data: T
): void {
  try {
    localStorage.setItem(
      `${PREFIX}${formKey}`,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {
    // localStorage may be full or disabled — silently ignore.
  }
}

/** Restore previously saved form fields, or return `null`. */
export function loadFormBackup<T extends Record<string, unknown>>(
  formKey: string
): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${formKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: T };
    // Discard backups older than 7 days.
    if (Date.now() - parsed.ts > 7 * 24 * 60 * 60 * 1000) {
      clearFormBackup(formKey);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/** Remove a stored backup (typically called after a successful submit). */
export function clearFormBackup(formKey: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${formKey}`);
  } catch {
    // Ignore.
  }
}
