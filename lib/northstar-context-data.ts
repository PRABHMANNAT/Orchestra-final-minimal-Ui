export type Mode = "Auto" | "Confirm"
export type DecideSection = "Doc" | "Flowchart" | "History"
export type StatusSection = "Dashboard" | "Bus factor" | "Planned departure" | "Already gone"
export type ExportKey = "agent" | "backend" | "frontend" | "payments" | "diagram"
export type SourceId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8" | "c9" | "c10"

export type SourceRecord = {
  id: SourceId
  author: string
  time: string
  date: string
  location: string
  content: string
}

export type DocSection = {
  id: string
  heading?: string
  body: string
  highlight?: string
  tags: string[]
  sourceIds: SourceId[]
  authored?: boolean
  stale?: boolean
  design?: boolean
  diagram?: boolean
}

export type DecisionNode = {
  id: string
  title: string
  short: string
  decidedBy: string
  date: string
  sourceIds: SourceId[]
  state: "active" | "needs review" | "superseded"
  rationale: string
  highlight?: string
  supersedes?: string
  supersededBy?: string
  x: number
  y: number
}

export type DecisionEdge = {
  from: string
  to: string
  kind?: "dependency" | "supersedes"
}

export type HistoryEntry = {
  id: string
  decisionId: string
  title: string
  rationale: string
  highlight?: string
  who: string
  when: string
  sourceIds: SourceId[]
  status: "active" | "needs review" | "superseded"
  supersedes?: string
  supersededBy?: string
}

export type StatusChange = {
  id: string
  text: string
  who: string
  when: string
  sourceIds: SourceId[]
}

export const diagramCode = `flowchart LR
  SDK[SDK emit\\nworkspace + sdk key] --> ING[Ingestion API\\nvalidate + idempotency]
  ING --> UE[UsageEvent\\nimmutable fact]
  UE --> LEDGER[Ledger worker\\naccepted events only]
  LEDGER --> SNAP[LedgerSnapshot\\nperiod + customer + plan]
  SNAP --> PREVIEW[Invoice preview\\nread model]
  SNAP --> RECON[Reconciliation worker]
  STRIPE[Stripe webhooks] --> PORT[BillingPort adapter]
  PORT --> RECON
  RECON --> ENT[EntitlementSnapshot\\nproduct gates]
  ENT --> UI[Billing UI\\nplan limits + blocked actions]
  UE --> OBS[Observability\\ntrace + drift alerts]
  RECON --> OBS
  PREVIEW --> OBS`

export const sources: Record<SourceId, SourceRecord> = {
  c1: { id: "c1", author: "Sarah Kim", time: "10:12 AM", date: "18 May 2026", location: "Slack #eng-billing thread \"context layer\"", content: "Keep the context layer focused on the billing confidence slice so agents do not pull stale product scope into implementation plans." },
  c2: { id: "c2", author: "Arun Kapoor", time: "3:41 PM", date: "18 May 2026", location: "Zoom transcript Northstar billing beta review", content: "A design partner should be able to dispute a line item using event_id, workspace_id, and invoice_preview_id without engineering querying Stripe." },
  c3: { id: "c3", author: "Marcus Thompson", time: "4:18 PM", date: "19 May 2026", location: "GitHub PR #418 northstar-cloud/api", content: "Invoice preview reads ledger state without calling Stripe directly. Stripe remains behind BillingPort." },
  c4: { id: "c4", author: "Priya Kaur", time: "9:05 AM", date: "20 May 2026", location: "Security review Linear SEC-117", content: "Tenant boundary checks must run before entitlement checks. Admin impersonation requires reason_code and impersonated_by audit stamps." },
  c5: { id: "c5", author: "Sarah Chen", time: "11:27 AM", date: "20 May 2026", location: "Slack #eng-billing thread \"webhook ordering\"", content: "A webhook unlock happens after ledger reconciliation succeeds, not from subscription state alone." },
  c6: { id: "c6", author: "Jess Wong", time: "2:16 PM", date: "21 May 2026", location: "Figma comment Billing surface v3", content: "Blocked product actions should read as plan limits, not errors, and link to the entitlement snapshot behind the decision." },
  c7: { id: "c7", author: "Sarah Kim", time: "5:44 PM", date: "21 May 2026", location: "Release plan Notion northstar/billing-beta", content: "Three design partners remain pinned to beta until replay, preview, retry, and entitlement dashboards pass the May 29 gate." },
  c8: { id: "c8", author: "Marcus Thompson", time: "1:03 PM", date: "22 May 2026", location: "Slack stale billing notes", content: "Direct Stripe entitlement reads and CSV-only invoice review are superseded and should stay available only for audit." },
  c9: { id: "c9", author: "Jess Wong", time: "4:22 PM", date: "22 May 2026", location: "northstar-cloud/web tailwind.config.ts + Figma comment", content: "Billing surface tokens: canvas, surface, primary text, muted text, and blue accent for the customer-facing design system." },
  c10: { id: "c10", author: "Marcus Thompson", time: "10:36 AM", date: "23 May 2026", location: "GitHub issue #431 northstar-cloud/api", content: "Rate limits should protect ingestion from noisy SDK clients while keeping invoice preview available." },
}

