"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Github,
  Mail,
  FileText,
  BookText,
  MessageSquare,
  X,
  Plus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

type Source = {
  id: string
  name: string
  icon: LucideIcon
  status: "healthy" | "problem"
  statusText: string
  syncedAgo: string
  itemCount: number
}

type Decision = {
  id: string
  title: string
  author: string
  timestamp: string
}

type DigestItem = {
  id: string
  source: "slack" | "gmail"
  summary: string
  timestamp: string
}

type Integration = {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

type Member = {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Member" | "Viewer"
  seed: string
}

const SOURCES: Source[] = [
  { id: "github", name: "GitHub", icon: Github, status: "healthy", statusText: "Synced", syncedAgo: "Synced 4m ago", itemCount: 12438 },
  { id: "slack", name: "Slack", icon: MessageSquare, status: "healthy", statusText: "Synced", syncedAgo: "Synced 12m ago", itemCount: 8721 },
  { id: "gmail", name: "Gmail", icon: Mail, status: "healthy", statusText: "Synced", syncedAgo: "Synced 2m ago", itemCount: 4290 },
  { id: "notion", name: "Notion", icon: BookText, status: "problem", statusText: "Sync failed", syncedAgo: "2h ago", itemCount: 1843 },
  { id: "gdocs", name: "Google Docs", icon: FileText, status: "healthy", statusText: "Synced", syncedAgo: "Synced 9m ago", itemCount: 612 },
]

const DECISIONS: Decision[] = [
  { id: "d1", title: "Move IC ladder rubric to v3.2", author: "Priya M.", timestamp: "today · 09:14" },
  { id: "d2", title: "Deprecate phone-screen for inbound applicants", author: "Adhiraj D.", timestamp: "yesterday" },
  { id: "d3", title: "Hire freeze lifted for backend infra", author: "Sam K.", timestamp: "2d ago" },
  { id: "d4", title: "New onboarding doc owner: People Ops", author: "Lin T.", timestamp: "3d ago" },
  { id: "d5", title: "Drop Codility, adopt take-home for SDE-2", author: "Priya M.", timestamp: "4d ago" },
  { id: "d6", title: "Comp band refresh for staff engineers", author: "Adhiraj D.", timestamp: "6d ago" },
  { id: "d7", title: "Recruiter SLA reset to 48h first-touch", author: "Sam K.", timestamp: "7d ago" },
]

const DIGEST: DigestItem[] = [
  { id: "g1", source: "slack", summary: "#hiring — Priya flagged scoring drift on the Rust loop", timestamp: "32m ago" },
  { id: "g2", source: "gmail", summary: "Legal: updated NDA template needs counter-sign by Fri", timestamp: "2h ago" },
  { id: "g3", source: "slack", summary: "#eng-leads — bus-factor risk on payments review", timestamp: "4h ago" },
  { id: "g4", source: "gmail", summary: "Greenhouse outage post-mortem scheduled Tue", timestamp: "yesterday" },
  { id: "g5", source: "slack", summary: "#design — new portfolio rubric awaiting your sign-off", timestamp: "yesterday" },
]

const INTEGRATIONS: Integration[] = [
  { id: "github", name: "GitHub", description: "Repositories, PRs, code review history", icon: Github },
  { id: "slack", name: "Slack", description: "Channels, threads, decision logs", icon: MessageSquare },
  { id: "gmail", name: "Gmail", description: "Threads tagged for the hiring inbox", icon: Mail },
  { id: "notion", name: "Notion", description: "Specs, RFCs, team handbooks", icon: BookText },
  { id: "gdocs", name: "Google Docs", description: "Briefs, rubrics, scorecards", icon: FileText },
  { id: "request", name: "Request integration", description: "Tell us what you need next", icon: Plus },
]

const MEMBERS: Member[] = [
  { id: "m1", name: "Adhiraj Dogra", email: "adhiraj@orchestra.app", role: "Admin", seed: "Adhiraj Dogra" },
  { id: "m2", name: "Priya Mehta", email: "priya@orchestra.app", role: "Manager", seed: "Priya Mehta" },
  { id: "m3", name: "Sam Kapoor", email: "sam@orchestra.app", role: "Manager", seed: "Sam Kapoor" },
  { id: "m4", name: "Lin Tang", email: "lin@orchestra.app", role: "Member", seed: "Lin Tang" },
  { id: "m5", name: "Marco Reyes", email: "marco@orchestra.app", role: "Member", seed: "Marco Reyes" },
  { id: "m6", name: "Jules Okafor", email: "jules@orchestra.app", role: "Viewer", seed: "Jules Okafor" },
]

const MODULES = (() => {
  // 60 modules: 4 rows x 15 cols
  const names = [
    "auth", "billing", "scoring", "rubric-v3", "scheduler", "notif", "search-rank",
    "candidate-graph", "evidence-store", "ats-bridge", "rl-loop", "embeddings",
    "queue", "webhooks", "audit-log",
    "user-prefs", "themes", "feature-flags", "perms", "session", "rate-limit",
    "exports", "import-pipeline", "calibration", "fairness", "redaction",
    "compliance", "telemetry", "feedback-collector", "interview-pack-gen",
    "rubric-diff", "review-state", "candidate-tags", "stage-machine",
    "panel-router", "loop-history", "scorecard-merge", "evidence-link",
    "github-sync", "slack-sync", "gmail-sync", "notion-sync", "gdocs-sync",
    "vector-store", "doc-chunker", "llm-router", "prompt-cache", "context-window",
    "cost-tracker", "eval-harness", "regression-suite", "shadow-traffic",
    "ab-router", "kill-switch", "secrets-vault", "key-rotation",
    "billing-tier", "usage-meter", "seat-licensing", "support-handoff",
  ]
  const eval0to1: number[] = [
    1.00, 0.86, 0.92, 0.74, 0.62, 0.55, 0.81,
    0.90, 0.78, 0.67, 0.42, 0.58,
    0.71, 0.49, 0.95,
    0.34, 0.22, 0.66, 0.88, 0.51, 0.38,
    0.27, 0.45, 0.61, 0.73, 0.55,
    0.69, 0.84, 0.30, 0.59,
    0.46, 0.40, 0.52, 0.63, 0.18,
    0.00, 0.36, 0.50, 0.72, 0.65,
    0.91, 0.00, 0.43, 0.57, 0.79,
    0.26, 0.48, 0.31, 0.60, 0.42,
    0.54, 0.68, 0.20, 0.39,
    0.00, 0.47, 0.33, 0.71, 0.58, 0.24,
  ]
  return names.map((n, i) => ({ name: n, coverage: eval0to1[i] ?? 0 }))
})()

function shadeForCoverage(c: number): string {
  // 0 → #FAF8F5, 1 → #1A1612, stepped through gray
  if (c <= 0) return "#FAF8F5"
  if (c < 0.2) return "#E7E2DA"
  if (c < 0.4) return "#C7BFB3"
  if (c < 0.6) return "#8C8378"
  if (c < 0.8) return "#4A413A"
  return "#1A1612"
}

export default function KnowPage() {
  const router = useRouter()
  const [openConnector, setOpenConnector] = useState<Source | null>(null)
  const [openConnect, setOpenConnect] = useState(false)
  const [openAccess, setOpenAccess] = useState(false)
  const [openEval, setOpenEval] = useState(false)
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  // KPI values
  const sourcesConnected = `${SOURCES.filter(s => s.status === "healthy").length} / ${SOURCES.length}`
  const coveragePct = 67
  const fragilityRisks = 3
  const evalScore = 8.4

  const coverageProblem = coveragePct < 50
  const risksProblem = fragilityRisks > 5
  const evalProblem = evalScore < 7
  const sourcesProblem = SOURCES.some(s => s.status === "problem")

  // Eval trend chart data
  const trend = useMemo(() => [6.8, 7.1, 7.0, 7.4, 7.6, 7.5, 7.8, 8.0, 7.9, 8.2, 8.3, 8.4], [])

  return (
    <div className="h-full w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#050505]">
      <div className="h-full w-full px-8 py-8 flex flex-col">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] leading-none font-medium text-[#1A1612] dark:text-white tracking-tight">Know</h1>
          <button
            type="button"
            onClick={() => setOpenAccess(true)}
            className="text-[13px] text-[#78716C] hover:text-[#1A1612] dark:hover:text-white transition-colors"
          >
            Manage access →
          </button>
        </div>

        {/* Grid container */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 flex-1 min-h-0">
          {/* ROW 1: KPI TILES */}
          <KpiTile
            value={sourcesConnected}
            label="Sources Connected"
            problem={sourcesProblem}
          />
          <KpiTile
            value={`${coveragePct}%`}
            label="Coverage"
            problem={coverageProblem}
          />
          <KpiTile
            value={`${fragilityRisks}`}
            label="Fragility Risks"
            problem={risksProblem}
            onClick={() => router.push("/decide?filter=fragile")}
          />
          <KpiTile
            value={`${evalScore} / 10`}
            label="Eval Score"
            problem={evalProblem}
            onClick={() => setOpenEval(true)}
          />

          {/* ROW 2: SOURCES (8) + RECENT DECISIONS (4) */}
          <section className="col-span-8 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C]">Sources</div>
              <button
                type="button"
                onClick={() => setOpenConnect(true)}
                aria-label="Connect new source"
                className="w-6 h-6 flex items-center justify-center rounded-[2px] text-[#78716C] hover:text-[#1A1612] hover:bg-white dark:hover:bg-white/5 transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-x-4 flex-1 min-h-0">
              {SOURCES.map((src) => (
                <ConnectorTile key={src.id} source={src} onClick={() => setOpenConnector(src)} />
              ))}
            </div>
          </section>

          <section className="col-span-4 flex flex-col min-h-0">
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">Recent Decisions</div>
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2px] flex-1 min-h-0 overflow-hidden">
              <ul className="h-full flex flex-col">
                {DECISIONS.map((d, i) => (
                  <li
                    key={d.id}
                    className={`flex-1 min-h-0 px-4 py-2 flex flex-col justify-center cursor-pointer group ${i < DECISIONS.length - 1 ? "border-b border-[#FAF8F5] dark:border-white/5" : ""}`}
                    onClick={() => router.push(`/decide?node=${d.id}`)}
                  >
                    <div className="text-[13px] text-[#1A1612] dark:text-white truncate group-hover:text-[#B8543D] transition-colors leading-tight">
                      {d.title}
                    </div>
                    <div className="text-[11px] text-[#78716C] truncate leading-tight mt-0.5">
                      {d.author} · {d.timestamp}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ROW 3: HEATMAP (6) + COMMS (6) */}
          <section className="col-span-6 flex flex-col min-h-0">
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">Coverage by Module</div>
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2px] p-5 flex-1 min-h-0 overflow-hidden relative">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(15, 24px)",
                  gridAutoRows: "24px",
                  gap: "4px",
                }}
              >
                {MODULES.map((m, i) => {
                  const bg = shadeForCoverage(m.coverage)
                  const zero = m.coverage <= 0
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredModule(i)}
                      onMouseLeave={() => setHoveredModule(null)}
                      className="w-6 h-6 cursor-pointer relative"
                      style={{
                        backgroundColor: bg,
                        outline: zero ? "1px solid #B8543D" : undefined,
                        outlineOffset: zero ? "-1px" : undefined,
                      }}
                    >
                      {hoveredModule === i && (
                        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#1A1612] text-white text-[11px] px-2 py-1 rounded-[2px] pointer-events-none">
                          {m.name} · {Math.round(m.coverage * 100)}%
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="col-span-6 flex flex-col min-h-0">
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">Missed & Important</div>
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2px] flex-1 min-h-0 overflow-hidden">
              <ul className="h-full flex flex-col">
                {DIGEST.map((item, i) => {
                  const Icon = item.source === "slack" ? MessageSquare : Mail
                  return (
                    <li
                      key={item.id}
                      className={`flex-1 min-h-0 px-4 py-2 flex items-center gap-3 ${i < DIGEST.length - 1 ? "border-b border-[#FAF8F5] dark:border-white/5" : ""}`}
                    >
                      <Icon className="w-4 h-4 text-[#78716C] shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#1A1612] dark:text-white truncate leading-tight">
                          {item.summary}
                        </div>
                        <div className="text-[11px] text-[#78716C] leading-tight mt-0.5">{item.timestamp}</div>
                      </div>
                      <button
                        type="button"
                        className="text-[12px] text-[#B8543D] hover:underline shrink-0"
                      >
                        Read →
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* SLIDE-OVER: connector settings */}
      {openConnector && (
        <SlideOver title={`${openConnector.name} settings`} onClose={() => setOpenConnector(null)}>
          <div className="space-y-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-2">Status</div>
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: openConnector.status === "healthy" ? "#1A1612" : "#B8543D" }}
                />
                <span className="text-[13px] text-[#1A1612] dark:text-white">{openConnector.statusText}</span>
              </div>
              <div className="text-[11px] text-[#78716C] mt-1">
                {openConnector.syncedAgo} · {openConnector.itemCount.toLocaleString()} items
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-2">OAuth</div>
              <div className="text-[13px] text-[#1A1612] dark:text-white">
                Connected as adhiraj@orchestra.app
              </div>
              <div className="text-[11px] text-[#78716C] mt-1">Scopes: read · metadata</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-2">Sync window</div>
              <div className="text-[13px] text-[#1A1612] dark:text-white">Every 15 minutes</div>
            </div>
            <button
              type="button"
              className="w-full bg-[#1A1612] text-[#FAF8F5] text-[13px] py-2.5 rounded-[2px] hover:opacity-90 transition-opacity"
            >
              Reconnect
            </button>
          </div>
        </SlideOver>
      )}

      {/* SLIDE-OVER: connect new source */}
      {openConnect && (
        <SlideOver title="Connect a source" onClose={() => setOpenConnect(false)}>
          <ul className="divide-y divide-[#FAF8F5] dark:divide-white/5">
            {INTEGRATIONS.map((it) => (
              <li key={it.id} className="py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[2px] bg-[#FAF8F5] dark:bg-white/5 flex items-center justify-center shrink-0">
                  <it.icon className="w-4 h-4 text-[#1A1612] dark:text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[#1A1612] dark:text-white leading-tight">{it.name}</div>
                  <div className="text-[11px] text-[#78716C] leading-tight mt-0.5 truncate">{it.description}</div>
                </div>
                <button
                  type="button"
                  className="bg-[#1A1612] text-[#FAF8F5] text-[12px] px-3 py-1.5 rounded-[2px] hover:opacity-90 transition-opacity shrink-0"
                >
                  Connect
                </button>
              </li>
            ))}
          </ul>
        </SlideOver>
      )}

      {/* SLIDE-OVER: manage access */}
      {openAccess && (
        <SlideOver title="Manage access" onClose={() => setOpenAccess(false)}>
          <ul className="divide-y divide-[#FAF8F5] dark:divide-white/5">
            {MEMBERS.map((m) => (
              <li key={m.id} className="py-3 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(m.seed)}`}
                  alt={m.name}
                  className="w-9 h-9 rounded-full bg-[#1A1612] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[#1A1612] dark:text-white leading-tight truncate">{m.name}</div>
                  <div className="text-[11px] text-[#78716C] leading-tight mt-0.5 truncate">{m.email}</div>
                </div>
                <span className="text-[11px] text-[#78716C] shrink-0 w-16 text-right">{m.role}</span>
                <button
                  type="button"
                  className="text-[12px] text-[#B8543D] hover:underline shrink-0"
                >
                  Edit role
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button
              type="button"
              className="w-full bg-[#1A1612] text-[#FAF8F5] text-[13px] py-2.5 rounded-[2px] hover:opacity-90 transition-opacity"
            >
              Invite people
            </button>
          </div>
        </SlideOver>
      )}

      {/* MODAL: eval scoreboard */}
      {openEval && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1612]/30 flex items-center justify-center p-8"
          onClick={() => setOpenEval(false)}
        >
          <div
            className="bg-white dark:bg-[#0a0a0a] rounded-[2px] w-[640px] max-w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenEval(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#78716C] hover:text-[#1A1612] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-2">Eval Score</div>
            <div className="text-[32px] text-[#1A1612] dark:text-white leading-none mb-6">{evalScore} / 10</div>
            <EvalLineChart values={trend} />
          </div>
        </div>
      )}
    </div>
  )
}

function KpiTile({
  value,
  label,
  problem,
  onClick,
}: {
  value: string
  label: string
  problem: boolean
  onClick?: () => void
}) {
  const interactive = !!onClick
  const color = problem ? "#B8543D" : "#1A1612"
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      className={`col-span-3 bg-white dark:bg-[#0a0a0a] rounded-[2px] p-6 ${interactive ? "cursor-pointer hover:bg-[#FFFCF7] dark:hover:bg-[#101010] transition-colors" : ""}`}
    >
      <div className="text-[32px] leading-none font-medium tracking-tight" style={{ color, fontFamily: "var(--font-inter)" }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mt-3">
        {label}
      </div>
    </div>
  )
}

function ConnectorTile({ source, onClick }: { source: Source; onClick: () => void }) {
  const dotColor = source.status === "healthy" ? "#1A1612" : "#B8543D"
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white dark:bg-[#0a0a0a] rounded-[2px] p-4 text-left hover:bg-[#FFFCF7] dark:hover:bg-[#101010] transition-colors flex flex-col gap-2 min-w-0"
    >
      <div className="flex items-center gap-2 min-w-0">
        <source.icon className="w-5 h-5 text-[#1A1612] dark:text-white shrink-0" strokeWidth={1.5} />
        <span className="text-[13px] text-[#1A1612] dark:text-white truncate">{source.name}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
        <span className="text-[11px] text-[#78716C] truncate">{source.statusText}</span>
      </div>
      <div className="text-[11px] text-[#78716C] truncate">
        {source.syncedAgo} · {source.itemCount.toLocaleString()} items
      </div>
    </button>
  )
}

function SlideOver({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[#1A1612]/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[480px] bg-white dark:bg-[#0a0a0a] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#FAF8F5] dark:border-white/5">
          <div className="text-[13px] text-[#1A1612] dark:text-white">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#78716C] hover:text-[#1A1612] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  )
}

function EvalLineChart({ values }: { values: number[] }) {
  const W = 576
  const H = 160
  const padding = 4
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (W - padding * 2) / (values.length - 1)
  const points = values
    .map((v, i) => {
      const x = padding + i * stepX
      const y = padding + (1 - (v - min) / range) * (H - padding * 2)
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg width={W} height={H} className="block">
      <polyline
        fill="none"
        stroke="#1A1612"
        strokeWidth={1}
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
