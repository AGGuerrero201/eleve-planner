/**
 * EditableTextarea — click anywhere on the text to edit it.
 * Pencil icon always visible. Cmd/Ctrl+Enter to save, Escape to cancel.
 */

import { useState, useRef, useEffect } from 'react'
import { Pencil, Check, X, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableTextareaProps {
  value: string
  onSave: (newValue: string) => Promise<string | null>
  className?: string
  textClassName?: string
  placeholder?: string
  rows?: number
}

export function EditableTextarea({
  value,
  onSave,
  className,
  textClassName,
  placeholder = 'Click to edit…',
  rows = 4,
}: EditableTextareaProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(value)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      const len = ref.current.value.length
      ref.current.setSelectionRange(len, len)
    }
  }, [editing])

  const startEdit = () => { setDraft(value); setError(null); setEditing(true) }
  const cancel    = () => { setDraft(value); setError(null); setEditing(false) }

  const commit = async () => {
    const trimmed = draft.trim()
    if (trimmed === value.trim()) { setEditing(false); return }
    setSaving(true); setError(null)
    const err = await onSave(trimmed)
    setSaving(false)
    if (err) { setError(err) } else {
      setEditing(false); setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); void commit() }
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={saving}
          rows={rows}
          className="font-sans text-[0.875rem] font-light text-charcoal bg-white border border-gold rounded-sm px-3 py-2 w-full outline-none resize-y leading-relaxed focus:ring-2 focus:ring-gold/20"
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
          <span className="text-[0.68rem] text-muted font-light ml-1">
            {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to save
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('relative cursor-pointer group/ta', className)}
      onClick={startEdit}
    >
      <p className={cn(
        'text-[0.875rem] font-light text-charcoal leading-relaxed whitespace-pre-line',
        'hover:bg-warm-gray/60 rounded-sm px-1 -mx-1 transition-colors',
        textClassName
      )}>
        {value || <span className="text-muted italic">{placeholder}</span>}
      </p>
      <span className="absolute top-0 right-0 flex items-center gap-1">
        {saved
          ? <CheckCircle2 size={12} className="text-green-600" />
          : <Pencil size={11} className="text-muted/50 hover:text-gold transition-colors duration-200" />
        }
      </span>
    </div>
  )
}
