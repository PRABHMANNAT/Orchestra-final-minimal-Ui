"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, RefreshCw, Trash2, X } from "lucide-react"
import {
  decisionEdges,
  decisionNodes,
  diagramCode,
  exportOptions,
  historyEntries,
  initialSections,
  sources,
  type DecideSection,
  type DocSection,
  type ExportKey,
  type HistoryEntry,
  type Mode,
  type SourceId,
} from "@/lib/northstar-context-data"

type ReviewType = "contradiction" | "confirmEdit" | "conflictEdit"

export default function LiveDocPage() {
  return <DecideWorkspace />
}

export function DecideWorkspace() {
  const [section, setSection] = useState<DecideSection>("Doc")
  const [mode, setMode] = useState<Mode>("Auto")
  const [sections, setSections] = useState<DocSection[]>(initialSections)
  const [sourceRail, setSourceRail] = useState<SourceId[] | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const [activeExport, setActiveExport] = useState<ExportKey | null>(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(false)
  const [flashSection, setFlashSection] = useState<string | null>(null)
  const [review, setReview] = useState<ReviewType | null>(null)

  const openSources = (ids: SourceId[]) => {
    setSourceRail((current) => current?.join(",") === ids.join(",") ? null : ids)
  }

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
    window.dispatchEvent(new CustomEvent("orchestra-section-change", { detail: { route: "decide", section } }))
  }, [section])

  useEffect(() => {
    const handleExport = (event: Event) => {
      const exportKey = (event as CustomEvent<{ exportKey: ExportKey }>).detail?.exportKey
      if (section === "Doc" && exportKey) setActiveExport(exportKey)
      if (section === "Flowchart") document.getElementById("decide-flowchart-canvas")?.scrollIntoView({ block: "center", behavior: "smooth" })
      if (section === "History") document.getElementById("history-pr418")?.scrollIntoView({ block: "center", behavior: "smooth" })
    }
    const handlePrompt = (event: Event) => {
      const prompt = (event as CustomEvent<{ prompt: string }>).detail?.prompt?.toLowerCase() || ""
      if (section !== "Doc") {
        if (section === "Flowchart") document.getElementById("node-preview")?.scrollIntoView({ block: "center", behavior: "smooth" })
        if (section === "History") document.getElementById("history-pr418")?.scrollIntoView({ block: "center", behavior: "smooth" })
        return
      }
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
  }, [mode, section])

  return (
    <div className="h-full w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]" onClick={() => setTooltip(null)} style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui" }}>
      <main className={`flex h-full min-w-0 flex-col transition-[margin] duration-300 ${sourceRail ? "mr-[340px]" : "mr-0"}`}>
        <TopBar section={section} setSection={setSection} mode={mode} setMode={setMode} onPrMerge={triggerPrMerge} onContradiction={() => setReview("contradiction")} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeExport && section === "Doc" ? (
            <ExportCanvas exportKey={activeExport} sections={sections} copied={copied} setCopied={setCopied} onClose={() => setActiveExport(null)} />
          ) : section === "Flowchart" ? (
            <DecideFlowchart openSources={openSources} />
          ) : section === "History" ? (
            <DecideHistory openSources={openSources} setTooltip={setTooltip} />
          ) : (
            <DecideDoc
              sections={sections}
              setSections={setSections}
              flashSection={flashSection}
              openSources={openSources}
              setTooltip={setTooltip}
            />
          )}
        </div>
      </main>

      {sourceRail && <SourceRail ids={sourceRail} onClose={() => setSourceRail(null)} />}
      {tooltip && <div className="fixed z-[80] -translate-x-1/2 rounded-md bg-[var(--text-primary)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--accent-on-rust)]" style={{ left: tooltip.x, top: tooltip.y - 38 }}>{tooltip.text}</div>}
      {review && <ReviewOverlay type={review} mode={mode} onDismiss={() => setReview(null)} onAccept={acceptEdit} />}
      {toast && <Toast />}
    </div>
  )
}

