"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────

type SourceType = "github" | "slack" | "gmail" | "notion" | "doc"

type Citation = {
  id: string
  label: string
  source: {
    type: SourceType
    excerpt: string
    isCode: boolean
    author: string
    timestamp: string
    href: string
  }
}

type Segment =
  | { kind: "text"; text: string }
  | { kind: "cite"; citationId: string; text: string }

type Action = { label: string }

type UserMessage = { id: string; role: "user"; text: string }
type AssistantMessage = {
  id: string
  role: "assistant"
  segments: Segment[]
  citations: Citation[]
  actions: Action[]
  streamed: number
}
type Message = UserMessage | AssistantMessage

// ─── Constants ──────────────────────────────────────────────────────────────

const SOURCE_LABEL: Record<SourceType, string> = {
  github: "GitHub",
  slack: "Slack",
  gmail: "Gmail",
  notion: "Notion",
  doc: "Google Doc",
}

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

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function generateMockAnswer(question: string): {
  segments: Segment[]
  citations: Citation[]
  actions: Action[]
} {
  const q = question.toLowerCase()

  if (q.includes("webhook") || q.includes("decision") || q.includes("why")) {
    const cite1: Citation = {
      id: uid(),
      label: "PR #341",
      source: {
        type: "github",
        excerpt:
          "feat(payments): swap inline webhook handler for queue-based intake\n\n" +
          "Routes inbound Stripe events through a Redis queue worker. Reduces\n" +
          "p99 webhook latency from 1.2s to 180ms, eliminating retries that\n" +
          "were causing duplicate charge attempts in ~0.3% of high-volume hours.",
        isCode: true,
        author: "priya.k",
        timestamp: "12 days ago",
        href: "#",
      },
    }
    const cite2: Citation = {
      id: uid(),
      label: "#payments thread",
      source: {
        type: "slack",
        excerpt:
          "Decided to move webhook intake to a queue. Stripe's retry policy was already firing twice on slow handlers — easier to ack fast and process async.",
        isCode: false,
        author: "priya.k",
        timestamp: "12 days ago",
        href: "#",
      },
    }
    return {
      segments: [
        { kind: "text", text: "Stripe webhook processing moved to a queue in " },
        { kind: "cite", citationId: cite1.id, text: "PR #341" },
        { kind: "text", text: ", after the discussion in the " },
        { kind: "cite", citationId: cite2.id, text: "#payments thread" },
        {
          kind: "text",
          text:
            ". Inline handlers were exceeding Stripe's 1.5s retry window, causing duplicate charge attempts in roughly 0.3% of high-volume hours.",
        },
      ],
      citations: [cite1, cite2],
      actions: [{ label: "Draft Slack reply" }, { label: "Open PR #341" }, { label: "Create task in Linear" }],
    }
  }

  if (q.includes("who") || q.includes("owns")) {
    const cite: Citation = {
      id: uid(),
      label: "service-catalog.md",
      source: {
        type: "notion",
        excerpt:
          "## Payments service\n\nOwner: Priya K (priya.k)\nBackup: David L\nOn-call rotation: #payments-oncall\nLast review: 2025-11-04",
        isCode: false,
        author: "platform-team",
        timestamp: "3 weeks ago",
        href: "#",
      },
    }
    return {
      segments: [
        { kind: "text", text: "Priya K is the primary owner of the payments service, per the " },
        { kind: "cite", citationId: cite.id, text: "service-catalog.md" },
        { kind: "text", text: ". David L is listed as backup, with on-call handled through #payments-oncall." },
      ],
      citations: [cite],
      actions: [{ label: "Message Priya" }, { label: "Open service catalog" }],
    }
  }

  const cite: Citation = {
    id: uid(),
    label: "indexed knowledge",
    source: {
      type: "notion",
      excerpt:
        "This is a working answer based on the sources currently indexed. Connect additional sources from the Know page to improve citation depth and answer confidence.",
      isCode: false,
      author: "system",
      timestamp: "just now",
      href: "#",
    },
  }
  return {
    segments: [
      { kind: "text", text: "Based on what's indexed so far, the closest match is in " },
      { kind: "cite", citationId: cite.id, text: "indexed knowledge" },
      {
        kind: "text",
        text: ". Ask a more specific question, or connect additional sources for higher-confidence answers.",
      },
    ],
    citations: [cite],
    actions: [{ label: "Connect more sources" }, { label: "Save to doc" }],
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [openCitation, setOpenCitation] = useState<Citation | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        setPaletteOpen(false)
        setOpenCitation(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages])

  const submit = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setInput("")

    const userMsg: UserMessage = { id: uid(), role: "user", text }
    const mock = generateMockAnswer(text)
    const assistantId = uid()
    const assistantMsg: AssistantMessage = {
      id: assistantId,
      role: "assistant",
      segments: mock.segments,
      citations: mock.citations,
      actions: mock.actions,
      streamed: 0,
    }
    setMessages((prev) => [...prev, userMsg, assistantMsg])

    const totalChars = mock.segments.reduce((acc, s) => acc + s.text.length, 0)
    let revealed = 0
    const interval = window.setInterval(() => {
      revealed += 6
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.role === "assistant"
            ? { ...m, streamed: Math.min(revealed, totalChars) }
            : m,
        ),
      )
      if (revealed >= totalChars) window.clearInterval(interval)
    }, 22)
  }, [input])

  const hasMessages = messages.length > 0

  return (
    <main
      className="relative flex h-full min-w-0 flex-1 flex-col bg-[#FAF8F5] text-[#1A1612]"
      style={{ colorScheme: "light" }}
    >
      <TopBar onOpenPalette={() => setPaletteOpen(true)} />

      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-6 py-16">
          {!hasMessages ? (
            <EmptyState input={input} setInput={setInput} onSubmit={submit} />
          ) : (
            <div className="flex flex-col gap-12 pb-16">
              {messages.map((m) =>
                m.role === "user" ? (
                  <UserBlock key={m.id} text={m.text} />
                ) : (
                  <AssistantBlock key={m.id} message={m} onCitationClick={setOpenCitation} />
                ),
              )}
              <InlineInput input={input} setInput={setInput} onSubmit={submit} />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openCitation && <ReceiptsPanel citation={openCitation} onClose={() => setOpenCitation(null)} />}
      </AnimatePresence>

      <AnimatePresence>{paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}</AnimatePresence>
    </main>
  )
}

