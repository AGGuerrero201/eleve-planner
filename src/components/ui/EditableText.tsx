/**
 * EditableText — click anywhere on the value to edit it.
 * A pencil icon is always visible (not hover-only) for clarity.
 */

import { useState, useRef, useEffect } from 'react'
import { Pencil, Check, X, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onSave: (newValue: string) => Promise<string | null>
  className?: string
  inputClassName?: string
  placeholder?: string
  label?: string
}

export function EditableText({
  value,
  onSave,
  className,
  inputClassName,
  placeholder = 'Click to edit…',
  label,
}: EditableTextProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(value)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const startEdit = () => { setDraft(value); setError(null); setEditing(true) }
  const cancel    = () => { setDraft(value); setError(null); setEditing(false) }

  const commit = async () => {
    const trimmed = draft.trim()
    if (trimmed === value) { setEditing(false); return }
    setSaving(true); setError(null)
    const err = await onSave(trimmed)
    setSaving(false)
    if (err) { setError(err) } else {
      setEditing(false); setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') void commit()
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && <span className="text-[0.68rem] font-medium tracking-[0.1em] uppercase text-charcoal-light">{label}</span>}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={saving}
          className={cn(
            'font-sans text-[0.875rem] font-light text-charcoal bg-white',
            'border border-gold rounded-sm px-3 py-2 w-full outline-none',
            'focus:ring-2 focus:ring-gold/20',
            inputClassName
          )}
        />
        {error && <p className="text-[0.72rem] text-red-500">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            onClick={() => void commit()} disabled={saving}
            className="flex items-center gap-1 text-[0.72rem] font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-sm hover:bg-green-100 disabled:opacity-50"
          >
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={cancel} disabled={saving}
            className="flex items-center gap-1 text-[0.72rem] text-muted border border-border px-2.5 py-1 rounded-sm hover:bg-warm-gray disabled:opacity-50"
          >
            <X size={11} /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 cursor-pointer', className)} onClick={startEdit}>
      {label && <span className="text-[0.68rem] font-medium tracking-[0.1em] uppercase text-charcoal-light shrink-0">{label}</span>}
      <span className="flex-1 text-[0.875rem] font-light text-charcoal leading-snug hover:text-charcoal/70 transition-colors">
        {value || <span className="text-muted italic">{placeholder}</span>}
      </span>
      <span className="shrink-0 flex items-center gap-1">
        {saved
          ? <CheckCircle2 size={12} className="text-green-600" />
          : <Pencil size={11} className="text-muted/60 hover:text-gold transition-colors" />
        }
      </span>
    </div>
  )
}
