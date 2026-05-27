"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  busFactorRows,
  historyEntries,
  ownershipConcentrationRows,
  plannedDepartureQuestions,
  plannedDepartureRationale,
  predecessorPack,
  statusChanges,
  type SourceId,
  type StatusSection,
} from "@/lib/northstar-context-data"
import { SectionSwitch, SourceRail } from "@/app/projects/1/live-doc/page"

const rowMotion = {
  hidden: { opacity: 0, y: 12 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: index * 0.04, ease: "easeOut" },
  }),
}

export default function StatusPage() {
  const [section, setSection] = useState<StatusSection>("Dashboard")
  const [sourceRail, setSourceRail] = useState<SourceId[] | null>(null)

  const openSources = (ids: SourceId[]) => setSourceRail((current) => current?.join(",") === ids.join(",") ? null : ids)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("orchestra-section-change", { detail: { route: "status", section } }))
  }, [section])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]" style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui" }}>
      <main className={`flex h-full min-w-0 flex-col transition-[margin] duration-300 ${sourceRail ? "mr-[340px]" : "mr-0"}`}>
        <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b-[1.5px] border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-6">
          <div className="text-[13px] font-medium">Northstar Cloud · Status</div>
          <SectionSwitch value={section} options={["Dashboard", "Bus factor", "Planned departure", "Already gone"]} onChange={setSection} />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {section === "Dashboard" && <StatusDashboard openSources={openSources} />}
          {section === "Bus factor" && <StatusBusFactor openSources={openSources} />}
          {section === "Planned departure" && <StatusPlannedDeparture openSources={openSources} />}
          {section === "Already gone" && <StatusAlreadyGone openSources={openSources} />}
        </div>
      </main>
      {sourceRail && <SourceRail ids={sourceRail} onClose={() => setSourceRail(null)} />}
    </div>
  )
}

function StatusDashboard({ openSources }: { openSources: (ids: SourceId[]) => void }) {
  return (
    <StatusCanvas>
      <div className="font-mono text-[11px] text-[var(--text-muted)]">Northstar Cloud · context fresh as of 10:42 AM · CTX-2026.05.23</div>
      <SectionLabel className="mt-10">Recent changes</SectionLabel>
      <div className="mt-3 border-t border-[var(--border-subtle)]">
        {statusChanges.map((item, index) => (
          <motion.div key={item.id} custom={index} initial="hidden" animate="show" variants={rowMotion} className="grid gap-4 border-b border-[var(--border-subtle)] py-5 md:grid-cols-[1fr_170px]">
            <div className="text-[14px] leading-6">{item.text}</div>
            <RowMeta who={item.who} when={item.when} sourceIds={item.sourceIds} openSources={openSources} />
          </motion.div>
        ))}
      </div>
      <SectionLabel className="mt-10">Freshness</SectionLabel>
      <div className="mt-3 max-w-[760px] border-t border-[var(--border-subtle)]">
        {[
          ["Backend contracts", "updated 2h ago", false],
          ["Payments", "updated today", false],
          ["Design system", "updated 3d ago", false],
          ["Frontend", "stale, 9d ago", true],
        ].map(([area, freshness, stale], index) => (
          <motion.div key={area as string} custom={index} initial="hidden" animate="show" variants={rowMotion} className="flex items-center justify-between border-b border-[var(--border-subtle)] py-4 text-[13px]">
            <div className="flex items-center gap-3">{stale && <span className="h-2 w-2 rounded-full bg-[var(--accent-rust-strong)]" />}<span>{area}</span></div>
            <div className="font-mono text-[10px] text-[var(--text-muted)]">{freshness}</div>
          </motion.div>
        ))}
      </div>
    </StatusCanvas>
  )
}

