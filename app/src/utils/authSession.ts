let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(callback: () => void) {
  onSessionExpired = callback;
}

export function notifySessionExpired() {
  onSessionExpired?.();
}
