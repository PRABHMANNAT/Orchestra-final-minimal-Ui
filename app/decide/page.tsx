"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  GitPullRequest,
  MessageSquare,
  FileText,
  Mail,
  X,
  type LucideIcon,
} from "lucide-react"

type Person = { id: string; name: string; seed: string }
type SourceKind = "pr" | "slack" | "doc" | "email"
type Source = { id: string; kind: SourceKind; title: string; timestamp: string; url: string }

type Decision = {
  id: string
  title: string
  summary: string
  participantIds: string[]
  sources: Source[]
  dependsOn: string[]
  daysSinceActivity: number
  isFragile: boolean // bus-factor-1
}

type FilterKey = "all" | "recent" | "fragile" | "stale"

const PEOPLE: Person[] = [
  { id: "p1", name: "Adhiraj Dogra", seed: "Adhiraj Dogra" },
  { id: "p2", name: "Priya Mehta", seed: "Priya Mehta" },
  { id: "p3", name: "Sam Kapoor", seed: "Sam Kapoor" },
  { id: "p4", name: "Lin Tang", seed: "Lin Tang" },
  { id: "p5", name: "Marco Reyes", seed: "Marco Reyes" },
  { id: "p6", name: "Jules Okafor", seed: "Jules Okafor" },
  { id: "p7", name: "Hana Park", seed: "Hana Park" },
  { id: "p8", name: "Diego Alvarez", seed: "Diego Alvarez" },
  { id: "p9", name: "Yara Haddad", seed: "Yara Haddad" },
  { id: "p10", name: "Theo Brandt", seed: "Theo Brandt" },
  { id: "p11", name: "Aisha Khan", seed: "Aisha Khan" },
  { id: "p12", name: "Owen Bailey", seed: "Owen Bailey" },
]

function src(kind: SourceKind, title: string, ts: string): Source {
  return { id: `${kind}-${Math.random().toString(36).slice(2, 8)}`, kind, title, timestamp: ts, url: "#" }
}