function StatusBusFactor({ openSources }: { openSources: (ids: SourceId[]) => void }) {
  return (
    <StatusCanvas>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionLabel>Single-owner systems</SectionLabel>
          <div className="mt-3 border-t border-[var(--border-subtle)]">
            {busFactorRows.map((row, index) => (
              <motion.div key={row.area} custom={index} initial="hidden" animate="show" variants={rowMotion} className="grid gap-4 border-b border-[var(--border-subtle)] py-5 md:grid-cols-[1fr_180px]">
                <div>
                  <div className="flex items-center gap-3 text-[15px] font-medium">{row.highRisk && <span className="h-2 w-2 rounded-full bg-[var(--accent-rust-strong)]" />}{row.area}</div>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{row.risk}</p>
                </div>
                <RowMeta who={row.owner} when={row.lastTouched} sourceIds={row.sourceIds} openSources={openSources} />
              </motion.div>
            ))}
          </div>
        </div>
        <OwnershipConcentrationGraph />
      </div>
    </StatusCanvas>
  )
}

function StatusPlannedDeparture({ openSources }: { openSources: (ids: SourceId[]) => void }) {
  const [checked, setChecked] = useState<string[]>([])
  const toggle = (item: string) => setChecked((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item])
  return (
    <StatusCanvas>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="font-mono text-[11px] text-[var(--text-muted)]">Marcus Thompson · leaving in 3 weeks</div>
          <p className="mt-3 max-w-[620px] text-[20px] leading-8">He&apos;s the only person who&apos;s touched billing&apos;s core safety logic. Here&apos;s what to capture before he goes.</p>

          <SectionLabel className="mt-10">Rationale pack</SectionLabel>
          <div className="mt-3 border-t border-[var(--border-subtle)]">
            {plannedDepartureRationale.map((item, index) => (
              <motion.div key={item.title} custom={index} initial="hidden" animate="show" variants={rowMotion} className="grid gap-4 border-b border-[var(--border-subtle)] py-5 md:grid-cols-[1fr_120px]">
                <div>
                  <div className="text-[15px] font-medium">{item.title}</div>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{item.detail}</p>
                </div>
                <SourceChip sourceIds={item.sourceIds} openSources={openSources} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <SectionLabel>Go ask them before they leave</SectionLabel>
            <div className={checked.length === plannedDepartureQuestions.length ? "font-mono text-[11px] text-[var(--accent-rust)]" : "font-mono text-[11px] text-[var(--text-muted)]"}>{checked.length} / {plannedDepartureQuestions.length} captured</div>
          </div>
          <div className="mt-3 border-t border-[var(--border-subtle)]">
            {plannedDepartureQuestions.map((question, index) => (
              <ChecklistRow
                key={question.title}
                checked={checked.includes(question.title)}
                index={index}
                title={question.title}
                detail={question.detail}
                onToggle={() => toggle(question.title)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <OwnershipConcentrationGraph compact />
          <KnowledgeProgressArc captured={checked.length} total={plannedDepartureQuestions.length} />
        </div>
      </div>
    </StatusCanvas>
  )
}

function StatusAlreadyGone({ openSources }: { openSources: (ids: SourceId[]) => void }) {
  const [checked, setChecked] = useState<string[]>([])
  const toggle = (item: string) => setChecked((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item])
  return (
    <StatusCanvas>
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="font-mono text-[11px] text-[var(--text-muted)]">Predecessor pack · Marcus Thompson</div>
          <p className="mt-3 max-w-[620px] text-[20px] leading-8">Start with the choices that protect customers from wrong bills, then read the source that proves each one.</p>
          <div className="mt-8 border-t border-[var(--border-subtle)]">
            {predecessorPack.map((item, index) => {
              const sourceIds = historyEntries[index % historyEntries.length].sourceIds
              return (
                <motion.label key={item} custom={index} initial="hidden" animate="show" variants={rowMotion} className={`grid cursor-pointer gap-4 border-b border-[var(--border-subtle)] py-5 md:grid-cols-[28px_1fr_120px] ${checked.includes(item) ? "border-l-2 border-l-[var(--accent-rust)] pl-3" : ""}`}>
                  <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} className="mt-1 accent-[var(--accent-rust)]" />
                  <span className={`text-[13px] leading-6 transition-colors duration-200 ${checked.includes(item) ? "text-[var(--text-muted)] line-through" : ""}`}>{item}</span>
                  <SourceChip sourceIds={sourceIds} openSources={openSources} />
                </motion.label>
              )
            })}
          </div>
        </div>
        <KnowledgeProgressArc captured={checked.length} total={predecessorPack.length} label="Ramp reviewed" />
      </div>
    </StatusCanvas>
  )
}

function OwnershipConcentrationGraph({ compact = false }: { compact?: boolean }) {
  const maxPeople = 3
  return (
    <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
      <SectionLabel>{compact ? "Ownership" : "Ownership concentration"}</SectionLabel>
      <div className="mt-4 space-y-4">
        {ownershipConcentrationRows.map((row, index) => {
          const width = `${Math.max(18, (row.people / maxPeople) * 100)}%`
          return (
            <div key={row.label}>
              <div className="mb-1 flex justify-between gap-3 font-mono text-[10px] text-[var(--text-muted)]">
                <span>{row.label}</span>
                <span>{row.people} {row.people === 1 ? "person" : "people"}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-canvas)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width }}
                  transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                  className="h-2 rounded-full"
                  style={{ background: row.highRisk ? "var(--accent-rust)" : "var(--text-primary)", opacity: row.highRisk ? 1 : 0.42 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KnowledgeProgressArc({ captured, total, label = "Knowledge captured" }: { captured: number; total: number; label?: string }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const progress = total === 0 ? 0 : captured / total
  const dash = circumference * (1 - progress)
  const complete = captured === total
  return (
    <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-4 flex items-center gap-5">
        <svg width="112" height="112" viewBox="0 0 112 112" className={complete ? "animate-pulse" : ""}>
          <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--bg-canvas)" strokeWidth="8" />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="var(--accent-rust)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            transform="rotate(-90 56 56)"
          />
          {complete && <path d="M42 56 L52 66 L72 44" fill="none" stroke="var(--accent-rust)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <div>
          <div className="font-mono text-[18px] text-[var(--text-primary)]">{captured} / {total}</div>
          <div className="mt-1 text-[12px] leading-5 text-[var(--text-muted)]">Each checked item is one risk removed from Marcus&apos;s head.</div>
        </div>
      </div>
    </div>
  )
}

function ChecklistRow({ checked, index, title, detail, onToggle }: { checked: boolean; index: number; title: string; detail: string; onToggle: () => void }) {
  return (
    <motion.label custom={index} initial="hidden" animate="show" variants={rowMotion} className={`grid cursor-pointer gap-3 border-b border-[var(--border-subtle)] py-4 text-[13px] transition-all duration-200 md:grid-cols-[28px_1fr] ${checked ? "border-l-2 border-l-[var(--accent-rust)] pl-3" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="mt-1 accent-[var(--accent-rust)]" />
      <span>
        <span className={`block transition-colors duration-200 ${checked ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>{title}</span>
        <span className={`mt-1 block text-[12px] leading-5 text-[var(--text-muted)] ${checked ? "line-through" : ""}`}>{detail}</span>
      </span>
    </motion.label>
  )
}

function RowMeta({ who, when, sourceIds, openSources }: { who: string; when: string; sourceIds: SourceId[]; openSources: (ids: SourceId[]) => void }) {
  return (
    <div className="space-y-2 font-mono text-[10px] text-[var(--text-muted)]">
      <div>{who}</div>
      <div>{when}</div>
      <SourceChip sourceIds={sourceIds} openSources={openSources} />
    </div>
  )
}

function SourceChip({ sourceIds, openSources }: { sourceIds: SourceId[]; openSources: (ids: SourceId[]) => void }) {
  return <button type="button" onClick={() => openSources(sourceIds)} className="h-fit rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] text-[var(--accent-rust)] transition duration-150 hover:-translate-y-0.5 hover:border-[var(--accent-rust)]/40">SOURCE</button>
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] ${className}`}>{children}</div>
}

function StatusCanvas({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="mx-auto max-w-[1080px] px-10 py-10 2xl:px-16 2xl:py-16">{children}</motion.div>
}
