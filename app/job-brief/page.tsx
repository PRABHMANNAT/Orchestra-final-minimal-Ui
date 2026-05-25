"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { OmniLogo } from "@/components/omni-logo"
import {
  buildGeneratedJobBrief,
  type GeneratedJobBrief,
  type JobBriefContext,
} from "@/lib/buildGeneratedJobBrief"
import {
  JobBriefGeneratingState,
  GeneratedJobBriefCanvas,
} from "@/components/job-brief/GeneratedJobBriefCanvas"

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type JobBriefView = "intake" | "generating" | "brief"

type BriefField =
  | "role"
  | "stage"
  | "budget"
  | "urgency"
  | "mustHave"
  | "niceToHave"
  | "workStyle"
  | "firstThirtyDays"

type JobBrief = Partial<Record<BriefField, string>>

type ChatAction = {
  label: string
  value: string
}

type ChatMessage = {
  id: string
  sender: "aristotle" | "user"
  text: string
  actions?: ChatAction[]
}

// â”€â”€â”€ Flow constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type BriefStep =
  | "role"
  | "stage"
  | "budget"
  | "urgency"
  | "mustHave"
  | "niceToHave"
  | "workStyle"
  | "firstThirtyDays"
  | "done"

const STEP_QUESTIONS: Record<BriefStep, string> = {
  role: "What role are you hiring for?",
  stage: "What stage is your startup at?",
  budget: "What's the budget range for this role?",
  urgency: "How urgently do you need this person?",
  mustHave: "What are the must-have skills or experience?",
  niceToHave: "Any nice-to-haves? (or skip)",
  workStyle: "Remote, hybrid, or on-site?",
  firstThirtyDays: "What does success look like in the first 30 days?",
  done: "",
}

const STEP_ORDER: BriefStep[] = [
  "role",
  "stage",
  "budget",
  "urgency",
  "mustHave",
  "niceToHave",
  "workStyle",
  "firstThirtyDays",
  "done",
]

const STEP_ACTIONS: Partial<Record<BriefStep, ChatAction[]>> = {
  stage: [
    { label: "Pre-seed", value: "Pre-seed" },
    { label: "Seed", value: "Seed" },
    { label: "Series A", value: "Series A" },
    { label: "Series B+", value: "Series B+" },
  ],
  budget: [
    { label: "$80kâ€“$100k", value: "$80kâ€“$100k" },
    { label: "$100kâ€“$130k", value: "$100kâ€“$130k" },
    { label: "$130kâ€“$160k", value: "$130kâ€“$160k" },
    { label: "$160kâ€“$200k", value: "$160kâ€“$200k" },
    { label: "$200k+", value: "$200k+" },
  ],
  urgency: [
    { label: "ASAP (2â€“4 weeks)", value: "ASAP (2â€“4 weeks)" },
    { label: "1â€“2 months", value: "1â€“2 months" },
    { label: "Flexible", value: "Flexible" },
  ],
  workStyle: [
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "On-site", value: "On-site" },
    { label: "Flexible", value: "Flexible" },
  ],
  niceToHave: [{ label: "Skip", value: "skip-nicetohave" }],
}

