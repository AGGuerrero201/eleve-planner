import type { EventWorkflowStatus } from '@/types'

export const WORKFLOW_STATUS_LABELS: Record<EventWorkflowStatus, string> = {
  draft:       'Draft',
  in_progress: 'In Progress',
  finalized:   'Finalized',
  archived:    'Archived',
}

export const WORKFLOW_STATUS_ORDER: EventWorkflowStatus[] = [
  'draft',
  'in_progress',
  'finalized',
  'archived',
]