// ─── Components ─────────────────────────────────────────────────────────────

function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-center border-b border-[#78716C]/15 px-4">
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex items-center gap-2 px-3 py-1 text-[11px] text-[#78716C] transition hover:text-[#1A1612]"
        aria-label="Open command palette"
      >
        <span className="font-mono text-[10px] tracking-wider">⌘K</span>
        <span>Ask anything…</span>
      </button>
    </div>
  )
}

function EmptyState({
  input,
  setInput,
  onSubmit,
}: {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="w-full max-w-[640px]"
      >
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your company."
          className="w-full border-b border-[#78716C]/30 bg-transparent pb-3 text-[15px] tracking-tight text-[#1A1612] outline-none transition-colors placeholder:text-[#78716C] focus:border-[#1A1612]/60"
        />
      </form>
    </div>
  )
}

function InlineInput({
  input,
  setInput,
  onSubmit,
}: {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="pt-4"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a follow-up."
        className="w-full border-b border-[#78716C]/30 bg-transparent pb-3 text-[15px] tracking-tight text-[#1A1612] outline-none transition-colors placeholder:text-[#78716C] focus:border-[#1A1612]/60"
      />
    </form>
  )
}

function UserBlock({ text }: { text: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#78716C]">You asked</div>
      <p className="text-[15px] leading-relaxed text-[#1A1612]">{text}</p>
    </div>
  )
}