export const initialSections: DocSection[] = [
  { id: "overview", body: "Northstar Cloud is a multi-tenant developer platform for usage-based billing, entitlement checks, and account-scoped analytics. The current build is the billing confidence slice: SDK usage events, ingestion hardening, ledger reconciliation, invoice preview, entitlement reads, and partner-facing billing UI. The context layer keeps only decisions that still affect implementation, rollout, or agent handoff.", highlight: "billing confidence slice", tags: ["agent", "backend", "frontend"], sourceIds: ["c1"] },
  { id: "goals", heading: "GOALS", body: "The launch goal is billing confidence, not feature breadth: every billable usage event must be traceable from SDK emit -> ingestion -> ledger row -> invoice preview before beta expansion. A design partner must be able to dispute a line item by giving support an event_id, workspace_id, and invoice_preview_id, and support must trace that path without asking engineering to query Stripe. Beta is blocked until replay, preview, webhook retry, and entitlement-read dashboards all agree on the same ledger snapshot.", highlight: "SDK emit -> ingestion -> ledger row -> invoice preview", tags: ["agent", "backend", "payments"], sourceIds: ["c2"] },
  { id: "backend-contracts", heading: "BACKEND CONTRACTS", body: "Stripe remains isolated behind BillingPort; no route, React loader, or invoice preview job may call Stripe directly. Ingestion writes immutable UsageEvent rows with idempotency_key, workspace_id, sdk_key_id, occurred_at, received_at, and raw_payload_hash; correction happens by appending reversal events, never by mutation. The ledger consumes only accepted events, invoice preview reads ledger state without calling Stripe directly, and reconciliation publishes entitlement_snapshot_id only after the ledger and Stripe adapter agree on period, plan, and customer mapping.", highlight: "Stripe remains isolated behind BillingPort", tags: ["agent", "backend", "payments"], sourceIds: ["c3"] },
  { id: "auth-tenancy", heading: "AUTH + TENANCY", body: "All API requests must carry account_id, workspace_id, actor_id, and role from signed session claims; clients never send tenant IDs as trusted body fields. Row-level checks happen before entitlement checks so a denied tenant boundary cannot leak plan state. Admin impersonation must stamp impersonated_by and reason_code on audit rows, and service-to-service jobs use workspace-scoped tokens with explicit job_type claims rather than global admin bypass.", highlight: "Row-level checks happen before entitlement checks", tags: ["agent", "backend", "frontend"], sourceIds: ["c4"] },
  { id: "payments-entitlements", heading: "PAYMENTS + ENTITLEMENTS", body: "Entitlements are evaluated from the ledger snapshot, not directly from Stripe webhooks. A payment webhook can unlock a plan only after ledger reconciliation succeeds, because a Stripe subscription state alone cannot prove usage period completeness. Failed payments freeze upgrades but do not disable already-granted beta access until the current entitlement_snapshot expires; downgrade effects are queued as pending_entitlement_change rows and applied at the next snapshot boundary.", highlight: "only after ledger reconciliation succeeds", tags: ["agent", "backend", "payments"], sourceIds: ["c5"] },
  { id: "rate-unsourced", body: "Rate limits should protect ingestion from noisy SDK clients without blocking invoice preview.", tags: ["agent", "backend"], sourceIds: [], authored: true },
  { id: "data-model", heading: "DATA MODEL", body: "UsageEvent is the immutable ingestion fact table; LedgerEntry is the accounting projection; InvoicePreview is a read model keyed by ledger_snapshot_id; EntitlementSnapshot is the only source read by product gates. UsageEvent.raw_payload_hash and idempotency_key are unique per workspace and sdk_key_id, while LedgerEntry stores derived debit, credit, plan_code, unit_price_cents, and reversal_of_entry_id. Stripe customer/subscription IDs are adapter references, not product truth; the ledger snapshot is product truth after reconciliation.", highlight: "UsageEvent is the immutable ingestion fact table", tags: ["agent", "backend", "payments"], sourceIds: ["c3"] },
  { id: "errors", heading: "ERROR HANDLING + RETRIES", body: "Ingestion accepts valid events before downstream billing jobs run; invoice preview, reconciliation, and webhook retries must never block event capture. Webhook retries use capped exponential backoff at 1m, 5m, 20m, 2h, and 12h with a dead-letter record after the fifth failure. Idempotency conflicts return the original accepted event_id when the payload hash matches and raise a review exception when the key matches but the hash differs.", highlight: "must never block event capture", tags: ["agent", "backend"], sourceIds: ["c10"] },
  { id: "observability", heading: "OBSERVABILITY", body: "Every billing trace carries trace_id, workspace_id, sdk_key_id, event_id, ledger_snapshot_id, and invoice_preview_id from ingestion through preview render. Alert when accepted_usage_events minus ledger_entries is greater than 25 for ten minutes, webhook_dlq_count is non-zero for a design partner, or entitlement_snapshot_age exceeds fifteen minutes. Logs must redact raw payload properties by default and allow debug reveal only for internal workspaces.", highlight: "accepted_usage_events minus ledger_entries", tags: ["agent", "backend"], sourceIds: ["c10"] },
  { id: "rate-limiting", heading: "RATE LIMITING", body: "Rate limits protect ingestion and ledger freshness, not invoice preview. Public SDK ingestion allows 600 events per workspace per minute with a 2x burst bucket; replay jobs bypass public limits only through a signed internal queue token with job_type usage_replay. When a workspace is throttled, the API returns retry_after_ms and preserves idempotency keys so clients can safely retry without duplicate ledger entries.", highlight: "600 events per workspace per minute", tags: ["agent", "backend"], sourceIds: ["c10"] },
  { id: "deployment", heading: "DEPLOYMENT + ROLLOUT", body: "Rollout is feature-flagged by workspace: billing_ledger_v2, invoice_preview_v2, entitlement_snapshot_reads, and webhook_retry_dashboard. Three design partners remain pinned to beta until replay, preview, retry, and entitlement dashboards pass the May 29 gate; rollback disables entitlement_snapshot_reads first, then preview_v2, but never deletes accepted UsageEvent rows. Any migration that touches ledger math must ship with a replay fixture and a before/after invoice diff.", highlight: "rollback disables entitlement_snapshot_reads first", tags: ["agent", "backend", "payments"], sourceIds: ["c7"] },
  { id: "frontend", heading: "FRONTEND SURFACES", body: "The customer admin must show plan state, current usage, invoice preview, blocked actions, and the source event trail in one billing surface. The UI labels blocked features as plan limits, not errors, and every blocked action links to the entitlement_snapshot_id that caused it. Client state comes from /billing/summary and /invoice-preview, never from Stripe client SDK calls; optimistic UI is allowed for filter changes but not for plan unlocks.", highlight: "blocked features as plan limits, not errors", tags: ["agent", "frontend", "payments"], sourceIds: ["c6"] },
  { id: "roll-out", heading: "ROLL OUT", body: "Beta remains limited to three design partners until usage replay, invoice preview, and webhook retry dashboards all pass the May 29 release gate.", highlight: "May 29 release gate", tags: ["agent", "payments"], sourceIds: ["c7"] },
  { id: "design-system", heading: "DESIGN SYSTEM", body: "", tags: ["frontend"], sourceIds: ["c9"], design: true },
  { id: "stale", heading: "DROPPED AS STALE", body: "The old direct-Stripe entitlement path, CSV-only invoice review, and per-service billing widgets are explicitly superseded. They stay in sources for audit, not in exports.", tags: ["audit"], sourceIds: ["c8"], stale: true },
  { id: "diagram", heading: "EXPORTABLE DIAGRAM", body: "", tags: ["agent", "diagram"], sourceIds: ["c3", "c5", "c10"], diagram: true },
]