export function SectionSwitch<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <div className="flex rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] p-1">
      {options.map((item) => (
        <button key={item} onClick={() => onChange(item)} className={`h-7 rounded-full px-4 text-[12px] transition ${value === item ? "bg-[var(--accent-rust-strong)] text-[var(--accent-on-rust)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-canvas)]"}`}>
          {item}
        </button>
      ))}
    </div>
  )
}

function TopBar({ section, setSection, mode, setMode, onPrMerge, onContradiction }: { section: DecideSection; setSection: (section: DecideSection) => void; mode: Mode; setMode: (mode: Mode) => void; onPrMerge: () => void; onContradiction: () => void }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b-[1.5px] border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-6">
      <div className="whitespace-nowrap text-[13px] font-medium">Northstar Cloud · Context</div>
      <div className="flex min-w-0 items-center gap-3">
        <SectionSwitch value={section} options={["Doc", "Flowchart", "History"]} onChange={setSection} />
        <button onClick={onPrMerge} className="hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-rust)] lg:block">PR #418 merged</button>
        <button onClick={onContradiction} className="hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-rust)] lg:block">contradiction event</button>
        <div className="hidden text-[12px] text-[var(--text-muted)] xl:block">Contradictions always require confirm, even in Auto.</div>
        <SectionSwitch value={mode} options={["Auto", "Confirm"]} onChange={setMode} />
      </div>
    </header>
  )
}

function DecideDoc({ sections, setSections, flashSection, openSources, setTooltip }: { sections: DocSection[]; setSections: React.Dispatch<React.SetStateAction<DocSection[]>>; flashSection: string | null; openSources: (ids: SourceId[]) => void; setTooltip: (value: { text: string; x: number; y: number } | null) => void }) {
  const convertToAuthored = (id: string, body: string) => {
    setSections((items) => items.map((item) => item.id === id ? { ...item, body, sourceIds: [], highlight: undefined, authored: true } : item))
  }
  const linkSource = () => {
    setSections((items) => items.map((item) => item.id === "rate-unsourced" ? { ...item, sourceIds: ["c10"], highlight: "Rate limits should protect ingestion", authored: false } : item))
    openSources(["c10"])
  }
  const addSection = () => setSections((items) => [...items, { id: `authored-${Date.now()}`, body: "New authored context...", tags: ["agent"], sourceIds: [], authored: true }])
  const deleteSection = (id: string) => setSections((items) => items.filter((item) => item.id !== id))

  return (
    <div className="mx-auto max-w-[1040px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-300 2xl:px-16 2xl:py-16">
      <div className="font-mono text-[11px] text-[var(--text-muted)]">CTX-2026.05.23</div>
      <h1 className="mt-3 max-w-[760px] text-[40px] font-semibold leading-[1.05] tracking-[-0.02em]">Current truth -&gt; export as anything</h1>
      <p className="mt-5 max-w-[760px] text-[14px] leading-6 text-[var(--text-muted)]">This is a curated current-truth context layer, not a wiki. Stale material is auditable via sources but excluded from generated exports.</p>
      <div className="mt-10 space-y-7">
        {sections.map((docSection, index) => (
          <DocSectionBlock
            key={docSection.id}
            section={docSection}
            index={index}
            flash={flashSection === docSection.id}
            openSources={openSources}
            setTooltip={setTooltip}
            convertToAuthored={convertToAuthored}
            linkSource={linkSource}
            deleteSection={deleteSection}
          />
        ))}
      </div>
      <button onClick={addSection} className="mt-8 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2 text-[13px] text-[var(--accent-rust)] hover:bg-[var(--accent-rust-soft)]">Add section</button>
    </div>
  )
}