const DECISIONS: Decision[] = [
  {
    id: "d1",
    title: "Adopt rubric v3.2 for IC ladder",
    summary:
      "Replace narrative scoring with proof-anchored rubric. Each level requires one observable artifact per dimension. Reviewers must cite the artifact in the scorecard.",
    participantIds: ["p1", "p2", "p4"],
    sources: [
      src("doc", "ADR-0042 Rubric v3.2", "today · 09:14"),
      src("slack", "#hiring — Adoption thread", "today · 08:40"),
    ],
    dependsOn: [],
    daysSinceActivity: 0,
    isFragile: false,
  },
  {
    id: "d2",
    title: "Deprecate phone-screen for inbound applicants",
    summary:
      "First-touch shifts to a 20-minute async loom. Inbound channel produced too many false negatives on calibration. Recruiters keep phone-screen for sourced candidates only.",
    participantIds: ["p1", "p3"],
    sources: [
      src("doc", "ADR-0039 Inbound funnel", "yesterday"),
      src("slack", "#recruiting — proposal", "2d ago"),
    ],
    dependsOn: ["d1"],
    daysSinceActivity: 1,
    isFragile: false,
  },
  {
    id: "d3",
    title: "Hire freeze lifted for backend infra",
    summary:
      "Sequencing unblocks payments review backlog. Two SDE-2 reqs approved with capped TC; staff-eng req gated on Q3 budget pass.",
    participantIds: ["p3", "p5"],
    sources: [
      src("email", "Finance sign-off — backend req", "2d ago"),
      src("doc", "Hiring plan Q2 amendment", "3d ago"),
    ],
    dependsOn: [],
    daysSinceActivity: 2,
    isFragile: false,
  },
  {
    id: "d4",
    title: "Onboarding doc owner: People Ops",
    summary:
      "Transfer authoritative copy from engineering wiki to People Ops handbook. Old doc redirects; sync job rewrites links on merge.",
    participantIds: ["p4", "p6"],
    sources: [src("doc", "Handbook migration plan", "3d ago")],
    dependsOn: ["d2"],
    daysSinceActivity: 3,
    isFragile: false,
  },
  {
    id: "d5",
    title: "Drop Codility, adopt take-home for SDE-2",
    summary:
      "Codility scores correlated 0.31 with on-the-job perf over a year of data. Replacement is a 4-hour scoped take-home reviewed against rubric v3.2.",
    participantIds: ["p2", "p1", "p7"],
    sources: [
      src("doc", "Codility-vs-takehome analysis", "4d ago"),
      src("pr", "scorecard-merge: takehome rubric", "4d ago"),
    ],
    dependsOn: ["d1"],
    daysSinceActivity: 4,
    isFragile: false,
  },
  {
    id: "d6",
    title: "Comp band refresh for staff engineers",
    summary:
      "Bands recalibrated against Levels.fyi 75th p for the metro. Floor moved up 8%, ceiling unchanged. Exceptions process now requires recruiting + finance dual-sign.",
    participantIds: ["p1", "p3"],
    sources: [
      src("doc", "Comp band 2026.1", "6d ago"),
      src("email", "Finance ack — comp band", "6d ago"),
    ],
    dependsOn: ["d3"],
    daysSinceActivity: 6,
    isFragile: true, // only Adhiraj knows the methodology
  },
  {
    id: "d7",
    title: "Recruiter SLA reset to 48h first-touch",
    summary:
      "Drop from 72h to 48h. Pager rota added for weekends-off coverage; volume dashboard re-baselined.",
    participantIds: ["p3", "p8"],
    sources: [src("slack", "#recruiting-ops — SLA", "7d ago")],
    dependsOn: ["d2"],
    daysSinceActivity: 7,
    isFragile: false,
  },
  {
    id: "d8",
    title: "Calibration loop: weekly → biweekly",
    summary:
      "Calibration was eating six person-hours/week. Biweekly cadence with a rolling 10-loop sample preserves signal while cutting cost in half.",
    participantIds: ["p2", "p4", "p7"],
    sources: [src("doc", "Calibration retro", "10d ago")],
    dependsOn: ["d1", "d5"],
    daysSinceActivity: 10,
    isFragile: false,
  },
  {
    id: "d9",
    title: "Vendor: Greenhouse → Ashby pilot",
    summary:
      "8-week pilot on the design org. KPI: time-to-first-touch and reviewer satisfaction. Switch decision gated on pilot read-out.",
    participantIds: ["p3", "p8", "p11"],
    sources: [
      src("doc", "ATS pilot plan", "14d ago"),
      src("email", "Procurement quote", "12d ago"),
    ],
    dependsOn: ["d7"],
    daysSinceActivity: 14,
    isFragile: false,
  },
  {
    id: "d10",
    title: "Sourcer territory by surface, not geography",
    summary:
      "Sourcers now own a surface (infra, ML, frontend) across all regions, not a single region across surfaces. Improves rubric fluency, eats some travel overlap.",
    participantIds: ["p3", "p11"],
    sources: [src("slack", "#sourcing — restructure", "18d ago")],
    dependsOn: ["d7"],
    daysSinceActivity: 18,
    isFragile: false,
  },
  {
    id: "d11",
    title: "Interview pack auto-generation on schedule",
    summary:
      "When loop is scheduled, system drafts interview pack from rubric + role brief. Reviewers edit; final pack auto-attaches to scorecard.",
    participantIds: ["p2", "p5", "p7"],
    sources: [
      src("pr", "interview-pack-gen: scheduler hook", "21d ago"),
      src("doc", "Pack template v1", "22d ago"),
    ],
    dependsOn: ["d1", "d5"],
    daysSinceActivity: 21,
    isFragile: false,
  },
  {
    id: "d12",
    title: "Embeddings model: text-emb-3 → in-house mini",
    summary:
      "Switch saves $14k/mo at -2% retrieval quality on internal evals. Quality regression confined to long-form docs; mitigated by chunker tweak.",
    participantIds: ["p5", "p9"],
    sources: [
      src("pr", "embeddings: swap backbone", "24d ago"),
      src("doc", "Cost vs quality memo", "25d ago"),
    ],
    dependsOn: [],
    daysSinceActivity: 24,
    isFragile: true, // only Yara knows the chunker tweak
  },
  {
    id: "d13",
    title: "Rubric evidence must be linkable",
    summary:
      "Reviewer can't submit a scorecard without an artifact URL per dimension. Empty fields block submit, no override.",
    participantIds: ["p2", "p1"],
    sources: [src("pr", "scorecard-merge: require links", "28d ago")],
    dependsOn: ["d1"],
    daysSinceActivity: 28,
    isFragile: false,
  },
  {
    id: "d14",
    title: "Panel routing by load, not name",
    summary:
      "Reviewer assignment uses a load-weighted queue instead of round-robin by name. Top panelists were getting 3x the median load.",
    participantIds: ["p2", "p4"],
    sources: [src("pr", "panel-router: weighted queue", "31d ago")],
    dependsOn: ["d11"],
    daysSinceActivity: 31,
    isFragile: false,
  },
  {
    id: "d15",
    title: "Candidate self-schedule for first loop",
    summary:
      "Replaces recruiter-driven scheduling for first loops. Recruiters keep manual control for executive and exec-adjacent roles.",
    participantIds: ["p3", "p8"],
    sources: [src("doc", "Self-schedule rollout", "34d ago")],
    dependsOn: ["d7", "d9"],
    daysSinceActivity: 34,
    isFragile: false,
  },
  {
    id: "d16",
    title: "Bar-raiser: required for L5+",
    summary:
      "Independent bar-raiser added to every L5+ loop. Trained pool of 14; calibration session monthly.",
    participantIds: ["p1", "p2", "p10"],
    sources: [src("doc", "Bar-raiser charter", "40d ago")],
    dependsOn: ["d1", "d8"],
    daysSinceActivity: 40,
    isFragile: false,
  },
  {
    id: "d17",
    title: "Rejection notes: structured + auto-redacted",
    summary:
      "Rejection rationales recorded in structured fields; legal-sensitive phrases auto-redacted before recruiter sees them.",
    participantIds: ["p2", "p6", "p9"],
    sources: [src("pr", "redaction: rejection notes", "45d ago")],
    dependsOn: ["d13"],
    daysSinceActivity: 45,
    isFragile: false,
  },
  {
    id: "d18",
    title: "Referral bonus tied to 90-day stay",
    summary:
      "Bonus pays at 90 days, not on signing. Reduced referral spam by 60% in pilot.",
    participantIds: ["p3", "p10"],
    sources: [src("email", "Comp memo — referrals", "52d ago")],
    dependsOn: ["d6"],
    daysSinceActivity: 52,
    isFragile: false,
  },
  {
    id: "d19",
    title: "External recruiter contracts: cap tenure 9mo",
    summary:
      "Hard cap on engagement length forces re-evaluation. Two long-running contracts ended; one extended after fresh scorecard.",
    participantIds: ["p3"],
    sources: [src("doc", "Recruiter vendor policy", "58d ago")],
    dependsOn: [],
    daysSinceActivity: 58,
    isFragile: true, // only Sam holds vendor relationships
  },
  {
    id: "d20",
    title: "Offer letter copy: rubric-derived",
    summary:
      "Offer letter highlights mirror the strongest rubric dimensions from the loop. Decreases offer-decline reversals.",
    participantIds: ["p3", "p11"],
    sources: [src("doc", "Offer letter template v4", "64d ago")],
    dependsOn: ["d13"],
    daysSinceActivity: 64,
    isFragile: false,
  },
  {
    id: "d21",
    title: "Sourcing message: open with proof, not pitch",
    summary:
      "Outbound sourcing opens with a specific artifact from the candidate's profile. Response rate up from 9% to 17%.",
    participantIds: ["p11", "p12"],
    sources: [src("slack", "#sourcing — message test", "70d ago")],
    dependsOn: ["d10"],
    daysSinceActivity: 70,
    isFragile: false,
  },
  {
    id: "d22",
    title: "Internal mobility lane: 2-week window",
    summary:
      "Open reqs surface to current employees 2 weeks before external posting. Improved retention of strong-but-restless ICs.",
    participantIds: ["p1", "p6"],
    sources: [src("doc", "Internal mobility policy", "80d ago")],
    dependsOn: [],
    daysSinceActivity: 80,
    isFragile: false,
  },
  {
    id: "d23",
    title: "Pause: AI-screening for senior roles",
    summary:
      "Bias audit found systematic down-ranking of non-English-first résumés at senior bands. Screening paused for L4+ pending fix.",
    participantIds: ["p2", "p9", "p6"],
    sources: [
      src("doc", "Bias audit — senior screen", "95d ago"),
      src("pr", "fairness: pause flag for L4+", "94d ago"),
    ],
    dependsOn: [],
    daysSinceActivity: 95,
    isFragile: false,
  },
  {
    id: "d24",
    title: "Reviewer training: shadow before scoring",
    summary:
      "New reviewers shadow 3 loops before their first signal-carrying scorecard. Was 1 loop, raised after a calibration drift incident.",
    participantIds: ["p2", "p10"],
    sources: [src("doc", "Reviewer onboarding v2", "100d ago")],
    dependsOn: ["d16"],
    daysSinceActivity: 100,
    isFragile: false,
  },
  {
    id: "d25",
    title: "ATS field: 'why we lost' required on closed-lost",
    summary:
      "Closed-lost candidates require a structured reason. Powers the offer-decline dashboard.",
    participantIds: ["p3", "p8"],
    sources: [src("pr", "ats-bridge: required reason field", "110d ago")],
    dependsOn: [],
    daysSinceActivity: 110,
    isFragile: false,
  },
  {
    id: "d26",
    title: "Stop: posting on LinkedIn Easy Apply",
    summary:
      "Volume dwarfed signal. Channel disabled; sourcing reallocated to direct outreach and referral.",
    participantIds: ["p3", "p11"],
    sources: [src("email", "Channel review Q4", "130d ago")],
    dependsOn: [],
    daysSinceActivity: 130,
    isFragile: false,
  },
  {
    id: "d27",
    title: "Loop format: 4 sessions max",
    summary:
      "Capped loop length at 4 sessions. Hire decision quality unchanged in retro; candidate experience scores up.",
    participantIds: ["p1", "p2"],
    sources: [src("doc", "Loop length retro", "150d ago")],
    dependsOn: [],
    daysSinceActivity: 150,
    isFragile: false,
  },
  {
    id: "d28",
    title: "Scorecard merge: explicit conflict screen",
    summary:
      "When reviewers disagree on a dimension by 2+ points, scorecard merge opens a conflict screen instead of averaging.",
    participantIds: ["p2", "p5"],
    sources: [src("pr", "scorecard-merge: conflict screen", "170d ago")],
    dependsOn: ["d13", "d14"],
    daysSinceActivity: 170,
    isFragile: false,
  },
  {
    id: "d29",
    title: "Recruiting brand: cut paid ads, lean editorial",
    summary:
      "Killed sponsored placements. Engineering-blog content drove 3x the qualified inbound at a fraction of the cost.",
    participantIds: ["p1", "p11"],
    sources: [src("doc", "Brand 2025 retro", "200d ago")],
    dependsOn: [],
    daysSinceActivity: 200,
    isFragile: false,
  },
  {
    id: "d30",
    title: "Founders interview every offer",
    summary:
      "Final 30-minute conversation with a founder for every closed-won candidate. Owned by Adhiraj. Tightened by retro after early scale issues.",
    participantIds: ["p1"],
    sources: [src("doc", "Founder loop charter", "240d ago")],
    dependsOn: ["d27"],
    daysSinceActivity: 240,
    isFragile: true, // single owner
  },
]

