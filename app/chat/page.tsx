"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, PanelRightClose, PanelRightOpen, Sparkles, Code2, FileSignature, GitMerge } from "lucide-react"
import { OrchestraIntro } from "@/components/OrchestraIntro"
import { VisualizationFor, type VizKey } from "@/components/ask/Visualizations"

// ─── Types & data ───────────────────────────────────────────────────────────

type ChatMessage = { id: string; role: "user" | "assistant"; content: string; pending?: boolean }

type QuickAction = { label: string; prompt: string; viz: VizKey; icon: React.ReactNode }

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Code rationale",
    prompt: "Fetch code-rationale tracing for the webhook handler.",
    viz: "rationale",
    icon: <Code2 className="h-3.5 w-3.5" />,
  },
  {
    label: "PR doc · Antler",
    prompt: "Create a PR document for project Antler and cite it.",
    viz: "pr-antler",
    icon: <FileSignature className="h-3.5 w-3.5" />,
  },
  {
    label: "Ship report",
    prompt: "Summarize what shipped this week across the team.",
    viz: "ship-report",
    icon: <GitMerge className="h-3.5 w-3.5" />,
  },
]

const VIZ_REPLIES: Record<VizKey, string> = {
  rationale:
    "Pulled the rationale trace for the webhook handler. On the right you'll see recent commits, change density for the last 30 days, and the decision chain behind why this code exists.",
  "pr-antler":
    "Drafted the PR document for project Antler with cited sources. Tap any highlighted phrase to see the source — the citations panel lists every reference with author, timestamp, and link.",
  "ship-report":
    "Compiled this week's ship report — eight PRs across ingestion, payments, and frontend, grouped by day on the right.",
}

