export const STORAGE_SYNC_EVENT = "skillzone-storage-sync";

export function emitStorageSyncEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_SYNC_EVENT));
}