export const exportOptions: { key: ExportKey; label: string; lens: string; file: string }[] = [
  { key: "agent", label: "Agent context", lens: "Cursor / Claude Code handoff", file: "agent-context.md" },
  { key: "backend", label: "Backend", lens: "API, workers, ledger contracts", file: "backend.md" },
  { key: "frontend", label: "Frontend", lens: "Billing UI and product copy", file: "frontend.md" },
  { key: "payments", label: "Payments relevant", lens: "Custom lens for billing/payment work", file: "payments.md" },
  { key: "diagram", label: "Diagram", lens: "Mermaid architecture export", file: "billing-context.mmd" },
]

export const decisionNodes: DecisionNode[] = [
  { id: "usageevent", title: "UsageEvent is immutable ingestion fact table", short: "UsageEvent immutable", decidedBy: "Marcus Thompson", date: "19 May 2026", sourceIds: ["c3"], state: "active", rationale: "Immutable UsageEvent rows let support trace SDK usage to ledger state without mutating facts.", highlight: "immutable UsageEvent rows", x: 300, y: 86 },
  { id: "ledger", title: "Ledger worker reconciles", short: "Ledger worker reconciles", decidedBy: "Marcus Thompson", date: "19 May 2026", sourceIds: ["c3"], state: "active", rationale: "The ledger consumes accepted events only so invoice preview can read product truth.", highlight: "accepted events only", x: 560, y: 86 },
  { id: "preview", title: "Invoice preview", short: "Invoice preview", decidedBy: "Marcus Thompson", date: "19 May 2026", sourceIds: ["c3"], state: "active", rationale: "Invoice preview reads ledger state without calling Stripe directly.", highlight: "without calling Stripe directly", x: 820, y: 86 },
  { id: "billingport", title: "BillingPort boundary", short: "BillingPort boundary", decidedBy: "Marcus Thompson", date: "19 May 2026", sourceIds: ["c3"], state: "needs review", rationale: "No route, React loader, or preview job may call Stripe directly.", highlight: "may call Stripe directly", x: 300, y: 294 },
  { id: "stripe-adapter", title: "Stripe adapter isolation", short: "Stripe adapter isolation", decidedBy: "Sarah Chen", date: "20 May 2026", sourceIds: ["c5"], state: "active", rationale: "Stripe subscription state alone cannot prove usage period completeness.", highlight: "cannot prove usage period completeness", x: 560, y: 294 },
  { id: "tenant-first", title: "Row-level checks before entitlement checks", short: "Row-level before entitlement", decidedBy: "Priya Kaur", date: "20 May 2026", sourceIds: ["c4"], state: "active", rationale: "Row-level checks happen before entitlement checks so tenant boundaries cannot leak plan state.", highlight: "before entitlement checks", x: 300, y: 502 },
  { id: "rate-limit", title: "Rate limit 600 events / workspace / min at ingestion", short: "Rate limit 600 / wkspc / min", decidedBy: "Marcus Thompson", date: "23 May 2026", sourceIds: ["c10"], state: "active", rationale: "Public SDK ingestion allows 600 events per workspace per minute with a 2x burst bucket.", highlight: "600 events per workspace per minute", x: 40, y: 86 },
  { id: "entitlements", title: "Entitlement snapshot reads", short: "Entitlement snapshot reads", decidedBy: "Sarah Chen", date: "20 May 2026", sourceIds: ["c5"], state: "active", rationale: "Entitlements are evaluated from the ledger snapshot, not directly from Stripe webhooks.", highlight: "ledger snapshot", x: 560, y: 502 },
  { id: "rollout", title: "May 29 rollout gate", short: "May 29 rollout gate", decidedBy: "Sarah Kim", date: "21 May 2026", sourceIds: ["c7"], state: "active", rationale: "Three design partners remain pinned until replay, preview, retry, and entitlement dashboards pass the May 29 gate.", highlight: "May 29 gate", x: 820, y: 502 },
  { id: "stale-stripe", title: "Direct Stripe entitlement path", short: "Direct Stripe entitlement path", decidedBy: "Marcus Thompson", date: "22 May 2026", sourceIds: ["c8"], state: "superseded", rationale: "The old direct-Stripe entitlement path is kept for audit and excluded from exports.", supersededBy: "billingport", x: 40, y: 294 },
]