function detectViz(prompt: string): VizKey | null {
  const p = prompt.toLowerCase()
  if (p.includes("rationale") || (p.includes("code") && (p.includes("why") || p.includes("trace") || p.includes("trac")))) return "rationale"
  if ((p.includes("pr") || p.includes("document") || p.includes(" doc")) && (p.includes("antler") || p.includes("cite") || p.includes("draft"))) return "pr-antler"
  if (p.includes("ship") || p.includes("shipped") || p.includes("recap") || (p.includes("week") && p.includes("merged"))) return "ship-report"
  return null
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeViz, setActiveViz] = useState<VizKey | null>(null)
  const [canvasOpen, setCanvasOpen] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!viewportRef.current) return
    viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, messages[messages.length - 1]?.content])

  const submit = async (rawPrompt?: string) => {
    const prompt = (rawPrompt ?? input).trim()
    if (!prompt || isStreaming) return

    setInput("")
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: prompt }
    const viz = detectViz(prompt)

    if (viz) {
      const replyMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: VIZ_REPLIES[viz] }
      setMessages((prev) => [...prev, userMsg, replyMsg])
      setActiveViz(viz)
      setCanvasOpen(true)
      return
    }

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "", pending: true }])
    setIsStreaming(true)

    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }))
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })

      if (!response.ok || !response.body) {
        const text = await response.text().catch(() => "")
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: text || `Request failed (${response.status}).`, pending: false } : m))
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: buffer, pending: true } : m))
      }
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, pending: false } : m))
    } catch (error) {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: "Network error reaching /api/chat.", pending: false } : m))
    } finally {
      setIsStreaming(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt)
    inputRef.current?.focus()
  }

  return (
    <main className="relative flex h-full min-w-0 flex-1 flex-col bg-[var(--chat-bg)] text-[var(--chat-text)]">
      <TopBar canvasOpen={canvasOpen} onToggleCanvas={() => setCanvasOpen((v) => !v)} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <motion.section
          layout
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group/canvas relative flex h-full min-w-0 flex-col"
          style={{ flexBasis: canvasOpen ? "45%" : "100%", flexGrow: 1 }}
        >
          <LeftPanel
            messages={messages}
            input={input}
            setInput={setInput}
            onSubmit={() => submit()}
            isStreaming={isStreaming}
            inputRef={inputRef}
            viewportRef={viewportRef}
            onQuickAction={handleQuickAction}
          />
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
              <Canvas activeViz={activeViz} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

// ─── Top bar ────────────────────────────────────────────────────────────────

function TopBar({ canvasOpen, onToggleCanvas }: { canvasOpen: boolean; onToggleCanvas: () => void }) {
  return (
    <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-[var(--chat-border)] px-4">
      <span className="flex items-center gap-2 px-3 py-1 text-[11px] text-[var(--chat-muted)]">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Orchestra · Ask</span>
      </span>
      <button
        type="button"
        onClick={onToggleCanvas}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-[var(--chat-muted)] transition hover:bg-[var(--chat-chip)] hover:text-[var(--chat-text)]"
        aria-label={canvasOpen ? "Hide canvas" : "Show canvas"}
      >
        {canvasOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ─── Left panel: messages + quick actions + composer ────────────────────────

function LeftPanel({
  messages,
  input,
  setInput,
  onSubmit,
  isStreaming,
  inputRef,
  viewportRef,
  onQuickAction,
}: {
  messages: ChatMessage[]
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isStreaming: boolean
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  viewportRef: React.RefObject<HTMLDivElement | null>
  onQuickAction: (action: QuickAction) => void
}) {
  const empty = messages.length === 0

  return (
    <div className="flex h-full flex-col">
      <div ref={viewportRef} className="flex-1 overflow-y-auto">
        {empty ? (
          <div className="flex min-h-[60vh] items-center justify-center px-6 pt-[14vh]">
            <div className="flex flex-col items-center gap-5 text-center">
              <img src="/orchestra-logo.svg" alt="Orchestra" width={96} height={96} className="opacity-90 dark:invert" draggable={false} />
              <div className="max-w-[360px] text-[13px] leading-relaxed text-[var(--chat-muted)]">
                Ask anything about your codebase, decisions, or team. Try a quick action below to see Orchestra trace the rationale.
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8 px-6 py-10">
            {messages.map((message) => (message.role === "user" ? <UserBubble key={message.id} text={message.content} /> : <AssistantBubble key={message.id} message={message} />))}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-6 pt-3">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onQuickAction(action)}
                className="group flex items-center gap-1.5 rounded-full border border-[var(--chat-border)] bg-[var(--chat-chip)] px-3 py-1.5 text-[11px] text-[var(--chat-muted)] transition hover:border-[var(--chat-accent)] hover:text-[var(--chat-text)]"
              >
                <span className="text-[var(--chat-muted)] group-hover:text-[var(--chat-accent)]">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => { event.preventDefault(); onSubmit() }}
            className="group relative flex items-end gap-2 rounded-[18px] border border-[var(--chat-border)] bg-[var(--chat-input)] px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition focus-within:border-[var(--chat-focus)] focus-within:shadow-[0_8px_30px_rgba(184,84,61,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  onSubmit()
                }
              }}
              placeholder="Ask anything about your company, codebase, or team."
              rows={1}
              className="flex-1 resize-none overflow-hidden bg-transparent pr-2 font-mono text-[13px] leading-5 tracking-tight text-[var(--chat-text)] outline-none placeholder:text-[var(--chat-placeholder)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: 160 }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--chat-chip)] text-[var(--chat-muted)] transition hover:bg-[var(--chat-chip-hover)] hover:text-[var(--chat-text)] disabled:opacity-40 enabled:bg-[var(--chat-accent)] enabled:text-white enabled:shadow-[0_0_18px_var(--chat-accent-glow)]"
            >
              <ArrowUp size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="flex flex-col gap-1">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">You asked</div>
      <p className="text-[15px] leading-relaxed text-[var(--chat-text)]">{text}</p>
    </motion.div>
  )
}

function AssistantBubble({ message }: { message: ChatMessage }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--chat-muted)]">Orchestra</div>
      <p className="whitespace-pre-wrap text-[13px] leading-[1.75] text-[var(--chat-text-soft)]">
        {message.content}
        {message.pending && <span className="ml-1 inline-block h-3 w-[2px] animate-pulse bg-[var(--chat-muted)] align-middle" />}
      </p>
    </motion.div>
  )
}

// ─── Right panel canvas ─────────────────────────────────────────────────────

function Canvas({ activeViz }: { activeViz: VizKey | null }) {
  return (
    <div className="relative flex h-full w-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.6]" style={{ backgroundImage: "linear-gradient(to right, var(--chat-border) 1px, transparent 1px), linear-gradient(to bottom, var(--chat-border) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {activeViz ? (
        <motion.div
          key={activeViz}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 h-full w-full"
        >
          <VisualizationFor kind={activeViz} />
        </motion.div>
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <OrchestraIntro />
        </div>
      )}
    </div>
  )
}