function AssistantBlock({
  message,
  onCitationClick,
}: {
  message: AssistantMessage
  onCitationClick: (c: Citation) => void
}) {
  let remaining = message.streamed
  const visibleSegments: Segment[] = []
  for (const seg of message.segments) {
    if (remaining <= 0) break
    if (seg.text.length <= remaining) {
      visibleSegments.push(seg)
      remaining -= seg.text.length
    } else {
      visibleSegments.push({ ...seg, text: seg.text.slice(0, remaining) })
      remaining = 0
    }
  }

  const totalChars = message.segments.reduce((acc, s) => acc + s.text.length, 0)
  const isStreaming = message.streamed < totalChars

  return (
    <div>
      <p className="text-[13px] leading-[1.75] text-[#1A1612]">
        {visibleSegments.map((seg, i) => {
          if (seg.kind === "text") return <span key={i}>{seg.text}</span>
          const cite = message.citations.find((c) => c.id === seg.citationId)
          return (
            <button
              key={i}
              type="button"
              onClick={() => cite && onCitationClick(cite)}
              className="text-[#1A1612] underline decoration-[#B8543D] decoration-[1px] underline-offset-[3px] transition hover:bg-[#B8543D]/10"
            >
              {seg.text}
            </button>
          )
        })}
        {isStreaming && (
          <span className="ml-[1px] inline-block h-[1em] w-[2px] animate-pulse bg-[#1A1612]/60 align-middle" />
        )}
      </p>

      {!isStreaming && message.actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {message.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="rounded-[2px] border border-[#78716C]/40 bg-[#FFFFFF] px-3 py-1.5 text-[11px] text-[#1A1612] transition hover:border-[#B8543D]"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ReceiptsPanel({ citation, onClose }: { citation: Citation; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-[#78716C]/20 bg-[#FFFFFF] shadow-[0_1px_2px_rgba(26,22,18,0.04)]"
        style={{ colorScheme: "light" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#78716C]/15 px-6 py-4">
          <span className="text-[11px] uppercase tracking-[0.12em] text-[#78716C]">Source</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close source panel"
            className="text-[16px] leading-none text-[#78716C] transition hover:text-[#1A1612]"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <pre
            className={`whitespace-pre-wrap break-words text-[12px] leading-relaxed text-[#1A1612] ${
              citation.source.isCode ? "font-mono" : "font-sans"
            }`}
          >
            {citation.source.excerpt}
          </pre>
        </div>

        <div className="shrink-0 space-y-2 border-t border-[#78716C]/15 px-6 py-4">
          <div className="flex items-center justify-between text-[11px] text-[#78716C]">
            <span>{SOURCE_LABEL[citation.source.type]}</span>
            <span>{citation.source.timestamp}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#78716C]">{citation.source.author}</span>
            <a
              href={citation.source.href}
              className="text-[11px] text-[#B8543D] underline-offset-2 hover:underline"
            >
              Open →
            </a>
          </div>
        </div>
      </motion.aside>
    </>
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
        className="fixed inset-0 z-[60] bg-[#1A1612]/10"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.12 }}
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-[14%] z-[61] w-[640px] -translate-x-1/2 border border-[#78716C]/20 bg-[#FFFFFF] shadow-[0_1px_2px_rgba(26,22,18,0.04)]"
        style={{ colorScheme: "light" }}
      >
        <input
          autoFocus
          placeholder="Search anything…"
          className="w-full border-b border-[#78716C]/15 bg-transparent px-5 py-4 text-[14px] text-[#1A1612] outline-none placeholder:text-[#78716C]"
        />
        <div className="max-h-[420px] overflow-y-auto py-2">
          {PALETTE_ITEMS.map((group) => (
            <div key={group.group} className="py-1">
              <div className="px-5 py-2 text-[10px] uppercase tracking-[0.16em] text-[#78716C]">{group.group}</div>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-between px-5 py-2 text-left text-[13px] text-[#1A1612] transition hover:bg-[#FAF8F5]"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-[#78716C]">{item.meta}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}