export const decisionEdges: DecisionEdge[] = [
  { from: "usageevent", to: "ledger" },
  { from: "ledger", to: "preview" },
  { from: "ledger", to: "entitlements" },
  { from: "tenant-first", to: "entitlements" },
  { from: "billingport", to: "stripe-adapter" },
  { from: "rate-limit", to: "usageevent" },
  { from: "entitlements", to: "rollout" },
  { from: "stripe-adapter", to: "preview" },
  { from: "stale-stripe", to: "billingport", kind: "supersedes" },
]

export const historyEntries: HistoryEntry[] = [
  { id: "h-pr418", decisionId: "preview", title: "PR #418 merged: invoice preview reads ledger state", rationale: "Source changed, doc updated, and exports regenerated after PR #418 confirmed preview reads ledger state.", highlight: "exports regenerated", who: "Marcus Thompson", when: "23 May 2026 · 10:42 AM", sourceIds: ["c3"], status: "active", supersedes: "stale-stripe" },
  { id: "h-rate", decisionId: "rate-limit", title: "Rate limits protect ingestion and ledger freshness", rationale: "Public SDK ingestion allows 600 events per workspace per minute while replay uses a signed internal queue token.", highlight: "600 events per workspace per minute", who: "Marcus Thompson", when: "23 May 2026 · 10:36 AM", sourceIds: ["c10"], status: "active" },
  { id: "h-stale", decisionId: "stale-stripe", title: "Direct Stripe entitlement path dropped as stale", rationale: "The old direct-Stripe entitlement path, CSV-only invoice review, and per-service billing widgets are explicitly superseded.", highlight: "explicitly superseded", who: "Marcus Thompson", when: "22 May 2026 · 1:03 PM", sourceIds: ["c8"], status: "superseded", supersededBy: "billingport" },
  { id: "h-design", decisionId: "frontend", title: "Billing surface tokens captured", rationale: "Jess captured the customer-facing palette and confirmed blocked features read as plan limits, not errors.", highlight: "plan limits, not errors", who: "Jess Wong", when: "22 May 2026 · 4:22 PM", sourceIds: ["c9", "c6"], status: "active" },
  { id: "h-rollout", decisionId: "rollout", title: "May 29 release gate set", rationale: "Three design partners remain pinned to beta until replay, preview, retry, and entitlement dashboards pass the May 29 gate.", highlight: "May 29 gate", who: "Sarah Kim", when: "21 May 2026 · 5:44 PM", sourceIds: ["c7"], status: "active" },
  { id: "h-webhook", decisionId: "entitlements", title: "Webhook unlock waits for reconciliation", rationale: "A payment webhook can unlock a plan only after ledger reconciliation succeeds.", highlight: "only after ledger reconciliation succeeds", who: "Sarah Chen", when: "20 May 2026 · 11:27 AM", sourceIds: ["c5"], status: "active" },
  { id: "h-security", decisionId: "tenant-first", title: "Tenant boundary before entitlement check", rationale: "Row-level checks happen before entitlement checks so tenant boundaries cannot leak plan state.", highlight: "before entitlement checks", who: "Priya Kaur", when: "20 May 2026 · 9:05 AM", sourceIds: ["c4"], status: "active" },
  { id: "h-beta", decisionId: "goals", title: "Billing confidence defined as launch goal", rationale: "A partner can dispute a line item by giving support event_id, workspace_id, and invoice_preview_id.", highlight: "event_id, workspace_id, and invoice_preview_id", who: "Arun Kapoor", when: "18 May 2026 · 3:41 PM", sourceIds: ["c2"], status: "active" },
]

