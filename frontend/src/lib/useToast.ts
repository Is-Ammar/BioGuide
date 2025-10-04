// Lightweight toast utility (no JSX here to keep .ts valid)
export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastEventDetail {
  id: string;
  message: string;
  variant: ToastVariant;
}

const TOAST_EVENT = 'app:toast';

export function showToast(message: string, variant: ToastVariant = 'info') {
  const id = (globalThis.crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
  const detail: ToastEventDetail = { id, message, variant };
  const evt = new CustomEvent<ToastEventDetail>(TOAST_EVENT, { detail });
  window.dispatchEvent(evt);
}

export function getToastEventName() {
  return TOAST_EVENT;
}