const PERSON_BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p]))
const DECISION_BY_ID = Object.fromEntries(DECISIONS.map((d) => [d.id, d]))
const RECENT_THRESHOLD = 7
const STALE_THRESHOLD = 90

const SOURCE_ICON: Record<SourceKind, LucideIcon> = {
  pr: GitPullRequest,
  slack: MessageSquare,
  doc: FileText,
  email: Mail,
}

type SimNode = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
}

function deterministicSeed(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return ((h >>> 0) % 1000) / 1000
}

function runForceLayout(): SimNode[] {
  const nodes: SimNode[] = DECISIONS.map((d) => {
    const a = deterministicSeed(d.id) * Math.PI * 2
    const r = 80 + deterministicSeed(d.id + "r") * 120
    return { id: d.id, x: Math.cos(a) * r, y: Math.sin(a) * r, vx: 0, vy: 0 }
  })
  const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]))
  const links: { a: number; b: number }[] = []
  for (const d of DECISIONS) {
    for (const parent of d.dependsOn) {
      if (idx[parent] != null) links.push({ a: idx[parent], b: idx[d.id] })
    }
  }

  const REPULSE = 1800
  const SPRING = 0.04
  const REST = 90
  const GRAVITY = 0.012
  const DAMPING = 0.82
  const ITERATIONS = 400

  for (let it = 0; it < ITERATIONS; it++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        let dx = b.x - a.x
        let dy = b.y - a.y
        let d2 = dx * dx + dy * dy
        if (d2 < 0.01) {
          dx = (deterministicSeed(a.id + b.id) - 0.5) * 2
          dy = (deterministicSeed(b.id + a.id) - 0.5) * 2
          d2 = dx * dx + dy * dy + 0.01
        }
        const d = Math.sqrt(d2)
        const f = REPULSE / d2
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        a.vx -= fx
        a.vy -= fy
        b.vx += fx
        b.vy += fy
      }
    }
    // Springs
    for (const link of links) {
      const a = nodes[link.a]
      const b = nodes[link.b]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) + 0.01
      const f = SPRING * (d - REST)
      const fx = (dx / d) * f
      const fy = (dy / d) * f
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    }
    // Center gravity + integrate
    for (const n of nodes) {
      n.vx -= GRAVITY * n.x
      n.vy -= GRAVITY * n.y
      n.vx *= DAMPING
      n.vy *= DAMPING
      n.x += n.vx
      n.y += n.vy
    }
  }
  return nodes
}

