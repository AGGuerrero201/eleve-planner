# Edge Function: generate-event-plan

Complete setup and deployment guide for the Supabase Edge Function that
calls Claude Sonnet 4 to generate luxury event plans.

---

## Architecture

```
Browser (React)
  └─ supabase.functions.invoke('generate-event-plan', { body: formData })
       └─ Supabase Edge Function (Deno, runs on Supabase's global network)
            └─ POST https://api.anthropic.com/v1/messages
                 └─ Claude Sonnet 4 → structured JSON → back to browser
```

The Anthropic API key **never touches the browser**. It lives as a Supabase secret.

---

## Prerequisites

```bash
# Install the Supabase CLI
npm install -g supabase

# Verify
supabase --version
# Should print 1.x.x or higher
```

---

## Step 1 — Link your project

```bash
cd resident-event-ai

# Login to Supabase
supabase login

# Link to your project (find your project ref in Dashboard → Settings → General)
supabase link --project-ref your-project-ref
```

---

## Step 2 — Set the Anthropic API key as a secret

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Verify it was set:
```bash
supabase secrets list
# Should show ANTHROPIC_API_KEY  ****
```

Get your Anthropic API key from: https://console.anthropic.com → API Keys

---

## Step 3 — Deploy the function

```bash
supabase functions deploy generate-event-plan --no-verify-jwt
```

`--no-verify-jwt` lets the anon key call the function without a JWT.
This is safe because the function only reads the form data and calls Claude.

Expected output:
```
Deploying function generate-event-plan...
Done: https://your-project-ref.supabase.co/functions/v1/generate-event-plan
```

---

## Step 4 — Test the function

```bash
curl -X POST \
  https://your-project-ref.supabase.co/functions/v1/generate-event-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "formData": {
      "eventType": "Cocktail Reception",
      "budget": "$5,000 – $10,000",
      "attendance": "50 – 100 residents",
      "season": "Summer",
      "venue": "Outdoor",
      "alcohol": "Full bar",
      "demographic": "Young professionals (25–35)",
      "notes": "Rooftop terrace available"
    }
  }'
```

Expected response: a JSON object with `plan`, `generatedAt`, and `model` fields.

---

## Step 5 — Remove the old Vite proxy (optional cleanup)

Now that the Edge Function handles Claude, you can remove the Anthropic proxy
from `vite.config.ts` and the `VITE_ANTHROPIC_API_KEY` from `.env.local`:

In `vite.config.ts`, remove the `proxy` block:
```ts
// Remove this:
proxy: {
  '/api/anthropic': { ... }
}
```

In `.env.local`, remove:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

The Supabase client SDK (`supabase.functions.invoke`) handles routing automatically
using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, which you already have set.

---

## Function file structure

```
supabase/
└── functions/
    └── generate-event-plan/
        ├── index.ts        ← Main handler (Deno)
        └── deno.json       ← Compiler options
```

---

## Environment variables summary

| Variable | Where | Used For |
|----------|-------|----------|
| `ANTHROPIC_API_KEY` | Supabase Secret | Edge Function calls Claude |
| `VITE_SUPABASE_URL` | `.env.local` | Client connects to Supabase |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Client authenticates with Supabase |

---

## Updating the function

After editing `supabase/functions/generate-event-plan/index.ts`:

```bash
supabase functions deploy generate-event-plan --no-verify-jwt
```

Changes are live within ~10 seconds globally.

---

## Viewing logs

```bash
supabase functions logs generate-event-plan --tail
```

Or in the Supabase Dashboard → Edge Functions → generate-event-plan → Logs.

---

## Local development (optional)

You can run the function locally with:

```bash
supabase start          # Starts local Supabase stack
supabase functions serve generate-event-plan --env-file .env.local
```

Add to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

Then invoke locally:
```bash
curl -X POST http://localhost:54321/functions/v1/generate-event-plan \
  -H "Content-Type: application/json" \
  -d '{ "formData": { ... } }'
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ANTHROPIC_API_KEY secret is not set` | Run `supabase secrets set ANTHROPIC_API_KEY=...` |
| `FunctionsHttpError: 404` | Function not deployed — run `supabase functions deploy` |
| `FunctionsHttpError: 401` | Check your `VITE_SUPABASE_ANON_KEY` is the anon/public key |
| `Anthropic 529: overloaded` | The function retries automatically up to 3×; if persistent, wait a minute |
| `Failed to parse event plan` | Check function logs — Claude returned non-JSON (rare with system prompt) |
| CORS error in browser | Redeploy with `--no-verify-jwt`; confirm CORS headers in `index.ts` |