export const statusChanges: StatusChange[] = [
  { id: "s1", text: "Invoice previews now use Northstar's own ledger, not Stripe's live state; exports were regenerated.", who: "Marcus Thompson", when: "10:42 AM", sourceIds: ["c3"] },
  { id: "s2", text: "Usage intake now has a safety cap, so noisy SDK clients cannot flood billing calculations.", who: "Marcus Thompson", when: "10:36 AM", sourceIds: ["c10"] },
  { id: "s3", text: "The customer billing screen's colors and copy rules were captured from design, not guessed.", who: "Jess Wong", when: "yesterday", sourceIds: ["c9"] },
  { id: "s4", text: "Plan unlocks now wait until billing catches up, so customers do not see access before usage is reconciled.", who: "Sarah Chen", when: "2d ago", sourceIds: ["c5"] },
  { id: "s5", text: "Tenant checks happen before plan checks, so one customer cannot learn another customer's plan state.", who: "Priya Kaur", when: "3d ago", sourceIds: ["c4"] },
]

export const busFactorRows = [
  { area: "Billing safety logic", owner: "Marcus Thompson", lastTouched: "23 May 2026", risk: "Only Marcus has changed how Northstar keeps Stripe behind a safe boundary.", sourceIds: ["c3"] as SourceId[], highRisk: true },
  { area: "Billing catch-up worker", owner: "Arun Kapoor", lastTouched: "18 May 2026", risk: "Arun holds the reasoning for tracing disputed bills through ledger snapshots.", sourceIds: ["c2"] as SourceId[], highRisk: true },
  { area: "Usage replay path", owner: "Marcus Thompson", lastTouched: "23 May 2026", risk: "Only one issue explains how to rerun usage safely without double-counting.", sourceIds: ["c10"] as SourceId[], highRisk: true },
  { area: "Customer boundary checks", owner: "Priya Kaur", lastTouched: "20 May 2026", risk: "The rule is documented, but another reviewer should know why tenant checks happen first.", sourceIds: ["c4"] as SourceId[], highRisk: false },
  { area: "Frontend billing UI", owner: "Jess Wong", lastTouched: "22 May 2026", risk: "Design rationale is captured, but Jess is still the person tying tokens to customer-facing copy.", sourceIds: ["c9", "c6"] as SourceId[], highRisk: false },
  { area: "Plan unlock ordering", owner: "Sarah Chen", lastTouched: "20 May 2026", risk: "The source says when access unlocks, but the fallback path needs a second owner.", sourceIds: ["c5"] as SourceId[], highRisk: false },
]