export default function DecidePage() {
  const router = useRouter()
  const search = useSearchParams()
  const filterParam = (search?.get("filter") as FilterKey | null) || "all"
  const nodeParam = search?.get("node") || null

  const [filter, setFilter] = useState<FilterKey>(["all", "recent", "fragile", "stale"].includes(filterParam) ? filterParam : "all")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(nodeParam)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; person: Person } | null>(null)
  const [departureFor, setDepartureFor] = useState<Person | null>(null)

  // Force layout precomputed once
  const layout = useMemo(() => runForceLayout(), [])
  const layoutById = useMemo(() => Object.fromEntries(layout.map((n) => [n.id, n])), [layout])

  // Pan / zoom
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isPanning = useRef(false)
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)

  // Center the graph on first mount
  useEffect(() => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setView({ tx: r.width / 2, ty: r.height / 2, scale: 1 })
  }, [])

  // Pan
  const onMouseDownBackground = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return
    isPanning.current = true
    panStart.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty }
  }, [view.tx, view.ty])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isPanning.current || !panStart.current) return
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setView((v) => ({ ...v, tx: panStart.current!.tx + dx, ty: panStart.current!.ty + dy }))
    }
    const onUp = () => {
      isPanning.current = false
      panStart.current = null
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  // Zoom on wheel
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    setView((v) => {
      const newScale = Math.min(4, Math.max(0.3, v.scale * factor))
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return { ...v, scale: newScale }
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const dx = mx - v.tx
      const dy = my - v.ty
      const ratio = newScale / v.scale
      return {
        scale: newScale,
        tx: mx - dx * ratio,
        ty: my - dy * ratio,
      }
    })
  }, [])

  // Filter + search
  const visibleIds = useMemo(() => {
    const q = query.trim().toLowerCase()
    return new Set(
      DECISIONS.filter((d) => {
        if (q && !d.title.toLowerCase().includes(q) && !d.summary.toLowerCase().includes(q)) return false
        if (filter === "recent") return d.daysSinceActivity <= RECENT_THRESHOLD
        if (filter === "fragile") return d.isFragile
        if (filter === "stale") return d.daysSinceActivity >= STALE_THRESHOLD
        return true
      }).map((d) => d.id),
    )
  }, [filter, query])

  const selected = selectedId ? DECISION_BY_ID[selectedId] : null

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "recent", label: "Recent" },
    { key: "fragile", label: "Fragile" },
    { key: "stale", label: "Stale" },
  ]

  return (
    <div className="h-full w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#050505] flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center gap-6">
        <h1 className="text-[22px] leading-none font-medium text-[#1A1612] dark:text-white tracking-tight" style={{ fontFamily: "var(--font-inter)" }}>
          Decide
        </h1>
        <div className="flex items-center gap-2 text-[13px]" style={{ fontFamily: "var(--font-inter)" }}>
          {filters.map((f, i) => (
            <span key={f.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#78716C]">·</span>}
              <button
                type="button"
                onClick={() => setFilter(f.key)}
                className={`transition-colors ${filter === f.key ? "text-[#B8543D]" : "text-[#78716C] hover:text-[#1A1612] dark:hover:text-white"}`}
              >
                {f.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Split */}
      <div className="flex flex-1 min-h-0">
        {/* Graph (60%) */}
        <div
          ref={containerRef}
          className="relative h-full select-none"
          style={{ width: "60%", cursor: isPanning.current ? "grabbing" : "grab" }}
          onMouseDown={onMouseDownBackground}
          onWheel={onWheel}
        >
          {/* Search */}
          <div className="absolute top-4 right-4 z-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter decisions…"
              className="w-[200px] h-8 px-3 text-[12px] bg-white dark:bg-[#0a0a0a] border-none focus:outline-none focus:ring-1 focus:ring-[#B8543D]/40 text-[#1A1612] dark:text-white placeholder:text-[#78716C] rounded-[2px]"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>

          {/* Empty state */}
          {DECISIONS.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[13px] text-[#78716C]">Decisions will appear here as your team works.</p>
            </div>
          ) : (
            <svg
              className="w-full h-full block"
              style={{ background: "#FAF8F5" }}
            >
              <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
                {/* Edges */}
                {DECISIONS.flatMap((d) =>
                  d.dependsOn.map((parent) => {
                    const a = layoutById[parent]
                    const b = layoutById[d.id]
                    if (!a || !b) return null
                    const visible = visibleIds.has(d.id) && visibleIds.has(parent)
                    return (
                      <line
                        key={`${parent}-${d.id}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#78716C"
                        strokeWidth={1 / view.scale}
                        opacity={visible ? 0.4 : 0.08}
                        vectorEffect="non-scaling-stroke"
                      />
                    )
                  }),
                )}
                {/* Nodes */}
                {DECISIONS.map((d) => {
                  const n = layoutById[d.id]
                  if (!n) return null
                  const recent = d.daysSinceActivity <= RECENT_THRESHOLD
                  const stale = d.daysSinceActivity >= STALE_THRESHOLD
                  const inFilter = visibleIds.has(d.id)
                  const isHovered = hoveredId === d.id
                  const isSelected = selectedId === d.id
                  const baseR = 4 // 8px circle => 4px radius
                  const r = isHovered || isSelected ? 6 : baseR
                  const dim = !inFilter ? 0.18 : stale ? 0.4 : 1
                  return (
                    <g
                      key={d.id}
                      data-node={d.id}
                      opacity={dim}
                      onMouseEnter={() => setHoveredId(d.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedId(d.id)
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Recent outline ring */}
                      {recent && (
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={r + 2}
                          fill="none"
                          stroke="#B8543D"
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                      {/* Node */}
                      <circle cx={n.x} cy={n.y} r={r} fill="#1A1612" />
                      {/* Selected ring */}
                      {isSelected && (
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={r + 4}
                          fill="none"
                          stroke="#1A1612"
                          strokeWidth={1}
                          opacity={0.4}
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                      {/* Fragility marker */}
                      {d.isFragile && (
                        <circle cx={n.x + r + 4} cy={n.y - r - 2} r={2} fill="#B8543D" />
                      )}
                      {/* Hover label */}
                      {isHovered && (
                        <text
                          x={n.x + r + 8}
                          y={n.y + 4}
                          fill="#1A1612"
                          fontSize={11 / view.scale}
                          style={{ fontFamily: "var(--font-inter)", pointerEvents: "none" }}
                        >
                          {d.title}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Detail panel (40%) */}
        <div
          className="h-full overflow-y-auto bg-white dark:bg-[#0a0a0a]"
          style={{ width: "40%", borderLeft: "1px solid rgba(120, 113, 108, 0.2)" }}
        >
          {selected ? (
            <DetailPanel
              decision={selected}
              onSelect={(id) => setSelectedId(id)}
              onAvatarContext={(person, x, y) => setContextMenu({ person, x, y })}
            />
          ) : (
            <div className="h-full flex items-center justify-center px-8">
              <p className="text-[13px] text-[#78716C] text-center max-w-[28ch]">
                Pick a node. The constellation is the map; this panel is the placard.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          person={contextMenu.person}
          onClose={() => setContextMenu(null)}
          onGenerate={(p) => {
            setContextMenu(null)
            setDepartureFor(p)
          }}
        />
      )}

      {/* Departure pack modal */}
      {departureFor && (
        <DeparturePackModal person={departureFor} onClose={() => setDepartureFor(null)} onJump={(id) => { setDepartureFor(null); setSelectedId(id) }} />
      )}
    </div>
  )
}

function DetailPanel({
  decision,
  onSelect,
  onAvatarContext,
}: {
  decision: Decision
  onSelect: (id: string) => void
  onAvatarContext: (person: Person, x: number, y: number) => void
}) {
  const participants = decision.participantIds.map((id) => PERSON_BY_ID[id]).filter(Boolean) as Person[]
  const visible = participants.slice(0, 8)
  const overflow = Math.max(0, participants.length - 8)
  const dependents = DECISIONS.filter((d) => d.dependsOn.includes(decision.id))

  return (
    <div className="p-8" style={{ fontFamily: "var(--font-inter)" }}>
      <h2 className="text-[22px] leading-tight text-[#1A1612] dark:text-white tracking-tight">{decision.title}</h2>
      <p className="text-[13px] text-[#1A1612] dark:text-white mt-4" style={{ lineHeight: "24px" }}>
        {decision.summary}
      </p>

      <section className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">Participants</div>
        <div className="flex items-center gap-2">
          {visible.map((p) => (
            <AvatarCircle key={p.id} person={p} onContext={onAvatarContext} />
          ))}
          {overflow > 0 && (
            <span className="text-[11px] text-[#78716C] ml-1">+{overflow}</span>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">Sources</div>
        <ul className="space-y-3">
          {decision.sources.map((s) => {
            const Icon = SOURCE_ICON[s.kind]
            return (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <Icon className="w-4 h-4 text-[#78716C] shrink-0" strokeWidth={1.5} />
                  <span className="text-[13px] text-[#1A1612] dark:text-white truncate group-hover:text-[#B8543D] transition-colors">{s.title}</span>
                  <span className="text-[11px] text-[#78716C] ml-auto shrink-0">{s.timestamp}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-3">What depends on this</div>
        {dependents.length === 0 ? (
          <p className="text-[12px] text-[#78716C]">Nothing depends on this — yet.</p>
        ) : (
          <ul className="space-y-2">
            {dependents.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => onSelect(d.id)}
                  className="text-left text-[13px] text-[#1A1612] dark:text-white hover:text-[#B8543D] transition-colors w-full truncate"
                >
                  {d.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <a href="#" className="text-[13px] text-[#B8543D] hover:underline">View full thread →</a>
      </div>
    </div>
  )
}

function AvatarCircle({
  person,
  onContext,
}: {
  person: Person
  onContext: (person: Person, x: number, y: number) => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onContextMenu={(e) => {
        e.preventDefault()
        onContext(person, e.clientX, e.clientY)
      }}
    >
      <img
        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(person.seed)}`}
        alt={person.name}
        className="w-6 h-6 rounded-full bg-[#1A1612] shrink-0 cursor-pointer"
        draggable={false}
      />
      {hover && (
        <div className="absolute z-20 -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1612] text-white text-[11px] px-2 py-1 rounded-[2px] pointer-events-none">
          {person.name}
        </div>
      )}
    </div>
  )
}

function ContextMenu({
  x,
  y,
  person,
  onClose,
  onGenerate,
}: {
  x: number
  y: number
  person: Person
  onClose: () => void
  onGenerate: (p: Person) => void
}) {
  const style: CSSProperties = {
    position: "fixed",
    left: x,
    top: y,
    zIndex: 60,
  }
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <div
        style={style}
        className="bg-white dark:bg-[#0a0a0a] border border-[#78716C] rounded-[2px] shadow-lg py-1 min-w-[200px]"
        role="menu"
      >
        <div className="px-3 py-1 text-[11px] text-[#78716C] uppercase tracking-[0.5px]">{person.name}</div>
        <button
          type="button"
          onClick={() => onGenerate(person)}
          className="w-full text-left px-3 py-1.5 text-[13px] text-[#1A1612] dark:text-white hover:bg-[#FAF8F5] dark:hover:bg-white/5"
        >
          Generate departure pack
        </button>
      </div>
    </>
  )
}

function DeparturePackModal({
  person,
  onClose,
  onJump,
}: {
  person: Person
  onClose: () => void
  onJump: (id: string) => void
}) {
  const loadBearing = DECISIONS.filter((d) => d.participantIds.includes(person.id))
  const fragileOwned = loadBearing.filter((d) => d.isFragile)

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#050505] overflow-y-auto">
      <div className="max-w-[760px] mx-auto px-10 py-12" style={{ fontFamily: "var(--font-inter)" }}>
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(person.seed)}`}
              alt={person.name}
              className="w-12 h-12 rounded-full bg-[#1A1612]"
            />
            <div>
              <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C]">Departure pack</div>
              <h1 className="text-[22px] text-[#1A1612] dark:text-white tracking-tight">{person.name}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#78716C] hover:text-[#1A1612] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="mb-12">
          <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-4">Go ask them now</div>
          <ul className="space-y-3">
            {fragileOwned.length === 0 ? (
              <li className="text-[13px] text-[#78716C]">No fragile decisions owned by {person.name.split(" ")[0]}.</li>
            ) : (
              fragileOwned.map((d) => (
                <li key={d.id} className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 accent-[#B8543D]" />
                  <button
                    type="button"
                    onClick={() => onJump(d.id)}
                    className="text-left text-[13px] text-[#1A1612] dark:text-white hover:text-[#B8543D] transition-colors"
                  >
                    {d.title}
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <div className="text-[11px] uppercase tracking-[0.5px] text-[#78716C] mb-4">Load-bearing decisions</div>
          {loadBearing.length === 0 ? (
            <p className="text-[13px] text-[#78716C]">No decisions on record for this person.</p>
          ) : (
            <ul className="space-y-6">
              {loadBearing.map((d) => (
                <li key={d.id} className="border-b border-[#78716C]/15 pb-6 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onJump(d.id)}
                    className="text-left text-[15px] text-[#1A1612] dark:text-white hover:text-[#B8543D] transition-colors"
                  >
                    {d.title}
                  </button>
                  <p className="text-[13px] text-[#1A1612]/70 dark:text-white/70 mt-2" style={{ lineHeight: "22px" }}>
                    {d.summary}
                  </p>
                  <div className="text-[11px] text-[#78716C] mt-2">
                    {d.isFragile ? "Bus-factor 1 · " : ""}
                    Last activity {d.daysSinceActivity}d ago
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
