"use client"

import { ArrowUp } from "lucide-react"
import { motion } from "framer-motion"
import { SherlockOrb } from "@/components/SherlockOrb"

export function CenterStage({
  status,
  query,
  setQuery,
  onSubmit,
}: {
  status: "idle" | "collecting" | "analysing" | "profile"
  query: string
  setQuery: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <section className="relative h-screen border-x border-[#78716C]/70 bg-[#FAF8F5]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#78716C33_1px,transparent_1px),linear-gradient(to_bottom,#78716C33_1px,transparent_1px)] bg-[size:32px_32px] opacity-45" />

      <div className="relative flex h-full flex-col items-center justify-center px-10">
        <SherlockOrb status={status} />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-[720px] text-center text-[30px] leading-tight tracking-[-0.04em] text-[#1A1612]"
        >
          Who&apos;s the one you&apos;re searching for?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 max-w-[520px] text-center text-[13px] font-bold leading-6 tracking-[-0.03em] text-[#78716C]"
        >
          Start with a name. Socrates will collect the role, GitHub, resume, and proof links in the chat panel.
        </motion.p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          className="mt-10 w-full max-w-[720px]"
        >
          <div className="group relative rounded-[28px] border border-[#78716C] bg-[#FFFFFF]/90 p-3 shadow-[0_28px_80px_rgba(26, 22, 18,0.10)] backdrop-blur-xl">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: Alex Rivera"
              className="h-14 w-full rounded-[20px] border border-[#78716C]/80 bg-[#FFFFFF] px-6 pr-16 text-[14px] font-bold tracking-[-0.04em] text-[#1A1612] outline-none placeholder:text-[#78716C] focus:border-[#B8543D]/50"
            />
            <button
              type="submit"
              className="absolute right-6 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#FAF8F5] text-[#78716C] transition hover:bg-[#B8543D] hover:text-white"
              aria-label="Start Socrates search"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </form>

        {status === "analysing" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-full border border-[#78716C] bg-[#FFFFFF] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.28em] text-[#78716C]"
          >
            Socrates is stitching proof signals...
          </motion.div>
        )}
      </div>
    </section>
  )
}