export const ownershipConcentrationRows = [
  { label: "Billing safety logic", people: 1, highRisk: true },
  { label: "Ingestion", people: 3, highRisk: false },
  { label: "Frontend billing UI", people: 2, highRisk: false },
  { label: "Customer boundary checks", people: 2, highRisk: false },
  { label: "Plan unlock ordering", people: 2, highRisk: false },
]

export const plannedDepartureRationale = [
  {
    title: "Invoice previews use Northstar's ledger, not Stripe directly",
    detail: "This keeps customers from seeing bills based on incomplete Stripe state (BillingPort boundary, PR #418).",
    sourceIds: ["c3"] as SourceId[],
  },
  {
    title: "Rate limits protect billing accuracy",
    detail: "Caps how fast usage can flood in (600/workspace/min) so billing stays accurate; internal replays bypass the cap safely.",
    sourceIds: ["c10"] as SourceId[],
  },
  {
    title: "Old direct-Stripe paths are audit-only",
    detail: "Some code looks tempting to reuse, but it was explicitly superseded and should stay out of exports.",
    sourceIds: ["c8"] as SourceId[],
  },
  {
    title: "Usage must be traceable from event to invoice",
    detail: "Support can resolve a disputed bill with event_id, workspace_id, and invoice_preview_id instead of asking engineering to query Stripe.",
    sourceIds: ["c2"] as SourceId[],
  },
]

export const plannedDepartureQuestions = [
  {
    title: "What happens to billing if Stripe's events arrive out of order?",
    detail: "Only Marcus knows how the system recovers (BillingPort failure handling).",
  },
  {
    title: "Why usage tracking must never wait on billing",
    detail: "If this rule is lost, someone could \"fix\" it and silently drop customer usage (UsageEvent ingestion).",
  },
  {
    title: "The exact order to undo the launch if it goes wrong on May 29",
    detail: "Get the sequence wrong and customers get double-charged.",
  },
  {
    title: "What the customer sees on their invoice when billing is still catching up",
    detail: "Delayed reconciliation decides whether preview is ready or still waiting.",
  },
  {
    title: "Which old billing code is safe to delete after launch",
    detail: "And which looks dead but is not (legacy Stripe paths).",
  },
  {
    title: "The rules for safely re-running usage data",
    detail: "Replays cannot be faked or double-counted (usage_replay queue tokens).",
  },
]

export const predecessorPack = [
  "Start with why invoice previews use the ledger, not Stripe directly (PR #418).",
  "Trace one customer usage event from intake to invoice preview (UsageEvent -> LedgerEntry -> InvoicePreview).",
  "Read the tenant-boundary review before changing who can see plan state (SEC-117).",
  "Understand why plan unlock waits until billing catches up (webhook ordering).",
  "Read the rate-limit note before changing public usage intake (GitHub issue #431).",
  "Open stale billing notes so old direct-Stripe paths do not come back by accident.",
  "Compare the Figma billing surface with the actual product copy before changing labels.",
  "Read the May 29 release gate before touching rollout flags.",
]
