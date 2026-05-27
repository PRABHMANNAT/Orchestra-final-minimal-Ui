"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GitCommit, Github, MessageSquare, FileText, X, ExternalLink, GitMerge, ArrowUpRight } from "lucide-react"

export type VizKey = "rationale" | "pr-antler" | "ship-report"

// ─── Canvas wrapper ─────────────────────────────────────────────────────────

export function VizFrame({ children, title, kicker }: { children: React.ReactNode; title: string; kicker: string }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full w-full flex-col overflow-y-auto px-10 py-10 2xl:px-14"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--chat-muted)]">{kicker}</div>
      <h2 className="mt-2 max-w-[640px] text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-[var(--chat-text)]">{title}</h2>
      <div className="mt-8 flex-1">{children}</div>
    </motion.div>
  )
}

// ─── Rationale ──────────────────────────────────────────────────────────────

const RATIONALE_COMMITS = [
  { sha: "9f4c2b", author: "alex.rivera", when: "4h ago", message: "Harden replay path for failed deliveries" },
  { sha: "3e8a1d", author: "marcus.t", when: "2d ago", message: "Add idempotency keys per workspace" },
  { sha: "f01938", author: "sarah.kim", when: "5d ago", message: "Move retry queue to BullMQ" },
  { sha: "a72ee0", author: "alex.rivera", when: "8d ago", message: "Drop in-memory retry buffer" },
  { sha: "1c89b4", author: "marcus.t", when: "12d ago", message: "RFC: queue-based webhook delivery" },
]

const CHANGE_DENSITY = [1, 0, 2, 1, 3, 0, 1, 4, 2, 1, 5, 3, 2, 0, 1, 3, 6, 4, 2, 1, 0, 2, 3, 5, 4, 6, 3, 2, 4, 7]