const FIELD_LABELS: Record<BriefField, string> = {
  role: "Role",
  stage: "Startup stage",
  budget: "Budget",
  urgency: "Urgency",
  mustHave: "Must-have",
  niceToHave: "Nice-to-have",
  workStyle: "Work style",
  firstThirtyDays: "First 30 days",
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function JobBriefPage() {
  const router = useRouter()

  // View state machine: intake â†’ generating â†’ brief
  const [jobBriefView, setJobBriefView] = useState<JobBriefView>("intake")
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedJobBrief | null>(null)

  // Intake form state
  const [currentStep, setCurrentStep] = useState<BriefStep>("role")
  const [brief, setBrief] = useState<JobBrief>({})
  const [started, setStarted] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "aristotle",
      text: "Let's build a job brief. I'll ask a few quick questions â€” takes about 2 minutes. Then I'll generate a recruiter-ready brief, LinkedIn post, and candidate search query.",
      actions: [{ label: "Let's start", value: "start" }],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Keep a ref for latest brief so async handlers always see fresh data
  const briefRef = useRef<JobBrief>({})

  useEffect(() => {
    briefRef.current = brief
  }, [brief])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function push(msg: Omit<ChatMessage, "id">) {
    setMessages((prev) => [...prev, { ...msg, id: uid() }])
  }

  // â”€â”€ Generate brief â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async function handleGenerateBrief() {
    setJobBriefView("generating")
    push({
      sender: "aristotle",
      text: "Generating a recruiter-ready job brief from your startup context...",
    })

    await new Promise<void>((resolve) => setTimeout(resolve, 1200))

    const context: JobBriefContext = {
      role: briefRef.current.role,
      stage: briefRef.current.stage,
      budget: briefRef.current.budget,
      urgency: briefRef.current.urgency,
      mustHave: briefRef.current.mustHave,
      niceToHave: briefRef.current.niceToHave,
      workStyle: briefRef.current.workStyle,
      firstThirtyDays: briefRef.current.firstThirtyDays,
    }

    const generated = buildGeneratedJobBrief(context)
    setGeneratedBrief(generated)
    setJobBriefView("brief")

    push({
      sender: "aristotle",
      text: "Brief generated. You can copy it for LinkedIn, export the full JD, or use it to find candidates.",
      actions: [
        { label: "Copy LinkedIn post", value: "copy-linkedin" },
        { label: "Use to find candidates", value: "use-to-search" },
        { label: "Edit intake", value: "edit-intake" },
      ],
    })
  }

  function handleUseBriefForSearch() {
    if (!generatedBrief) return
    localStorage.setItem("forge:jobBrief", JSON.stringify(generatedBrief))
    router.push("/chat")
  }

  // â”€â”€ Intake step handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function advanceStep(answer: string, field: BriefField | null, updatedBrief: JobBrief) {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    const nextStep = STEP_ORDER[currentIndex + 1]

    if (!nextStep || nextStep === "done") {
      setCurrentStep("done")
      push({
        sender: "aristotle",
        text: "Intake complete. Ready to generate your job brief.",
        actions: [{ label: "Generate Job Brief", value: "generate-brief" }],
      })
      return
    }

    setCurrentStep(nextStep)
    push({
      sender: "aristotle",
      text: STEP_QUESTIONS[nextStep],
      actions: STEP_ACTIONS[nextStep],
    })
  }

  function handleStart() {
    setStarted(true)
    push({ sender: "user", text: "Let's start" })
    push({
      sender: "aristotle",
      text: STEP_QUESTIONS["role"],
    })
    setCurrentStep("role")
  }

  function handleAnswer(text: string) {
    if (!started) {
      handleStart()
      return
    }

    if (currentStep === "done" || jobBriefView !== "intake") return

    push({ sender: "user", text: text === "skip-nicetohave" ? "Skip" : text })

    const fieldMap: Partial<Record<BriefStep, BriefField>> = {
      role: "role",
      stage: "stage",
      budget: "budget",
      urgency: "urgency",
      mustHave: "mustHave",
      niceToHave: "niceToHave",
      workStyle: "workStyle",
      firstThirtyDays: "firstThirtyDays",
    }

    const answerValue = text === "skip-nicetohave" ? "" : text
    const field = fieldMap[currentStep] ?? null
    const updatedBrief = field ? { ...brief, [field]: answerValue } : brief
    if (field) {
      setBrief(updatedBrief)
      briefRef.current = updatedBrief
    }
    advanceStep(answerValue, field, updatedBrief)
  }

  function handleAction(value: string) {
    if (value === "start") {
      handleStart()
      return
    }
    if (value === "generate-brief") {
      void handleGenerateBrief()
      return
    }
    if (value === "use-to-search") {
      handleUseBriefForSearch()
      return
    }
    if (value === "copy-linkedin") {
      if (generatedBrief) navigator.clipboard.writeText(generatedBrief.linkedinPost)
      return
    }
    if (value === "edit-intake") {
      setJobBriefView("intake")
      return
    }
    handleAnswer(value)
  }

  function handleInputSubmit() {
    const text = inputValue.trim()
    if (!text) return
    setInputValue("")
    handleAnswer(text)
  }

  const briefFields = Object.entries(brief).filter(([, v]) => v) as [BriefField, string][]
  const inputDisabled = currentStep === "done" || jobBriefView !== "intake"

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <main className="flex h-full min-w-0 flex-1 overflow-hidden">
      {/* Left: Aristotle chat */}
      <aside className="relative flex h-full w-[400px] shrink-0 flex-col border-r border-[#78716C]/60 bg-[#FAF8F5] dark:border-white/[0.06] dark:bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#78716C33_1px,transparent_1px),linear-gradient(to_bottom,#78716C33_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10" />

        {/* Header */}
        <div className="relative flex items-center gap-3 border-b border-[#78716C]/60 px-5 py-4 dark:border-white/[0.06]">
          <AristotleOrb />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#78716C] dark:text-white/40">
              SOCRATES
            </p>
            <p className="text-[12px] font-bold tracking-[-0.03em] text-[#1A1612] dark:text-white/70">
              job brief builder
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-y-auto px-4 py-5">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} onAction={handleAction} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="relative border-t border-[#78716C]/60 p-4 dark:border-white/[0.06]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleInputSubmit()
            }}
            className="relative"
          >
            <div className="relative rounded-[18px] bg-[#FFFFFF]/95 shadow-[0_8px_28px_rgba(26, 22, 18,0.12)] dark:bg-[#141414] dark:shadow-none">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  inputDisabled
                    ? "Intake complete"
                    : started
                    ? STEP_QUESTIONS[currentStep]?.slice(0, 38) + "..."
                    : "Type to start..."
                }
                disabled={inputDisabled}
                className="h-[52px] w-full rounded-[18px] bg-transparent px-5 pr-14 text-[14px] tracking-[-0.03em] text-[#1A1612] outline-none placeholder:text-[#78716C] disabled:opacity-40 dark:text-white dark:placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || inputDisabled}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#FAF8F5] text-[#78716C] transition hover:bg-[#B8543D] hover:text-white disabled:pointer-events-none dark:bg-white/10 dark:hover:bg-[#B8543D]"
                aria-label="Send"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </form>
        </div>
      </aside>

      {/* Right: canvas (switches between intake cards / generating / brief) */}
      <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#FAF8F5] dark:bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26, 22, 18,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(26, 22, 18,0.035)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {jobBriefView === "intake" && (
            <motion.div
              key="intake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-full flex-col"
            >
              {briefFields.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <FileText size={48} className="text-[#1A1612]/20 dark:text-white/15" />
                  <p className="text-sm text-[#1A1612]/40 dark:text-white/25">
                    Your job brief will appear here as you answer.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="mx-auto max-w-lg">
                    <p className="mb-6 text-[10px] font-black uppercase tracking-[0.32em] text-[#78716C]">
                      Job Brief â€” in progress
                    </p>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {briefFields.map(([field, value]) => (
                          <motion.div
                            key={field}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-[#78716C]/70 bg-[#FFFFFF]/90 p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                          >
                            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.26em] text-[#78716C] dark:text-white/35">
                              {FIELD_LABELS[field]}
                            </p>
                            <p className="text-sm font-medium text-[#1A1612] dark:text-white/80">
                              {value}
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {currentStep === "done" && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => void handleGenerateBrief()}
                          className="mt-4 w-full rounded-[24px] bg-[#B8543D] py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_14px_34px_rgba(184, 84, 61,0.22)] transition hover:scale-[1.01] hover:bg-[#B8543D]"
                        >
                          Generate Job Brief
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {jobBriefView === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-full flex-col"
            >
              <JobBriefGeneratingState />
            </motion.div>
          )}

          {jobBriefView === "brief" && generatedBrief && (
            <motion.div
              key="brief"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-full flex-col overflow-hidden"
            >
              <GeneratedJobBriefCanvas
                brief={generatedBrief}
                onUseToFindCandidates={handleUseBriefForSearch}
                onEditIntake={() => setJobBriefView("intake")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

// â”€â”€â”€ Shared subcomponents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AristotleOrb() {
  return (
    <OmniLogo size={18} className="text-[#1F2A38] dark:text-white shrink-0" />
  )
}

function ChatBubble({
  message,
  onAction,
}: {
  message: ChatMessage
  onAction: (value: string) => void
}) {
  const isUser = message.sender === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={isUser ? "flex justify-end" : "flex justify-start"}
    >
      <div className="max-w-[90%]">
        <div
          className={
            isUser
              ? "rounded-[20px] rounded-tr-md bg-[#1A1612] px-4 py-3 text-[12px] font-bold leading-5 tracking-[-0.03em] text-[#FFFFFF] dark:bg-white dark:text-[#1A1612]"
              : "rounded-[20px] rounded-tl-md border border-[#78716C] bg-[#FFFFFF]/95 px-4 py-3 text-[12px] font-bold leading-5 tracking-[-0.03em] text-[#78716C] shadow-[0_4px_16px_rgba(26, 22, 18,0.07)] dark:border-white/10 dark:bg-[#141414] dark:text-white/70"
          }
        >
          {message.text}
        </div>

        {message.actions && message.actions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.actions.map((action) => (
              <button
                key={action.value}
                onClick={() => onAction(action.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-black tracking-[-0.02em] transition",
                  action.value === "generate-brief" || action.value === "use-to-search"
                    ? "border-[#B8543D]/60 bg-[#B8543D] text-white shadow-[0_8px_24px_rgba(184, 84, 61,0.28)] hover:bg-[#B8543D]"
                    : "border-[#78716C] bg-[#FAF8F5] text-[#78716C] hover:border-[#B8543D]/40 hover:bg-[#FAF8F5] hover:text-[#B8543D] dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

