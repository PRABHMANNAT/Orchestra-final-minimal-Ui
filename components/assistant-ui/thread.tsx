"use client"

import {
  ActionBarPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react"
import { ArrowUp, RotateCcw, Copy, Check } from "lucide-react"
import { useState } from "react"

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto">
        <ThreadPrimitive.Empty>
          <div className="flex min-h-[60vh] items-center justify-center px-6 pt-[18vh]">
            <div className="flex items-center gap-6">
              <img
                src="/orchestra-logo.svg"
                alt="Orchestra"
                width={144}
                height={144}
                className="opacity-90 dark:invert"
                draggable={false}
              />
              <span className="hidden font-mono text-[56px] font-light tracking-[0.02em] text-[var(--chat-text)] group-data-[canvas=closed]/canvas:inline">
                Orchestra
              </span>
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <div className="mx-auto w-full max-w-[720px] px-6 py-12 flex flex-col gap-10">
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />
        </div>
      </ThreadPrimitive.Viewport>

      <Composer />
    </ThreadPrimitive.Root>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col gap-1">
      <div className="text-[11px] uppercase tracking-[0.12em] text-[#78716C]">
        You asked
      </div>
      <MessagePrimitive.Content
        components={{
          Text: ({ text }) => (
            <p className="text-[15px] leading-relaxed text-[#1A1612]">{text}</p>
          ),
        }}
      />
    </MessagePrimitive.Root>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex flex-col gap-3">
      <MessagePrimitive.Content
        components={{
          Text: ({ text }) => (
            <p className="text-[13px] leading-[1.75] text-[#1A1612] whitespace-pre-wrap">
              {text}
            </p>
          ),
        }}
      />
      <MessagePrimitive.If notRunning>
        <ActionBar />
      </MessagePrimitive.If>
    </MessagePrimitive.Root>
  )
}

function ActionBar() {
  const [copied, setCopied] = useState(false)

  return (
    <ActionBarPrimitive.Root className="flex items-center gap-2">
      <ActionBarPrimitive.Copy
        onClick={() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
        className="flex items-center gap-1 text-[11px] text-[#78716C] transition hover:text-[#1A1612]"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload className="flex items-center gap-1 text-[11px] text-[#78716C] transition hover:text-[#1A1612]">
        <RotateCcw size={12} />
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  )
}

function Composer() {
  return (
    <div className="shrink-0 px-6 pb-6 pt-3">
      <div className="mx-auto w-full max-w-[560px]">
        <ComposerPrimitive.Root
          className="group relative flex items-center rounded-full border border-[var(--chat-border)] bg-[var(--chat-input)] px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition focus-within:border-[var(--chat-focus)] focus-within:shadow-[0_8px_30px_rgba(184,84,61,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        >
          <ComposerPrimitive.Input
            placeholder="Ask anything about your company, codebase, or team."
            className="flex-1 resize-none overflow-hidden bg-transparent pr-3 font-mono text-[13px] leading-5 tracking-tight text-[var(--chat-text)] outline-none placeholder:text-[var(--chat-placeholder)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            rows={1}
          />
          <ComposerPrimitive.Send
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--chat-chip)] text-[var(--chat-muted)] transition hover:bg-[var(--chat-chip-hover)] hover:text-[var(--chat-text)] disabled:opacity-40 data-[disabled=false]:bg-[var(--chat-accent)] data-[disabled=false]:text-white data-[disabled=false]:shadow-[0_0_18px_var(--chat-accent-glow)]"
          >
            <ArrowUp size={14} />
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
      </div>
    </div>
  )
}
