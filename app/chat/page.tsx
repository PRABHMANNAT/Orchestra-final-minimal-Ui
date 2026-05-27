"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { Assistant } from "@/app/assistant"
import { OrchestraIntro } from "@/components/OrchestraIntro"

// ─── Constants ──────────────────────────────────────────────────────────────

const PALETTE_ITEMS: { group: string; items: { label: string; meta: string }[] }[] = [
  {
    group: "Ask",
    items: [
      { label: "Why did we move webhooks to a queue?", meta: "Recent thread" },
      { label: "Who owns the payments service?", meta: "From #payments" },
    ],
  },
  {
    group: "Decide",
    items: [{ label: "Stripe webhook redesign", meta: "ADR · 12 days ago" }],
  },
  {
    group: "Do",
    items: [{ label: "Payments queue migration", meta: "Shipping" }],
  },
  {
    group: "Know",
    items: [{ label: "Coverage report", meta: "67% indexed" }],
  },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AskPage() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        setPaletteOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main
      className="relative flex h-full min-w-0 flex-1 flex-col bg-[var(--chat-bg)] text-[var(--chat-text)]"
    >
      <TopBar
        onOpenPalette={() => setPaletteOpen(true)}
        canvasOpen={canvasOpen}
        onToggleCanvas={() => setCanvasOpen((v) => !v)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <motion.section
          layout
          data-canvas={canvasOpen ? "open" : "closed"}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group/canvas relative flex h-full min-w-0 flex-col"
          style={{ flexBasis: canvasOpen ? "45%" : "100%", flexGrow: 1 }}
        >
          <Assistant />
        </motion.section>

        <AnimatePresence initial={false}>
          {canvasOpen && (
            <motion.aside
              key="canvas"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "55%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full shrink-0 overflow-hidden border-l border-[var(--chat-border)] bg-[var(--chat-bg)]"
            >
              <Canvas />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}</AnimatePresence>
    </main>
  )
}

// ─── Components ─────────────────────────────────────────────────────────────

function TopBar({
  onOpenPalette,
  canvasOpen,
  onToggleCanvas,
}: {
  onOpenPalette: () => void
  canvasOpen: boolean
  onToggleCanvas: () => void
}) {
  return (
    <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-[var(--chat-border)] px-4">
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex items-center gap-2 px-3 py-1 text-[11px] text-[var(--chat-muted)] transition hover:text-[var(--chat-text)]"
        aria-label="Open command palette"
      >
        <span className="font-mono text-[10px] tracking-wider">⌘K</span>
        <span>Ask anything…</span>
      </button>

      <button
        type="button"
        onClick={onToggleCanvas}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-[var(--chat-muted)] transition hover:bg-[var(--chat-chip)] hover:text-[var(--chat-text)]"
        aria-label={canvasOpen ? "Hide canvas" : "Show canvas"}
        aria-pressed={canvasOpen}
        title={canvasOpen ? "Hide canvas" : "Show canvas"}
      >
        {canvasOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </button>
    </div>
  )
}

function Canvas() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.6]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--chat-border) 1px, transparent 1px), linear-gradient(to bottom, var(--chat-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <OrchestraIntro />
    </div>
  )
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/20 dark:bg-black/60"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.12 }}
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-[14%] z-[61] w-[640px] -translate-x-1/2 border border-[var(--chat-border)] bg-[var(--chat-input)] shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      >
        <input
          autoFocus
          placeholder="Search anything…"
          className="w-full border-b border-[var(--chat-border)] bg-transparent px-5 py-4 text-[14px] text-[var(--chat-text)] outline-none placeholder:text-[var(--chat-placeholder)]"
        />
        <div className="max-h-[420px] overflow-y-auto py-2">
          {PALETTE_ITEMS.map((group) => (
            <div key={group.group} className="py-1">
              <div className="px-5 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">{group.group}</div>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-between px-5 py-2 text-left text-[13px] text-[var(--chat-text)] transition hover:bg-[var(--chat-chip)]"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-[var(--chat-muted)]">{item.meta}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}
