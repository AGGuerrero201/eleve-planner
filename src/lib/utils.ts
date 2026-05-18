import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Class name utility ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Format date ───────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Truncate ─────────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '\u2026'
}

// ─── Generate a temporary client-side ID ──────────────────────────────────
// Used only as a placeholder before the Supabase-generated UUID comes back.

export function generateTempId(): string {
  return 'tmp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

// ─── Extract a human-readable error message ──────────────────────────────

export function extractErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message)
  }
  return 'An unexpected error occurred'
}