function DecideFlowchart({ openSources }: { openSources: (ids: SourceId[]) => void }) {
  const [edgesReady, setEdgesReady] = useState(false)
  const nodeById = useMemo(() => Object.fromEntries(decisionNodes.map((node) => [node.id, node])), [])
  const nodeCount = decisionNodes.length
  const nodeWidth = 214
  const nodeHeight = 122

  useEffect(() => {
    console.log(`DecideFlowchart nodes mounted: ${nodeCount}`)
    const timer = window.setTimeout(() => setEdgesReady(true), 360)
    return () => window.clearTimeout(timer)
  }, [nodeCount])

  const connectionPoint = (fromId: string, toId: string) => {
    const from = nodeById[fromId]
    const to = nodeById[toId]
    if (!from || !to) return null

    const fromCenter = { x: from.x + nodeWidth / 2, y: from.y + nodeHeight / 2 }
    const toCenter = { x: to.x + nodeWidth / 2, y: to.y + nodeHeight / 2 }
    const dx = toCenter.x - fromCenter.x
    const dy = toCenter.y - fromCenter.y
    const fromScale = Math.min(
      Math.abs(dx) > 0 ? nodeWidth / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY,
      Math.abs(dy) > 0 ? nodeHeight / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY,
    )
    const toScale = Math.min(
      Math.abs(dx) > 0 ? nodeWidth / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY,
      Math.abs(dy) > 0 ? nodeHeight / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY,
    )

    return {
      start: { x: fromCenter.x + dx * fromScale, y: fromCenter.y + dy * fromScale },
      end: { x: toCenter.x - dx * toScale, y: toCenter.y - dy * toScale },
    }
  }

  return (
    <div id="decide-flowchart-canvas" className="mx-auto max-w-[1120px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-300 2xl:px-16 2xl:py-16">
      <div className="font-mono text-[11px] text-[var(--text-muted)]">CTX-2026.05.23 · DECISION DAG</div>
      <h1 className="mt-3 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-[-0.02em]">Northstar decisions, dependencies, and one contradiction.</h1>
      <div className="mt-8 overflow-x-auto rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
        <div className="relative h-[700px] min-w-[1100px]" role="img" aria-label="Northstar decision dependency flowchart">
          <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 1100 700" aria-hidden="true">
            <defs>
              <marker id="rustArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--accent-rust)" />
              </marker>
              <marker id="mutedArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--text-muted)" />
              </marker>
            </defs>
            {edgesReady && decisionEdges.map((edge, index) => {
              const points = connectionPoint(edge.from, edge.to)
              if (!points) return null
              const isSupersede = edge.kind === "supersedes"
              const dx = points.end.x - points.start.x
              const midOffset = Math.max(40, Math.abs(dx) * 0.42)
              const c1x = points.start.x + (dx >= 0 ? midOffset : -midOffset)
              const c2x = points.end.x - (dx >= 0 ? midOffset : -midOffset)
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={`M ${points.start.x} ${points.start.y} C ${c1x} ${points.start.y}, ${c2x} ${points.end.y}, ${points.end.x} ${points.end.y}`}
                  fill="none"
                  stroke={isSupersede ? "var(--text-muted)" : "var(--accent-rust)"}
                  strokeDasharray={isSupersede ? "6 6" : undefined}
                  strokeWidth="1.4"
                  markerEnd={isSupersede ? "url(#mutedArrow)" : "url(#rustArrow)"}
                  opacity={isSupersede ? 0.55 : 0.82}
                  className="animate-in fade-in duration-300"
                  style={{ animationDelay: `${index * 0.04}s` }}
                />
              )
            })}
          </svg>
          {decisionNodes.map((node, index) => {
            try {
              const isReview = node.state === "needs review"
              const isSuperseded = node.state === "superseded"
              return (
                <button
                  id={`node-${node.id}`}
                  key={node.id}
                  type="button"
                  onClick={() => openSources(node.sourceIds)}
                  className={`absolute z-10 flex flex-col rounded-[16px] bg-[var(--surface)] p-4 text-left transition hover:bg-[var(--bg-canvas)] animate-in fade-in slide-in-from-bottom-2 ${isReview ? "border-2 border-[var(--accent-rust)]" : "border border-[var(--border-subtle)]"}`}
                  style={{ left: node.x, top: node.y, width: nodeWidth, minHeight: nodeHeight, animationDelay: `${index * 0.06}s` }}
                >
                  <span className={`text-[13px] font-semibold leading-snug [overflow-wrap:anywhere] ${isSuperseded ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>{node.title}</span>
                  <span className="mt-3 font-mono text-[10px] leading-4 text-[var(--text-muted)]">{node.decidedBy}</span>
                  <span className="font-mono text-[10px] leading-4 text-[var(--text-muted)]">{node.date}</span>
                  {isReview && <span className="mt-auto w-fit rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">needs review</span>}
                  {isSuperseded && <span className="mt-auto w-fit rounded-full bg-[var(--text-muted-secondary)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)]">superseded</span>}
                </button>
              )
            } catch {
              return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

function DecideHistory({ openSources, setTooltip }: { openSources: (ids: SourceId[]) => void; setTooltip: (value: { text: string; x: number; y: number } | null) => void }) {
  const [filter, setFilter] = useState<"All" | "Active" | "Superseded" | "Needs review">("All")
  const visible = historyEntries.filter((entry) => {
    if (filter === "All") return true
    if (filter === "Active") return entry.status === "active"
    if (filter === "Superseded") return entry.status === "superseded"
    return entry.status === "needs review"
  })
  return (
    <div className="mx-auto max-w-[980px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-300 2xl:px-16 2xl:py-16">
      <div className="font-mono text-[11px] text-[var(--text-muted)]">CTX-2026.05.23 · DECISION HISTORY</div>
      <h1 className="mt-3 max-w-[760px] text-[36px] font-semibold leading-[1.08] tracking-[-0.02em]">How the current truth got made.</h1>
      <div className="mt-8 flex gap-3 font-mono text-[11px]">
        {(["All", "Active", "Superseded", "Needs review"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "text-[var(--accent-rust)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}>{item}</button>)}
      </div>
      <div className="mt-6 border-t border-[var(--border-subtle)]">
        {visible.map((entry) => <HistoryRow key={entry.id} entry={entry} openSources={openSources} setTooltip={setTooltip} />)}
      </div>
    </div>
  )
}

export function HistoryRow({ entry, openSources, setTooltip }: { entry: HistoryEntry; openSources: (ids: SourceId[]) => void; setTooltip: (value: { text: string; x: number; y: number } | null) => void }) {
  return (
    <div id={entry.id === "h-pr418" ? "history-pr418" : undefined} className="grid gap-4 border-b border-[var(--border-subtle)] py-5 md:grid-cols-[1fr_180px]">
      <div>
        <div className="text-[15px] font-medium">{entry.title}</div>
        <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">
          <HighlightedText text={entry.rationale} highlight={entry.highlight} sourceLocation={sources[entry.sourceIds[0]].location} setTooltip={setTooltip} openSources={() => openSources(entry.sourceIds)} />
        </p>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          {entry.supersedes && <span>supersedes → {entry.supersedes}</span>}
          {entry.supersededBy && <span>superseded by → {entry.supersededBy}</span>}
          {entry.status !== "active" && <span className="text-[var(--accent-rust)]">{entry.status}</span>}
        </div>
      </div>
      <div className="space-y-2 font-mono text-[10px] text-[var(--text-muted)]">
        <div>{entry.who}</div>
        <div>{entry.when}</div>
        <button onClick={() => openSources(entry.sourceIds)} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 text-[var(--accent-rust)]">SOURCE</button>
      </div>
    </div>
  )
}

function DocSectionBlock({ section, index, flash, openSources, setTooltip, convertToAuthored, linkSource, deleteSection }: { section: DocSection; index: number; flash: boolean; openSources: (ids: SourceId[]) => void; setTooltip: (value: { text: string; x: number; y: number } | null) => void; convertToAuthored: (id: string, body: string) => void; linkSource: () => void; deleteSection: (id: string) => void }) {
  if (section.design) return <DesignSystemSection section={section} index={index} openSources={openSources} />
  if (section.diagram) return <DiagramSection section={section} index={index} openSources={openSources} />
  const sourceLocation = section.sourceIds[0] ? sources[section.sourceIds[0]].location : ""
  return (
    <section className={`group rounded-[16px] border border-transparent p-4 transition-all animate-in fade-in slide-in-from-bottom-2 ${flash ? "border-l-4 border-l-[var(--accent-rust)] bg-[var(--accent-rust-soft)]" : "hover:border-[var(--border-subtle)] hover:bg-[var(--surface)]/55"}`} style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={linkSource} deleteSection={deleteSection} />
      {section.heading && <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">{section.heading}</h2>}
      <p contentEditable suppressContentEditableWarning onInput={(event) => convertToAuthored(section.id, event.currentTarget.innerText)} className="text-[16px] leading-[1.9] outline-none">
        <HighlightedText text={section.body} highlight={section.highlight} sourceLocation={sourceLocation} setTooltip={setTooltip} openSources={() => section.sourceIds.length && openSources(section.sourceIds)} />
      </p>
      {section.stale && <div className="mt-3 font-mono text-[10px] text-[var(--text-muted)]">Stale policy: superseded content is linked for audit but excluded from generated exports.</div>}
    </section>
  )
}

export function HighlightedText({ text, highlight, sourceLocation, setTooltip, openSources }: { text: string; highlight?: string; sourceLocation: string; setTooltip: (value: { text: string; x: number; y: number } | null) => void; openSources: () => void }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const [before, after] = text.split(highlight)
  return (
    <>
      {before}
      <mark onClick={(event) => { event.stopPropagation(); setTooltip({ text: `SOURCE: ${sourceLocation}`, x: event.clientX, y: event.clientY }); openSources() }} className="cursor-pointer rounded bg-[var(--highlight)] px-1 transition-colors hover:bg-[var(--highlight-hover)]">{highlight}</mark>
      {after}
    </>
  )
}

function SectionHoverPills({ section, openSources, linkSource, deleteSection }: { section: DocSection; openSources: (ids: SourceId[]) => void; linkSource: () => void; deleteSection: (id: string) => void }) {
  return (
    <div className="mb-3 hidden flex-wrap items-center gap-2 group-hover:flex">
      {section.tags.map((tag) => <span key={tag} className="rounded-full bg-[var(--bg-canvas)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)]">{tag}</span>)}
      {section.authored && <span className="rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">authored</span>}
      {section.sourceIds.length > 0 ? <button onClick={() => openSources(section.sourceIds)} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">Source</button> : <button onClick={linkSource} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">link source?</button>}
      {section.authored && <button onClick={() => deleteSection(section.id)} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]"><Trash2 className="inline h-3 w-3" /> delete</button>}
    </div>
  )
}

function DesignSystemSection({ section, index, openSources }: { section: DocSection; index: number; openSources: (ids: SourceId[]) => void }) {
  const palette = [["Canvas", "bg.canvas", "#F4F7FB"], ["Surface", "surface.base", "#FFFFFF"], ["Text", "text.primary", "#111827"], ["Muted", "text.muted", "#64748B"], ["Accent", "brand.accent", "#2563EB"]]
  return (
    <section className="group rounded-[16px] p-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={() => undefined} deleteSection={() => undefined} />
      <h2 className="mb-4 font-mono text-[12px] font-semibold uppercase tracking-[0.16em]">DESIGN SYSTEM</h2>
      <div className="grid gap-3 md:grid-cols-5">
        {palette.map(([label, token, hex]) => <div key={token} className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-3"><div className="font-mono text-[10px] text-[var(--text-muted)]">{label}</div><div className="my-3 h-16 rounded-xl border border-[var(--border-subtle)]" style={{ background: hex }} /><div className="font-mono text-[11px]">{hex}</div><div className="font-mono text-[10px] text-[var(--text-muted)]">{token}</div></div>)}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><div className="flex justify-between"><div className="font-serif text-[22px]">Inter</div><button onClick={() => openSources(section.sourceIds)} className="rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">Source</button></div><div className="mt-2 font-mono text-[10px] text-[var(--text-muted)]">JetBrains Mono for metadata</div><p className="mt-4 text-[18px]">Usage replay verified before entitlement unlock.</p><div className="mt-4 font-mono text-[10px] text-[var(--text-muted)]">FREE · GOOGLE FONTS + JETBRAINS</div></div>
        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><div className="font-serif text-[22px]">Tokens</div><div className="mt-4 flex flex-wrap gap-2">{["radius.card: 10px", "radius.pill: 999px", "space: 4/8/12/16/24"].map((pill) => <span key={pill} className="rounded-full bg-[var(--bg-canvas)] px-3 py-2 font-mono text-[11px]">{pill}</span>)}</div></div>
      </div>
    </section>
  )
}

function DiagramSection({ section, index, openSources }: { section: DocSection; index: number; openSources: (ids: SourceId[]) => void }) {
  return (
    <section className="group rounded-[16px] p-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 0.06}s` }}>
      <SectionHoverPills section={section} openSources={openSources} linkSource={() => undefined} deleteSection={() => undefined} />
      <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-[24px]">Billing context flow</h2><div className="font-mono text-[10px] text-[var(--text-muted)]">Diagram export</div></div><span className="rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">Mermaid</span></div><MermaidPreview /><pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--bg-canvas)] p-4 font-mono text-[12px] leading-6 text-[var(--text-primary)]">{diagramCode}</pre></div>
    </section>
  )
}

export function MermaidPreview() {
  const nodes = ["SDK", "ING", "UE", "LEDGER", "SNAP", "PREVIEW", "RECON", "ENT", "UI", "OBS"]
  return <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><div className="flex min-w-[760px] items-center gap-2 font-mono text-[11px]">{nodes.map((node, i) => <div key={node} className="flex items-center gap-2">{i > 0 && <span className="text-[var(--accent-rust)]">→</span>}<span className="rounded-lg border border-[var(--accent-rust)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text-primary)]">{node}</span></div>)}</div></div>
}

export function SourceRail({ ids, onClose }: { ids: SourceId[]; onClose: () => void }) {
  return (
    <aside className="fixed right-0 top-0 z-50 h-full w-[340px] animate-in slide-in-from-right duration-200 overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
      <div className="mb-4 flex h-10 items-center justify-between"><div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">SOURCES</div><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]"><X className="h-4 w-4" /></button></div>
      <div className="space-y-3">{ids.map((id) => { const source = sources[id]; return <div key={id} className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] font-semibold">{source.author}</div><div className="font-mono text-[10px] text-[var(--text-muted)]">{source.time}, {source.date}</div></div><span className="rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">SOURCE</span></div><p className="mt-4 text-[13px] leading-6">{source.content}</p><div className="mt-4 font-mono text-[10px] italic text-[var(--text-muted)]">{source.location}</div></div> })}</div>
    </aside>
  )
}

function ExportCanvas({ exportKey, sections, copied, setCopied, onClose }: { exportKey: ExportKey; sections: DocSection[]; copied: boolean; setCopied: (value: boolean) => void; onClose: () => void }) {
  const option = exportOptions.find((item) => item.key === exportKey)!
  const content = useMemo(() => buildExport(exportKey, sections), [exportKey, sections])
  const copy = async () => { await navigator.clipboard?.writeText(content); setCopied(true); window.setTimeout(() => setCopied(false), 1300) }
  return <div className="mx-auto max-w-[1040px] animate-in fade-in slide-in-from-bottom-3 px-10 py-10 duration-200 2xl:px-16 2xl:py-16"><div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[11px] text-[var(--text-muted)]">{option.file}</div><h1 className="mt-1 font-serif text-[28px]">{option.label}</h1><div className="mt-1 text-[13px] text-[var(--text-muted)]">{option.lens}</div></div><div className="flex gap-2"><button onClick={copy} className="flex h-9 items-center gap-2 rounded-full bg-[var(--text-primary)] px-4 text-[12px] text-[var(--accent-on-rust)]"><Copy className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}</button><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-subtle)]"><X className="h-4 w-4" /></button></div></div></div><div className="mt-4 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">{exportKey === "diagram" ? <><MermaidPreview /><pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--bg-canvas)] p-4 font-mono text-[13px] leading-7">{content}</pre></> : <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-7">{content}</pre>}</div></div>
}

function buildExport(key: ExportKey, sections: DocSection[]) {
  if (key === "diagram") return diagramCode
  const tag = key === "payments" ? "payments" : key
  return sections.filter((section) => !section.stale && !section.design && !section.diagram && (key === "agent" || section.tags.includes(tag))).map((section) => `${section.heading ? `## ${section.heading}\n` : ""}${section.body}`).join("\n\n")
}

function ReviewOverlay({ type, mode, onDismiss, onAccept }: { type: ReviewType; mode: Mode; onDismiss: () => void; onAccept: () => void }) {
  const isConflict = type === "contradiction" || type === "conflictEdit"
  return <div className="fixed left-[396px] right-10 top-20 z-[70] max-w-[900px] animate-in fade-in slide-in-from-top-3 rounded-[16px] border border-[var(--accent-rust)] bg-[var(--surface)] p-5 shadow-2xl"><div className="flex flex-wrap items-center gap-2"><div className="font-mono text-[11px] font-semibold text-[var(--accent-rust)]">{isConflict ? "NEEDS REVIEW" : "SOCRATES PROPOSED EDIT"}</div><span className="rounded-full bg-[var(--accent-rust-soft)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)]">{isConflict ? "contradicts prior decision" : mode}</span></div><p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">{isConflict ? "Contradicts the accepted BillingPort boundary from PR #418, so it requires confirm even in Auto mode." : "Socrates drafted this as authored context without a confirmed source."}</p>{isConflict ? <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-[var(--bg-canvas)] p-4"><div className="font-mono text-[10px] text-[var(--text-muted)]">Accepted decision</div><p className="mt-2 text-[13px] leading-5">Stripe remains isolated behind BillingPort; invoice preview reads ledger state without calling Stripe directly.</p></div><div className="rounded-xl bg-[var(--bg-canvas)] p-4"><div className="font-mono text-[10px] text-[var(--text-muted)]">Incoming source claim</div><p className="mt-2 text-[13px] leading-5">Allow invoice preview to call Stripe subscription state directly during beta.</p></div></div> : <div className="mt-4 rounded-xl bg-[var(--bg-canvas)] p-4"><div className="font-mono text-[10px] text-[var(--text-muted)]">Preview title</div><p className="mt-2 text-[13px] font-semibold">Rate limiting</p><p className="mt-2 text-[13px] leading-5">Rate limiting should apply at ingestion per workspace and SDK key, with replay jobs exempted through a signed internal queue path.</p></div>}<div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="font-mono text-[10px] text-[var(--text-muted)]">Slack #eng-billing · Sarah Kim · "let preview call Stripe for beta?" · 11:08 AM</div><div className="flex gap-2"><button onClick={onDismiss} className="h-9 rounded-full border border-[var(--border-subtle)] px-4 text-[12px]">Dismiss</button><button onClick={onAccept} className="h-9 rounded-full bg-[var(--accent-rust-strong)] px-4 text-[12px] text-[var(--accent-on-rust)]">Accept change</button></div></div></div>
}

function Toast() {
  return <div className="fixed bottom-6 right-6 z-[90] flex animate-in slide-in-from-bottom-3 items-center gap-3 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 shadow-xl"><div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-rust-soft)] text-[var(--accent-rust)]"><Check className="h-4 w-4" /></div><div><div className="text-[13px] font-medium">Source changed · doc updated · exports regenerated</div><div className="flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">10:42 AM <RefreshCw className="h-3 w-3" /> agent, backend, payments, diagram</div></div></div>
}
