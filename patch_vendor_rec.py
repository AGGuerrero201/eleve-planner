#!/usr/bin/env python3
"""
Inserts EventVendorPanel into EventPlanResult.tsx and EventDetailModal.tsx.
Safe — only runs if not already patched.
"""
import sys, os

project = sys.argv[1]

# ── File 1: EventPlanResult.tsx ───────────────────────────────────────────────

result_file = os.path.join(project, 'src/components/events/EventPlanResult.tsx')

with open(result_file, 'r') as f:
    content = f.read()

if 'EventVendorPanel' in content:
    print("EventPlanResult already patched — skipping")
else:
    # Add import after last import line
    import_line = "import { generateTempId } from '@/lib/utils'"
    new_import = "import { EventVendorPanel } from '@/components/vendors/EventVendorPanel'"
    content = content.replace(import_line, import_line + '\n' + new_import)

    # Insert panel between Pro Tip closing div and Actions comment
    insert_before = "        {/* Actions */}"
    panel_block = """        {/* Vendor Recommendations */}
        <EventVendorPanel formData={formData} />

        {/* Actions */}"""
    content = content.replace(insert_before, panel_block, 1)

    with open(result_file, 'w') as f:
        f.write(content)
    print("EventPlanResult.tsx patched")

# ── File 2: EventDetailModal.tsx ──────────────────────────────────────────────

modal_file = os.path.join(project, 'src/components/events/EventDetailModal.tsx')

with open(modal_file, 'r') as f:
    content = f.read()

if 'EventVendorPanel' in content:
    print("EventDetailModal already patched — skipping")
else:
    # Add import
    import_anchor = "import { formatDate, cn } from '@/lib/utils'"
    new_import = "import { EventVendorPanel } from '@/components/vendors/EventVendorPanel'"
    content = content.replace(import_anchor, import_anchor + '\n' + new_import)

    # Insert panel between Pro Tip block and Footer comment
    insert_before = "        {/* Footer */}"
    panel_block = """        {/* Vendor Recommendations */}
        {event && (
          <EventVendorPanel formData={{
            eventType:   event.meta.eventType,
            budget:      event.meta.budget,
            attendance:  event.meta.attendance,
            season:      event.meta.season,
            venue:       event.meta.venue,
            alcohol:     event.meta.alcohol,
            demographic: event.meta.demographic,
            notes:       '',
          }} compact />
        )}

        {/* Footer */}"""
    content = content.replace(insert_before, panel_block, 1)

    with open(modal_file, 'w') as f:
        f.write(content)
    print("EventDetailModal.tsx patched")

print("Done")