export function RationaleViz() {
  const max = Math.max(...CHANGE_DENSITY)
  return (
    <VizFrame kicker="Code rationale · /webhooks/stripe" title="Why does this code exist, and who decided it.">
      <div className="grid gap-8">
        <section>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">Recent commits</div>
          <div className="mt-3 border-t border-[var(--chat-border)]">
            {RATIONALE_COMMITS.map((commit, index) => (
              <motion.div
                key={commit.sha}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[88px_1fr_120px] items-center gap-4 border-b border-[var(--chat-border)] py-3"
              >
                <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--chat-muted)]">
                  <GitCommit className="h-3 w-3" />
                  {commit.sha}
                </div>
                <div className="truncate text-[13px] text-[var(--chat-text)]">{commit.message}</div>
                <div className="text-right font-mono text-[10px] text-[var(--chat-muted)]">{commit.author} · {commit.when}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">Change density · 30d</div>
          <div className="mt-3 flex h-20 items-end gap-[3px]">
            {CHANGE_DENSITY.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(value / max) * 100}%` }}
                transition={{ delay: 0.25 + index * 0.015, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 rounded-sm bg-[var(--chat-accent)]"
                style={{ opacity: value === 0 ? 0.12 : 0.55 + (value / max) * 0.45 }}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[14px] border border-[var(--chat-border)] bg-[var(--chat-chip)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">Why this exists</div>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--chat-text)]">
            Moved from inline retries to a BullMQ-backed queue so workers can restart without dropping events.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[10px] text-[var(--chat-muted)]">
            <span className="rounded-full border border-[var(--chat-border)] px-2 py-1">ADR-014</span>
            <span>Decided by Marcus Thompson · ratified in #eng-platform</span>
          </div>
        </section>
      </div>
    </VizFrame>
  )
}

// ─── PR Doc with citations ──────────────────────────────────────────────────

type CitationId = "c1" | "c2" | "c3" | "c4"

type Citation = {
  source: "GitHub" | "Slack" | "ADR" | "Linear"
  author: string
  timestamp: string
  link: string
  excerpt: string
}

const CITATIONS: Record<CitationId, Citation> = {
  c1: { source: "GitHub", author: "alex.rivera", timestamp: "4h ago · PR #418", link: "github.com/orchestra/api/pull/418", excerpt: "Replaced inline retry buffer with a BullMQ queue so workers can restart cleanly." },
  c2: { source: "Slack", author: "Marcus Thompson", timestamp: "2d ago · #eng-platform", link: "slack.com/archives/eng-platform", excerpt: "Each workspace should get a separate SDK key. Replay jobs bypass the limit through a signed internal path." },
  c3: { source: "ADR", author: "marcus.t", timestamp: "12d ago · ADR-014", link: "docs/adr/014-queue-based-webhooks.md", excerpt: "Stripe stays isolated behind BillingPort. Invoice preview never calls Stripe directly." },
  c4: { source: "Linear", author: "sarah.kim", timestamp: "8d ago · ENG-712", link: "linear.app/orchestra/ENG-712", excerpt: "Idempotency keys live in Redis with a 48h TTL, scoped per workspace + SDK key." },
}

function SourceLogo({ source, className = "h-3.5 w-3.5" }: { source: Citation["source"]; className?: string }) {
  if (source === "GitHub") return <Github className={className} />
  if (source === "Slack") return <MessageSquare className={className} />
  if (source === "Linear") return <ArrowUpRight className={className} />
  return <FileText className={className} />
}

export function PRDocViz() {
  const [tooltip, setTooltip] = useState<{ id: CitationId; x: number; y: number } | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const openCite = (id: CitationId, event: React.MouseEvent) => {
    event.stopPropagation()
    setTooltip({ id, x: event.clientX, y: event.clientY })
    setPanelOpen(true)
  }

  return (
    <div className="relative flex h-full w-full" onClick={() => setTooltip(null)}>
      <div className={`relative h-full min-w-0 flex-1 transition-[margin] duration-300 ${panelOpen ? "mr-[320px]" : "mr-0"}`}>
        <VizFrame kicker="PR · Antler" title="Background job migration — drafted with citations.">
          <article className="max-w-[640px] space-y-5 text-[15px] leading-[1.8] text-[var(--chat-text)]">
            <p>
              Antler migrates webhook delivery from inline retries to a <Cite id="c1" openCite={openCite}>BullMQ-backed queue</Cite>. Workers can restart without dropping events, and failed deliveries replay on a signed internal path.
            </p>
            <p>
              Each workspace gets its own <Cite id="c2" openCite={openCite}>SDK key with rate-limited ingestion</Cite>. Replay jobs bypass the limit through a signed queue path so internal traffic does not get throttled during incident response.
            </p>
            <p>
              On contradiction with PR #418, the <Cite id="c3" openCite={openCite}>Stripe boundary stays isolated</Cite> — invoice preview reads from the ledger snapshot and never calls Stripe directly during beta.
            </p>
            <p>
              <Cite id="c4" openCite={openCite}>Idempotency keys</Cite> are scoped per workspace and SDK key, stored in Redis with a 48h TTL.
            </p>
            <div className="mt-8 flex items-center gap-3 border-t border-[var(--chat-border)] pt-5 font-mono text-[10px] text-[var(--chat-muted)]">
              <span className="rounded-full border border-[var(--chat-border)] px-2 py-1">DRAFT</span>
              <span>Cite tap → tooltip + side panel</span>
              <button onClick={(e) => { e.stopPropagation(); setPanelOpen((v) => !v) }} className="ml-auto rounded-full border border-[var(--chat-border)] px-3 py-1 transition hover:border-[var(--chat-accent)] hover:text-[var(--chat-accent)]">
                {panelOpen ? "Hide citations" : "All citations"}
              </button>
            </div>
          </article>
        </VizFrame>
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[80] -translate-x-1/2 rounded-md border border-[var(--border-subtle)] bg-[var(--tooltip-bg)] px-3 py-2 text-[11px] text-[var(--tooltip-text)] shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y - 52 }}
          >
            <div className="flex items-center gap-2 font-mono">
              <SourceLogo source={CITATIONS[tooltip.id].source} />
              <span className="font-medium">{CITATIONS[tooltip.id].source}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">{CITATIONS[tooltip.id].author}</span>
            </div>
            <div className="mt-1 font-mono opacity-60">{CITATIONS[tooltip.id].timestamp}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 z-30 h-full w-[320px] overflow-y-auto border-l border-[var(--chat-border)] bg-[var(--chat-bg)] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--chat-muted)]">Citations</div>
              <button onClick={() => setPanelOpen(false)} className="grid h-7 w-7 place-items-center rounded-full border border-[var(--chat-border)] text-[var(--chat-muted)] transition hover:text-[var(--chat-text)]">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {(Object.keys(CITATIONS) as CitationId[]).map((id) => (
                <div key={id} className="rounded-[12px] border border-[var(--chat-border)] bg-[var(--chat-chip)] p-3">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--chat-text)]">
                    <SourceLogo source={CITATIONS[id].source} />
                    <span>{CITATIONS[id].source}</span>
                    <span className="font-mono text-[10px] text-[var(--chat-muted)]">· {CITATIONS[id].author}</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-[var(--chat-text-soft)]">{CITATIONS[id].excerpt}</p>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[var(--chat-muted)]">
                    <span>{CITATIONS[id].timestamp}</span>
                    <a className="flex items-center gap-1 hover:text-[var(--chat-accent)]" href={`https://${CITATIONS[id].link}`} target="_blank" rel="noreferrer">
                      open <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

function Cite({ id, children, openCite }: { id: CitationId; children: React.ReactNode; openCite: (id: CitationId, event: React.MouseEvent) => void }) {
  return (
    <mark
      onClick={(e) => openCite(id, e)}
      className="cursor-pointer rounded bg-[var(--highlight)] px-1 text-[var(--text-primary)] transition-colors hover:bg-[var(--highlight-hover)]"
    >
      {children}
    </mark>
  )
}

// ─── Ship report ────────────────────────────────────────────────────────────

const SHIPPED = [
  { day: "May 27", time: "11:42", author: "alex.rivera", pr: "#418", title: "Webhook retry path hardened", area: "ingestion" },
  { day: "May 26", time: "18:03", author: "sarah.kim", pr: "#417", title: "Switch retry queue to BullMQ", area: "ingestion" },
  { day: "May 24", time: "09:15", author: "marcus.t", pr: "#416", title: "Idempotency keys per workspace", area: "ingestion" },
  { day: "May 23", time: "14:30", author: "sarah.kim", pr: "#415", title: "Stripe boundary cleanup", area: "payments" },
  { day: "May 22", time: "10:05", author: "alex.rivera", pr: "#414", title: "Drop legacy inline retries", area: "ingestion" },
  { day: "May 22", time: "08:52", author: "marcus.t", pr: "#413", title: "Ledger snapshot reads for preview", area: "payments" },
  { day: "May 21", time: "16:18", author: "priya.s", pr: "#412", title: "Status workspace polish", area: "frontend" },
  { day: "May 21", time: "11:01", author: "priya.s", pr: "#411", title: "Decide topbar trimmed", area: "frontend" },
]

const AREA_DOTS: Record<string, string> = {
  ingestion: "bg-[var(--chat-accent)]",
  payments: "bg-[var(--amber-gold)]",
  frontend: "bg-[var(--slate-blue)]",
}

export function ShipReportViz() {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof SHIPPED>()
    SHIPPED.forEach((item) => {
      if (!map.has(item.day)) map.set(item.day, [])
      map.get(item.day)!.push(item)
    })
    return [...map.entries()]
  }, [])

  return (
    <VizFrame kicker="Ship report · Week of May 27" title="Eight PRs merged · ingestion, payments, frontend.">
      <div className="space-y-7">
        {grouped.map(([day, items], dayIndex) => (
          <motion.section
            key={day}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--chat-muted)]">{day}</div>
            <div className="mt-3 space-y-2">
              {items.map((item) => (
                <div key={item.pr} className="grid grid-cols-[12px_56px_1fr_120px] items-center gap-3 rounded-[10px] border border-transparent px-2 py-2 transition hover:border-[var(--chat-border)] hover:bg-[var(--chat-chip)]">
                  <span className={`h-2 w-2 rounded-full ${AREA_DOTS[item.area] || "bg-[var(--chat-muted)]"}`} />
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--chat-muted)]">
                    <GitMerge className="h-3 w-3" />
                    {item.pr}
                  </div>
                  <div className="truncate text-[13px] text-[var(--chat-text)]">{item.title}</div>
                  <div className="text-right font-mono text-[10px] text-[var(--chat-muted)]">{item.author} · {item.time}</div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </VizFrame>
  )
}

// ─── Router ─────────────────────────────────────────────────────────────────

export function VisualizationFor({ kind }: { kind: VizKey }) {
  if (kind === "rationale") return <RationaleViz />
  if (kind === "pr-antler") return <PRDocViz />
  return <ShipReportViz />
}
