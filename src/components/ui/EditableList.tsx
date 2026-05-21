/**
 * EditableList — editable array of strings.
 * Each item shows a pencil and trash icon always visible (no hover-only).
 * Click pencil or the item text to edit inline.
 * + Add item button at the bottom.
 */

import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, X, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableListProps {
  items: string[]
  onSave: (newItems: string[]) => Promise<string | null>
  bulletColor?: string
}

export function EditableList({ items, onSave, bulletColor = 'text-gold' }: EditableListProps) {
  const [list, setList]             = useState<string[]>(items)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [draft, setDraft]           = useState('')
  const [addingNew, setAddingNew]   = useState(false)
  const [newDraft, setNewDraft]     = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [lastSaved, setLastSaved]   = useState(items)

  // Sync if parent value changes while not editing
  if (items !== lastSaved && editingIdx === null && !addingNew) {
    setList(items)
    setLastSaved(items)
  }

  const persist = async (newList: string[]) => {
    setSaving(true); setError(null)
    const err = await onSave(newList)
    setSaving(false)
    if (err) { setError(err); setList(items); return false }
    setLastSaved(newList)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    return true
  }

  const startEdit  = (i: number) => { setEditingIdx(i); setDraft(list[i]); setError(null) }
  const cancelEdit = () => { setEditingIdx(null); setDraft('') }

  const commitEdit = async (i: number) => {
    const trimmed = draft.trim()
    if (!trimmed) return
    if (trimmed === list[i]) { cancelEdit(); return }
    const newList = list.map((item, idx) => idx === i ? trimmed : item)
    setList(newList)
    const ok = await persist(newList)
    if (ok) cancelEdit()
  }

  const deleteItem = async (i: number) => {
    const newList = list.filter((_, idx) => idx !== i)
    setList(newList)
    await persist(newList)
  }

  const commitNew = async () => {
    const trimmed = newDraft.trim()
    if (!trimmed) { setAddingNew(false); setNewDraft(''); return }
    const newList = [...list, trimmed]
    setList(newList)
    const ok = await persist(newList)
    if (ok) { setAddingNew(false); setNewDraft('') }
  }

  return (
    <div className="space-y-0.5">
      {list.map((item, i) => (
        <div key={i}>
          {editingIdx === i ? (
            <div className="flex flex-col gap-1.5 py-1">
              <input
                autoFocus
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void commitEdit(i)
                  if (e.key === 'Escape') cancelEdit()
                }}
                disabled={saving}
                className="font-sans text-[0.82rem] font-light text-charcoal bg-white border border-gold rounded-sm px-2.5 py-1.5 w-full outline-none focus:ring-2 focus:ring-gold/20"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void commitEdit(i)} disabled={saving}
                  className="flex items-center gap-1 text-[0.7rem] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-sm hover:bg-green-100 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={cancelEdit} disabled={saving}
                  className="flex items-center gap-1 text-[0.7rem] text-muted border border-border px-2 py-0.5 rounded-sm hover:bg-warm-gray disabled:opacity-50"
                >
                  <X size={10} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 py-1">
              <span className={cn('shrink-0 mt-0.5 font-light', bulletColor)}>—</span>
              <span
                className="flex-1 text-[0.875rem] text-charcoal font-light leading-relaxed cursor-pointer hover:text-charcoal/70 transition-colors"
                onClick={() => startEdit(i)}
              >
                {item}
              </span>
              <span className="shrink-0 flex items-center gap-1 ml-1">
                {saved && <CheckCircle2 size={11} className="text-green-600" />}
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  className="p-1 rounded text-muted/50 hover:text-gold transition-colors"
                  aria-label="Edit item"
                >
                  <Pencil size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => void deleteItem(i)}
                  disabled={saving}
                  className="p-1 rounded text-muted/50 hover:text-red-500 transition-colors disabled:opacity-40"
                  aria-label="Delete item"
                >
                  <Trash2 size={11} />
                </button>
              </span>
            </div>
          )}
        </div>
      ))}

      {error && <p className="text-[0.72rem] text-red-500 mt-1">{error}</p>}

      {addingNew ? (
        <div className="flex flex-col gap-1.5 pt-1.5">
          <input
            autoFocus
            type="text"
            value={newDraft}
            placeholder="New item…"
            onChange={(e) => setNewDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void commitNew()
              if (e.key === 'Escape') { setAddingNew(false); setNewDraft('') }
            }}
            disabled={saving}
            className="font-sans text-[0.82rem] font-light text-charcoal bg-white border border-gold rounded-sm px-2.5 py-1.5 w-full outline-none focus:ring-2 focus:ring-gold/20"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => void commitNew()} disabled={saving}
              className="flex items-center gap-1 text-[0.7rem] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-sm hover:bg-green-100 disabled:opacity-50"
            >
              {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
              {saving ? 'Saving…' : 'Add'}
            </button>
            <button
              onClick={() => { setAddingNew(false); setNewDraft('') }}
              className="flex items-center gap-1 text-[0.7rem] text-muted border border-border px-2 py-0.5 rounded-sm hover:bg-warm-gray"
            >
              <X size={10} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-1.5 text-[0.72rem] text-muted hover:text-gold transition-colors mt-2 py-0.5"
        >
          <Plus size={12} /> Add item
        </button>
      )}
    </div>
  )
}
