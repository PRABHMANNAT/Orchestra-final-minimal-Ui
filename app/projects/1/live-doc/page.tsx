"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUp,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"

type Mode = "Auto" | "Confirm"
type ExportKey = "agent" | "backend" | "frontend" | "payments" | "diagram"
type SourceId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8" | "c9" | "c10"

type DocSection = {
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

const accent = "#B8543D"
const border = "rgba(26,22,18,0.08)"
const diagramCode = `flowchart LR
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

const sources: Record<SourceId, { author: string; time: string; date: string; location: string; content: string }> = {
  c1: { author: "Sarah Kim", time: "10:12 AM", date: "18 May 2026", location: "Slack #eng-billing thread \"context layer\"", content: "Keep the context layer focused on the billing confidence slice so agents do not pull stale product scope into implementation plans." },
  c2: { author: "Arun Kapoor", time: "3:41 PM", date: "18 May 2026", location: "Zoom transcript Northstar billing beta review", content: "A design partner should be able to dispute a line item using event_id, workspace_id, and invoice_preview_id without engineering querying Stripe." },
  c3: { author: "Marcus Thompson", time: "4:18 PM", date: "19 May 2026", location: "GitHub PR #418 northstar-cloud/api", content: "Invoice preview reads ledger state without calling Stripe directly. Stripe remains behind BillingPort." },
  c4: { author: "Priya Kaur", time: "9:05 AM", date: "20 May 2026", location: "Security review Linear SEC-117", content: "Tenant boundary checks must run before entitlement checks. Admin impersonation requires reason_code and impersonated_by audit stamps." },
  c5: { author: "Sarah Chen", time: "11:27 AM", date: "20 May 2026", location: "Slack #eng-billing thread \"webhook ordering\"", content: "A webhook unlock happens after ledger reconciliation succeeds, not from subscription state alone." },
  c6: { author: "Jess Wong", time: "2:16 PM", date: "21 May 2026", location: "Figma comment Billing surface v3", content: "Blocked product actions should read as plan limits, not errors, and link to the entitlement snapshot behind the decision." },
  c7: { author: "Sarah Kim", time: "5:44 PM", date: "21 May 2026", location: "Release plan Notion northstar/billing-beta", content: "Three design partners remain pinned to beta until replay, preview, retry, and entitlement dashboards pass the May 29 gate." },
  c8: { author: "Marcus Thompson", time: "1:03 PM", date: "22 May 2026", location: "Slack stale billing notes", content: "Direct Stripe entitlement reads and CSV-only invoice review are superseded and should stay available only for audit." },
  c9: { author: "Jess Wong", time: "4:22 PM", date: "22 May 2026", location: "northstar-cloud/web tailwind.config.ts + Figma comment", content: "Billing surface tokens: canvas, surface, primary text, muted text, and blue accent for the customer-facing design system." },
  c10: { author: "Marcus Thompson", time: "10:36 AM", date: "23 May 2026", location: "GitHub issue #431 northstar-cloud/api", content: "Rate limits should protect ingestion from noisy SDK clients while keeping invoice preview available." },
}

const initialSections: DocSection[] = [
  {
    id: "overview",
    body: "Northstar Cloud is a multi-tenant developer platform for usage-based billing, entitlement checks, and account-scoped analytics. The current build is the billing confidence slice: SDK usage events, ingestion hardening, ledger reconciliation, invoice preview, entitlement reads, and partner-facing billing UI. The context layer keeps only decisions that still affect implementation, rollout, or agent handoff.",
    highlight: "billing confidence slice",
    tags: ["agent", "backend", "frontend"],
    sourceIds: ["c1"],
  },
  {
    id: "goals",
    heading: "GOALS",
    body: "The launch goal is billing confidence, not feature breadth: every billable usage event must be traceable from SDK emit -> ingestion -> ledger row -> invoice preview before beta expansion. A design partner must be able to dispute a line item by giving support an event_id, workspace_id, and invoice_preview_id, and support must trace that path without asking engineering to query Stripe. Beta is blocked until replay, preview, webhook retry, and entitlement-read dashboards all agree on the same ledger snapshot.",
    highlight: "SDK emit -> ingestion -> ledger row -> invoice preview",
    tags: ["agent", "backend", "payments"],
    sourceIds: ["c2"],
  },
  {
    id: "backend-contracts",
    heading: "BACKEND CONTRACTS",
    body: "Stripe remains isolated behind BillingPort; no route, React loader, or invoice preview job may call Stripe directly. Ingestion writes immutable UsageEvent rows with idempotency_key, workspace_id, sdk_key_id, occurred_at, received_at, and raw_payload_hash; correction happens by appending reversal events, never by mutation. The ledger consumes only accepted events, invoice preview reads ledger state without calling Stripe directly, and reconciliation publishes entitlement_snapshot_id only after the ledger and Stripe adapter agree on period, plan, and customer mapping.",
    highlight: "Stripe remains isolated behind BillingPort",
    tags: ["agent", "backend", "payments"],
    sourceIds: ["c3"],
  },
  {
    id: "auth-tenancy",
    heading: "AUTH + TENANCY",
    body: "All API requests must carry account_id, workspace_id, actor_id, and role from signed session claims; clients never send tenant IDs as trusted body fields. Row-level checks happen before entitlement checks so a denied tenant boundary cannot leak plan state. Admin impersonation must stamp impersonated_by and reason_code on audit rows, and service-to-service jobs use workspace-scoped tokens with explicit job_type claims rather than global admin bypass.",
    highlight: "Row-level checks happen before entitlement checks",
    tags: ["agent", "backend", "frontend"],
    sourceIds: ["c4"],
  },
  {
    id: "payments-entitlements",
    heading: "PAYMENTS + ENTITLEMENTS",
    body: "Entitlements are evaluated from the ledger snapshot, not directly from Stripe webhooks. A payment webhook can unlock a plan only after ledger reconciliation succeeds, because a Stripe subscription state alone cannot prove usage period completeness. Failed payments freeze upgrades but do not disable already-granted beta access until the current entitlement_snapshot expires; downgrade effects are queued as pending_entitlement_change rows and applied at the next snapshot boundary.",
    highlight: "only after ledger reconciliation succeeds",
    tags: ["agent", "backend", "payments"],
    sourceIds: ["c5"],
  },
  {
    id: "rate-unsourced",
    body: "Rate limits should protect ingestion from noisy SDK clients without blocking invoice preview.",
    tags: ["agent", "backend"],
    sourceIds: [],
    authored: true,
  },
  {
    id: "data-model",
    heading: "DATA MODEL",
    body: "UsageEvent is the immutable ingestion fact table; LedgerEntry is the accounting projection; InvoicePreview is a read model keyed by ledger_snapshot_id; EntitlementSnapshot is the only source read by product gates. UsageEvent.raw_payload_hash and idempotency_key are unique per workspace and sdk_key_id, while LedgerEntry stores derived debit, credit, plan_code, unit_price_cents, and reversal_of_entry_id. Stripe customer/subscription IDs are adapter references, not product truth; the ledger snapshot is product truth after reconciliation.",
    highlight: "UsageEvent is the immutable ingestion fact table",
    tags: ["agent", "backend", "payments"],
    sourceIds: ["c3"],
  },
  {
    id: "errors",
    heading: "ERROR HANDLING + RETRIES",
    body: "Ingestion accepts valid events before downstream billing jobs run; invoice preview, reconciliation, and webhook retries must never block event capture. Webhook retries use capped exponential backoff at 1m, 5m, 20m, 2h, and 12h with a dead-letter record after the fifth failure. Idempotency conflicts return the original accepted event_id when the payload hash matches and raise a review exception when the key matches but the hash differs.",
    highlight: "must never block event capture",
    tags: ["agent", "backend"],
    sourceIds: ["c10"],
  },
  {
    id: "observability",
    heading: "OBSERVABILITY",
    body: "Every billing trace carries trace_id, workspace_id, sdk_key_id, event_id, ledger_snapshot_id, and invoice_preview_id from ingestion through preview render. Alert when accepted_usage_events minus ledger_entries is greater than 25 for ten minutes, webhook_dlq_count is non-zero for a design partner, or entitlement_snapshot_age exceeds fifteen minutes. Logs must redact raw payload properties by default and allow debug reveal only for internal workspaces.",
    highlight: "accepted_usage_events minus ledger_entries",
    tags: ["agent", "backend"],
    sourceIds: ["c10"],
  },
  {
    id: "rate-limiting",
    heading: "RATE LIMITING",
    body: "Rate limits protect ingestion and ledger freshness, not invoice preview. Public SDK ingestion allows 600 events per workspace per minute with a 2x burst bucket; replay jobs bypass public limits only through a signed internal queue token with job_type usage_replay. When a workspace is throttled, the API returns retry_after_ms and preserves idempotency keys so clients can safely retry without duplicate ledger entries.",
    highlight: "600 events per workspace per minute",
    tags: ["agent", "backend"],
    sourceIds: ["c10"],
  },
  {
    id: "deployment",
    heading: "DEPLOYMENT + ROLLOUT",
    body: "Rollout is feature-flagged by workspace: billing_ledger_v2, invoice_preview_v2, entitlement_snapshot_reads, and webhook_retry_dashboard. Three design partners remain pinned to beta until replay, preview, retry, and entitlement dashboards pass the May 29 gate; rollback disables entitlement_snapshot_reads first, then preview_v2, but never deletes accepted UsageEvent rows. Any migration that touches ledger math must ship with a replay fixture and a before/after invoice diff.",
    highlight: "rollback disables entitlement_snapshot_reads first",
    tags: ["agent", "backend", "payments"],
    sourceIds: ["c7"],
  },
  {
    id: "frontend",
    heading: "FRONTEND SURFACES",
    body: "The customer admin must show plan state, current usage, invoice preview, blocked actions, and the source event trail in one billing surface. The UI labels blocked features as plan limits, not errors, and every blocked action links to the entitlement_snapshot_id that caused it. Client state comes from /billing/summary and /invoice-preview, never from Stripe client SDK calls; optimistic UI is allowed for filter changes but not for plan unlocks.",
    highlight: "blocked features as plan limits, not errors",
    tags: ["agent", "frontend", "payments"],
    sourceIds: ["c6"],
  },
  {
    id: "roll-out",
    heading: "ROLL OUT",
    body: "Beta remains limited to three design partners until usage replay, invoice preview, and webhook retry dashboards all pass the May 29 release gate.",
    highlight: "May 29 release gate",
    tags: ["agent", "payments"],
    sourceIds: ["c7"],
  },
  { id: "design-system", heading: "DESIGN SYSTEM", body: "", tags: ["frontend"], sourceIds: ["c9"], design: true },
  {
    id: "stale",
    heading: "DROPPED AS STALE",
    body: "The old direct-Stripe entitlement path, CSV-only invoice review, and per-service billing widgets are explicitly superseded. They stay in sources for audit, not in exports.",
    tags: ["audit"],
    sourceIds: ["c8"],
    stale: true,
  },
  { id: "diagram", heading: "EXPORTABLE DIAGRAM", body: "", tags: ["agent", "diagram"], sourceIds: ["c3", "c5", "c10"], diagram: true },
]

const exportOptions: { key: ExportKey; label: string; lens: string; file: string }[] = [
  { key: "agent", label: "Agent context", lens: "Cursor / Claude Code handoff", file: "agent-context.md" },
  { key: "backend", label: "Backend", lens: "API, workers, ledger contracts", file: "backend.md" },
  { key: "frontend", label: "Frontend", lens: "Billing UI and product copy", file: "frontend.md" },
  { key: "payments", label: "Payments relevant", lens: "Custom lens for billing/payment work", file: "payments.md" },
  { key: "diagram", label: "Diagram", lens: "Mermaid architecture export", file: "billing-context.mmd" },
]

export default function LiveDocPage() {
  const [mode, setMode] = useState<Mode>("Auto")
  const [sections, setSections] = useState<DocSection[]>(initialSections)
  const [sourceRail, setSourceRail] = useState<SourceId[] | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const [activeExport, setActiveExport] = useState<ExportKey | null>(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(false)
  const [flashSection, setFlashSection] = useState<string | null>(null)
  const [review, setReview] = useState<"contradiction" | "confirmEdit" | "conflictEdit" | null>(null)

  const openSources = (ids: SourceId[]) => {
    setSourceRail((current) => current?.join(",") === ids.join(",") ? null : ids)
  }

  const convertToAuthored = (id: string, body: string) => {
    setSections((items) => items.map((item) => item.id === id ? { ...item, body, sourceIds: [], highlight: undefined, authored: true } : item))
  }

  const linkSource = () => {
    setSections((items) => items.map((item) => item.id === "rate-unsourced" ? { ...item, sourceIds: ["c10"], highlight: "Rate limits should protect ingestion", authored: false } : item))
    setSourceRail(["c10"])
  }

  const addSection = () => {
    setSections((items) => [
      ...items,
      { id: `authored-${Date.now()}`, body: "New authored context...", tags: ["agent"], sourceIds: [], authored: true },
    ])
  }

  const deleteSection = (id: string) => setSections((items) => items.filter((item) => item.id !== id))

  const triggerPrMerge = () => {
    setFlashSection("backend-contracts")
    setToast(true)
    window.setTimeout(() => setFlashSection(null), 1200)
    window.setTimeout(() => setToast(false), 4200)
  }

  const acceptEdit = () => {
    setSections((items) => [
      ...items,
      {
        id: `socrates-${Date.now()}`,
        heading: review === "confirmEdit" ? "RATE LIMITING" : undefined,
        body: review === "conflictEdit"
          ? "Invoice preview may call Stripe directly during beta when ledger reconciliation is delayed."
          : "Rate limiting should apply at ingestion per workspace and SDK key, with replay jobs exempted through a signed internal queue path.",
        tags: ["agent", "backend"],
        sourceIds: [],
        authored: true,
      },
    ])
    setReview(null)
  }

  useEffect(() => {
    const handleExport = (event: Event) => {
      const exportKey = (event as CustomEvent<{ exportKey: ExportKey }>).detail?.exportKey
      if (exportKey) setActiveExport(exportKey)
    }
    const handlePrompt = (event: Event) => {
      const prompt = (event as CustomEvent<{ prompt: string }>).detail?.prompt?.toLowerCase() || ""
      if (prompt.includes("stripe") || prompt.includes("billingport")) {
        setReview("conflictEdit")
        return
      }
      if (prompt.includes("add") || prompt.includes("edit") || prompt.includes("write")) {
        if (mode === "Auto") {
          setSections((items) => [
            ...items,
            {
              id: `socrates-${Date.now()}`,
              body: "Rate limiting should apply at ingestion per workspace and SDK key, with replay jobs exempted through a signed internal queue path.",
              tags: ["agent", "backend"],
              sourceIds: [],
              authored: true,
            },
          ])
        } else {
          setReview("confirmEdit")
        }
      }
    }
    window.addEventListener("live-doc-export", handleExport)
    window.addEventListener("live-doc-prompt", handlePrompt)
    return () => {
      window.removeEventListener("live-doc-export", handleExport)
      window.removeEventListener("live-doc-prompt", handlePrompt)
    }
  }, [mode])

  return (
    <div className="h-full w-full overflow-hidden bg-[#FAF8F5] text-[#1A1612]" onClick={() => setTooltip(null)} style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui" }}>
      <main className={`flex h-full min-w-0 flex-col transition-[margin] duration-300 ${sourceRail ? "mr-[340px]" : "mr-0"}`}>
        <TopBar mode={mode} setMode={setMode} onPrMerge={triggerPrMerge} onContradiction={() => setReview("contradiction")} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeExport ? (
            <ExportCanvas
              exportKey={activeExport}
              sections={sections}
              copied={copied}
              setCopied={setCopied}
              onClose={() => setActiveExport(null)}
            />
          ) : (
            <DocumentCanvas
              sections={sections}
              flashSection={flashSection}
              openSources={openSources}
              setTooltip={setTooltip}
              convertToAuthored={convertToAuthored}
              linkSource={linkSource}
              addSection={addSection}
              deleteSection={deleteSection}
            />
          )}
        </div>
      </main>

      {sourceRail && <SourceRail ids={sourceRail} onClose={() => setSourceRail(null)} />}
      {tooltip && <div className="fixed z-[80] -translate-x-1/2 rounded-md bg-[#1A1612] px-2.5 py-1.5 font-mono text-[10px] text-white" style={{ left: tooltip.x, top: tooltip.y - 38 }}>{tooltip.text}</div>}
      {review && <ReviewOverlay type={review} mode={mode} onDismiss={() => setReview(null)} onAccept={acceptEdit} />}
      {toast && <Toast />}
    </div>
  )
}

function SocratesPanel({ mode, onExport, onReview, onAppend }: { mode: Mode; onExport: (key: ExportKey) => void; onReview: (type: "confirmEdit" | "conflictEdit") => void; onAppend: (body: string) => void }) {
  const suggestions: { label: string; key: ExportKey }[] = [
    { label: "Agent context", key: "agent" },
    { label: "Backend", key: "backend" },
    { label: "Frontend", key: "frontend" },
    { label: "Payments relevant", key: "payments" },
    { label: "Diagram", key: "diagram" },
  ]
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; citation?: string; diagram?: boolean }[]>([])
  const [streaming, setStreaming] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % suggestions.length), 1800)
    return () => window.clearInterval(timer)
  }, [suggestions.length])

  const submit = () => {
    const prompt = input.trim()
    if (!prompt) return
    setMessages((items) => [...items, { role: "user", text: prompt }])
    setInput("")
    const lower = prompt.toLowerCase()
    if (lower.includes("diagram")) {
      onExport("diagram")
      setMessages((items) => [...items, { role: "assistant", text: "Opened the billing context diagram export.", citation: "SOURCE: GitHub PR #418 northstar-cloud/api", diagram: true }])
      return
    }
    if (lower.includes("stripe") || lower.includes("billingport")) {
      onReview("conflictEdit")
      return
    }
    if (lower.includes("add") || lower.includes("edit") || lower.includes("write")) {
      if (mode === "Auto") {
        onAppend("Rate limiting should apply at ingestion per workspace and SDK key, with replay jobs exempted through a signed internal queue path.")
      } else {
        onReview("confirmEdit")
      }
      return
    }
    setStreaming(true)
    window.setTimeout(() => {
      setStreaming(false)
      setMessages((items) => [...items, { role: "assistant", text: "Billing confidence is anchored on ledger-backed invoice preview, not Stripe state. The highest-risk handoff remains replay plus entitlement snapshot freshness.", citation: "SOURCE: Slack #eng-billing + PR #418" }])
    }, 700)
  }

  const suggestion = suggestions[index]
  return (
    <aside className="absolute left-0 top-0 z-40 flex h-full w-[300px] flex-col border-r border-[rgba(26,22,18,0.08)] bg-white">
      <div className="border-b border-[rgba(26,22,18,0.08)] px-5 py-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#B8543D]/10 text-[#B8543D]">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em]">SOCRATES</div>
        <div className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#78716C]">
          <span className="h-2 w-2 rounded-full bg-[#B8543D]" /> online
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col justify-center">
            <div className="font-serif text-[34px] leading-none">Ready.</div>
            <p className="mt-3 text-[13px] leading-5 text-[#78716C]">Ask about this project, its documents, or generate a diagram.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, i) => <ChatBubble key={`${message.text}-${i}`} message={message} />)}
            {streaming && <div className="w-fit rounded-2xl bg-[#FAF8F5] px-3 py-2 font-mono text-[12px] text-[#78716C]">•••</div>}
          </div>
        )}
      </div>
      <div className="border-t border-[rgba(26,22,18,0.08)] p-3">
        <button onClick={() => onExport(suggestion.key)} className="mb-3 w-full rounded-full border border-[rgba(26,22,18,0.08)] bg-[#FAF8F5] px-3 py-2 font-mono text-[11px] text-[#B8543D] transition hover:bg-[#B8543D]/10">
          {suggestion.label}
        </button>
        <div className="flex items-end gap-2 rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-[#FAF8F5] p-2">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit() } }} placeholder="Ask Socrates..." className="min-h-16 flex-1 resize-none bg-transparent px-1 py-1 text-[13px] outline-none placeholder:text-[#78716C]/60" />
          <button onClick={submit} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1A1612] text-white transition hover:bg-[#B8543D]"><ArrowUp className="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
  )
}

function ChatBubble({ message }: { message: { role: "user" | "assistant"; text: string; citation?: string; diagram?: boolean } }) {
  return (
    <div className={`rounded-[16px] px-3 py-2 text-[12px] leading-5 ${message.role === "user" ? "ml-8 bg-[#B8543D] text-white" : "mr-5 bg-[#FAF8F5] text-[#1A1612]"}`}>
      {message.text}
      {message.citation && <div className="mt-2 font-mono text-[10px] opacity-70">{message.citation}</div>}
      {message.diagram && <div className="mt-2 rounded-xl border border-[rgba(26,22,18,0.08)] bg-white p-2 font-mono text-[10px] text-[#78716C]">Mermaid diagram card · billing-context.mmd</div>}
    </div>
  )
}

function TopBar({ mode, setMode, onPrMerge, onContradiction }: { mode: Mode; setMode: (mode: Mode) => void; onPrMerge: () => void; onContradiction: () => void }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b-[1.5px] border-[rgba(26,22,18,0.08)] bg-[#FAF8F5] px-6">
      <div className="text-[13px] font-medium">Northstar Cloud · Context</div>
      <div className="flex items-center gap-3">
        <button onClick={onPrMerge} className="hidden rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-3 py-1.5 font-mono text-[10px] text-[#78716C] hover:text-[#B8543D] lg:block">PR #418 merged</button>
        <button onClick={onContradiction} className="hidden rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-3 py-1.5 font-mono text-[10px] text-[#78716C] hover:text-[#B8543D] lg:block">contradiction event</button>
        <div className="hidden text-[12px] text-[#78716C] xl:block">Contradictions always require confirm, even in Auto.</div>
        <div className="flex rounded-full border border-[rgba(26,22,18,0.08)] bg-white p-1">
          {(["Auto", "Confirm"] as Mode[]).map((item) => <button key={item} onClick={() => setMode(item)} className={`h-7 rounded-full px-4 text-[12px] transition ${mode === item ? "bg-[#B8543D] text-white" : "text-[#78716C] hover:bg-[#FAF8F5]"}`}>{item}</button>)}
        </div>
      </div>
    </header>
  )
}

function DocumentCanvas({ sections, flashSection, openSources, setTooltip, convertToAuthored, linkSource, addSection, deleteSection }: {
  sections: DocSection[]
  flashSection: string | null
  openSources: (ids: SourceId[]) => void
  setTooltip: (value: { text: string; x: number; y: number } | null) => void
  convertToAuthored: (id: string, body: string) => void
  linkSource: () => void
  addSection: () => void
  deleteSection: (id: string) => void
}) {
  return (
    <div className="mx-auto max-w-[1040px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-300 2xl:px-16 2xl:py-16">
      <div className="font-mono text-[11px] text-[#78716C]">CTX-2026.05.23</div>
      <h1 className="mt-3 max-w-[760px] text-[40px] font-semibold leading-[1.05] tracking-[-0.02em]">Current truth -&gt; export as anything</h1>
      <p className="mt-5 max-w-[760px] text-[14px] leading-6 text-[#78716C]">
        This is a curated current-truth context layer, not a wiki. Stale material is auditable via sources but excluded from generated exports.
      </p>
      <div className="mt-10 space-y-7">
        {sections.map((section, index) => (
          <DocSectionBlock
            key={section.id}
            section={section}
            index={index}
            flash={flashSection === section.id}
            openSources={openSources}
            setTooltip={setTooltip}
            convertToAuthored={convertToAuthored}
            linkSource={linkSource}
            deleteSection={deleteSection}
          />
        ))}
      </div>
      <button onClick={addSection} className="mt-8 rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-4 py-2 text-[13px] text-[#B8543D] hover:bg-[#B8543D]/10">
        Add section
      </button>
    </div>
  )
}

function DocSectionBlock({ section, index, flash, openSources, setTooltip, convertToAuthored, linkSource, deleteSection }: {
  section: DocSection
  index: number
  flash: boolean
  openSources: (ids: SourceId[]) => void
  setTooltip: (value: { text: string; x: number; y: number } | null) => void
  convertToAuthored: (id: string, body: string) => void
  linkSource: () => void
  deleteSection: (id: string) => void
}) {
  if (section.design) return <DesignSystemSection section={section} index={index} openSources={openSources} />
  if (section.diagram) return <DiagramSection section={section} index={index} openSources={openSources} />

  const sourceLocation = section.sourceIds[0] ? sources[section.sourceIds[0]].location : ""
  return (
    <section className={`group rounded-[16px] border border-transparent p-4 transition-all animate-in fade-in slide-in-from-bottom-2 ${flash ? "border-l-4 border-l-[#B8543D] bg-[#B8543D]/10" : "hover:border-[rgba(26,22,18,0.08)] hover:bg-white/55"}`} style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={linkSource} deleteSection={deleteSection} />
      {section.heading && <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1A1612]">{section.heading}</h2>}
      <p
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => convertToAuthored(section.id, event.currentTarget.innerText)}
        className="text-[16px] leading-[1.9] outline-none"
      >
        <HighlightedText text={section.body} highlight={section.highlight} sourceLocation={sourceLocation} setTooltip={setTooltip} openSources={() => section.sourceIds.length && openSources(section.sourceIds)} />
      </p>
      {section.stale && <div className="mt-3 font-mono text-[10px] text-[#78716C]">Stale policy: superseded content is linked for audit but excluded from generated exports.</div>}
    </section>
  )
}

function HighlightedText({ text, highlight, sourceLocation, setTooltip, openSources }: { text: string; highlight?: string; sourceLocation: string; setTooltip: (value: { text: string; x: number; y: number } | null) => void; openSources: () => void }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const [before, after] = text.split(highlight)
  return (
    <>
      {before}
      <mark
        onClick={(event) => {
          event.stopPropagation()
          setTooltip({ text: `SOURCE: ${sourceLocation}`, x: event.clientX, y: event.clientY })
          openSources()
        }}
        className="cursor-pointer rounded px-1 transition-colors bg-[#fff9c4] hover:bg-[#fff3a0]"
      >
        {highlight}
      </mark>
      {after}
    </>
  )
}

function SectionHoverPills({ section, openSources, linkSource, deleteSection }: { section: DocSection; openSources: (ids: SourceId[]) => void; linkSource: () => void; deleteSection: (id: string) => void }) {
  return (
    <div className="mb-3 hidden flex-wrap items-center gap-2 group-hover:flex">
      {section.tags.map((tag) => <span key={tag} className="rounded-full bg-[#FAF8F5] px-2 py-1 font-mono text-[10px] text-[#78716C]">{tag}</span>)}
      {section.authored && <span className="rounded-full bg-[#B8543D]/10 px-2 py-1 font-mono text-[10px] text-[#B8543D]">authored</span>}
      {section.sourceIds.length > 0 ? <button onClick={() => openSources(section.sourceIds)} className="rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-2 py-1 font-mono text-[10px] text-[#B8543D]">Source</button> : <button onClick={linkSource} className="rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-2 py-1 font-mono text-[10px] text-[#B8543D]">link source?</button>}
      {section.authored && <button onClick={() => deleteSection(section.id)} className="rounded-full border border-[rgba(26,22,18,0.08)] bg-white px-2 py-1 font-mono text-[10px] text-[#9E3B2E]"><Trash2 className="inline h-3 w-3" /> delete</button>}
    </div>
  )
}

function DesignSystemSection({ section, index, openSources }: { section: DocSection; index: number; openSources: (ids: SourceId[]) => void }) {
  const palette = [
    ["Canvas", "bg.canvas", "#F4F7FB"],
    ["Surface", "surface.base", "#FFFFFF"],
    ["Text", "text.primary", "#111827"],
    ["Muted", "text.muted", "#64748B"],
    ["Accent", "brand.accent", "#2563EB"],
  ]
  return (
    <section className="group rounded-[16px] p-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={() => undefined} deleteSection={() => undefined} />
      <h2 className="mb-4 font-mono text-[12px] font-semibold uppercase tracking-[0.16em]">DESIGN SYSTEM</h2>
      <div className="grid gap-3 md:grid-cols-5">
        {palette.map(([label, token, hex]) => <div key={token} className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-3"><div className="font-mono text-[10px] text-[#78716C]">{label}</div><div className="my-3 h-16 rounded-xl border border-[rgba(26,22,18,0.08)]" style={{ background: hex }} /><div className="font-mono text-[11px]">{hex}</div><div className="font-mono text-[10px] text-[#78716C]">{token}</div></div>)}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-4">
          <div className="flex justify-between"><div className="font-serif text-[22px]">Inter</div><button onClick={() => openSources(section.sourceIds)} className="rounded-full bg-[#B8543D]/10 px-2 py-1 font-mono text-[10px] text-[#B8543D]">Source</button></div>
          <div className="mt-2 font-mono text-[10px] text-[#78716C]">JetBrains Mono for metadata</div>
          <p className="mt-4 text-[18px]">Usage replay verified before entitlement unlock.</p>
          <div className="mt-4 font-mono text-[10px] text-[#78716C]">FREE · GOOGLE FONTS + JETBRAINS</div>
        </div>
        <div className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-4">
          <div className="font-serif text-[22px]">Tokens</div>
          <div className="mt-4 flex flex-wrap gap-2">{["radius.card: 10px", "radius.pill: 999px", "space: 4/8/12/16/24"].map((pill) => <span key={pill} className="rounded-full bg-[#FAF8F5] px-3 py-2 font-mono text-[11px]">{pill}</span>)}</div>
        </div>
      </div>
    </section>
  )
}

function DiagramSection({ section, index, openSources }: { section: DocSection; index: number; openSources: (ids: SourceId[]) => void }) {
  return (
    <section className="group rounded-[16px] p-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={() => undefined} deleteSection={() => undefined} />
      <div className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="font-serif text-[24px]">Billing context flow</h2><div className="font-mono text-[10px] text-[#78716C]">Diagram export</div></div>
          <span className="rounded-full bg-[#B8543D]/10 px-2 py-1 font-mono text-[10px] text-[#B8543D]">Mermaid</span>
        </div>
        <MermaidPreview />
        <pre className="mt-4 overflow-x-auto rounded-xl bg-[#FAF8F5] p-4 font-mono text-[12px] leading-6 text-[#1A1612]">{diagramCode}</pre>
      </div>
    </section>
  )
}

function MermaidPreview() {
  const nodes = ["SDK", "ING", "UE", "LEDGER", "SNAP", "PREVIEW", "RECON", "ENT", "UI", "OBS"]
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-[rgba(26,22,18,0.08)] bg-white p-4">
      <div className="flex min-w-[760px] items-center gap-2 font-mono text-[11px]">
        {nodes.map((node, i) => <div key={node} className="flex items-center gap-2">{i > 0 && <span className="text-[#B8543D]">→</span>}<span className="rounded-lg border border-[#B8543D] bg-[#E9EFEC] px-3 py-2 text-[#1A1612]">{node}</span></div>)}
      </div>
    </div>
  )
}

function SourceRail({ ids, onClose }: { ids: SourceId[]; onClose: () => void }) {
  return (
    <aside className="fixed right-0 top-0 z-50 h-full w-[340px] animate-in slide-in-from-right duration-200 overflow-y-auto border-l border-[rgba(26,22,18,0.08)] bg-[#FAF8F5] p-4">
      <div className="mb-4 flex h-10 items-center justify-between">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">SOURCES</div>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(26,22,18,0.08)] bg-white"><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3">
        {ids.map((id) => {
          const source = sources[id]
          return <div key={id} className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] font-semibold">{source.author}</div><div className="font-mono text-[10px] text-[#78716C]">{source.time}, {source.date}</div></div><span className="rounded-full bg-[#B8543D]/10 px-2 py-1 font-mono text-[10px] text-[#B8543D]">SOURCE</span></div><p className="mt-4 text-[13px] leading-6">{source.content}</p><div className="mt-4 font-mono text-[10px] italic text-[#78716C]">{source.location}</div></div>
        })}
      </div>
    </aside>
  )
}

function ExportCanvas({ exportKey, sections, copied, setCopied, onClose }: { exportKey: ExportKey; sections: DocSection[]; copied: boolean; setCopied: (value: boolean) => void; onClose: () => void }) {
  const option = exportOptions.find((item) => item.key === exportKey)!
  const content = useMemo(() => buildExport(exportKey, sections), [exportKey, sections])
  const copy = async () => {
    await navigator.clipboard?.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1300)
  }
  return (
    <div className="mx-auto max-w-[1040px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-200 2xl:px-16 2xl:py-16">
      <div className="rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div><div className="font-mono text-[11px] text-[#78716C]">{option.file}</div><h1 className="mt-1 font-serif text-[28px]">{option.label}</h1><div className="mt-1 text-[13px] text-[#78716C]">{option.lens}</div></div>
          <div className="flex gap-2"><button onClick={copy} className="flex h-9 items-center gap-2 rounded-full bg-[#1A1612] px-4 text-[12px] text-white"><Copy className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}</button><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(26,22,18,0.08)]"><X className="h-4 w-4" /></button></div>
        </div>
      </div>
      <div className="mt-4 rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white p-5">
        {exportKey === "diagram" ? <><MermaidPreview /><pre className="mt-4 overflow-x-auto rounded-xl bg-[#FAF8F5] p-4 font-mono text-[13px] leading-7">{content}</pre></> : <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-7">{content}</pre>}
      </div>
    </div>
  )
}

function buildExport(key: ExportKey, sections: DocSection[]) {
  if (key === "diagram") return diagramCode
  const tag = key === "payments" ? "payments" : key
  const exportable = sections.filter((section) => !section.stale && !section.design && !section.diagram && (key === "agent" || section.tags.includes(tag)))
  return exportable.map((section) => `${section.heading ? `## ${section.heading}\n` : ""}${section.body}`).join("\n\n")
}

function ReviewOverlay({ type, mode, onDismiss, onAccept }: { type: "contradiction" | "confirmEdit" | "conflictEdit"; mode: Mode; onDismiss: () => void; onAccept: () => void }) {
  const isConflict = type === "contradiction" || type === "conflictEdit"
  return (
    <div className="fixed left-[396px] right-10 top-20 z-[70] max-w-[900px] animate-in fade-in slide-in-from-top-3 rounded-[16px] border border-[#B8543D] bg-white p-5 shadow-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <div className="font-mono text-[11px] font-semibold text-[#B8543D]">{isConflict ? "NEEDS REVIEW" : "SOCRATES PROPOSED EDIT"}</div>
        <span className="rounded-full bg-[#B8543D]/10 px-2 py-1 font-mono text-[10px] text-[#B8543D]">{isConflict ? "contradicts prior decision" : mode}</span>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[#78716C]">
        {isConflict ? "Contradicts the accepted BillingPort boundary from PR #418, so it requires confirm even in Auto mode." : "Socrates drafted this as authored context without a confirmed source."}
      </p>
      {isConflict ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-[#FAF8F5] p-4"><div className="font-mono text-[10px] text-[#78716C]">Accepted decision</div><p className="mt-2 text-[13px] leading-5">Stripe remains isolated behind BillingPort; invoice preview reads ledger state without calling Stripe directly.</p></div>
          <div className="rounded-xl bg-[#FAF8F5] p-4"><div className="font-mono text-[10px] text-[#78716C]">Incoming source claim</div><p className="mt-2 text-[13px] leading-5">Allow invoice preview to call Stripe subscription state directly during beta.</p></div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-[#FAF8F5] p-4"><div className="font-mono text-[10px] text-[#78716C]">Preview title</div><p className="mt-2 text-[13px] font-semibold">Rate limiting</p><p className="mt-2 text-[13px] leading-5">Rate limiting should apply at ingestion per workspace and SDK key, with replay jobs exempted through a signed internal queue path.</p></div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] text-[#78716C]">Slack #eng-billing · Sarah Kim · "let preview call Stripe for beta?" · 11:08 AM</div>
        <div className="flex gap-2"><button onClick={onDismiss} className="h-9 rounded-full border border-[rgba(26,22,18,0.08)] px-4 text-[12px]">Dismiss</button><button onClick={onAccept} className="h-9 rounded-full bg-[#B8543D] px-4 text-[12px] text-white">Accept change</button></div>
      </div>
    </div>
  )
}

function Toast() {
  return (
    <div className="fixed bottom-6 right-6 z-[90] flex animate-in slide-in-from-bottom-3 items-center gap-3 rounded-[16px] border border-[rgba(26,22,18,0.08)] bg-white px-4 py-3 shadow-xl">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#B8543D]/10 text-[#B8543D]"><Check className="h-4 w-4" /></div>
      <div><div className="text-[13px] font-medium">Source changed · doc updated · exports regenerated</div><div className="flex items-center gap-1 font-mono text-[10px] text-[#78716C]">10:42 AM <RefreshCw className="h-3 w-3" /> agent, backend, payments, diagram</div></div>
    </div>
  )
}
