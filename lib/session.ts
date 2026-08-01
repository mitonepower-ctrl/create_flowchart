const STORAGE_KEY = "flowchart_session_id";

// Anonymous per-browser session id, persisted in localStorage, used to group
// attempts by the same student without requiring an account.
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
