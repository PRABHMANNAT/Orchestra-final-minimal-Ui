"use client"

import { motion } from "framer-motion"

const LETTERS = ["O", "r", "c", "h", "e", "s", "t", "r", "a"]
const LETTER_STAGGER = 0.12
const EASE = [0.22, 1, 0.36, 1] as const

export function OrchestraIntro({ className = "" }: { className?: string }) {
  const totalLettersTime = (LETTERS.length - 1) * LETTER_STAGGER + 0.88
  const glowDelay = totalLettersTime - 0.04

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center select-none ${className}`}
      style={{ containerType: "inline-size" }}
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-3 font-mono text-[10px] tracking-[0.4em] text-[var(--chat-muted)] uppercase"
      >
        Loading
      </motion.p>

      <motion.div
        className="relative inline-block"
        animate={{
          textShadow: [
            "0 0 0 rgba(184, 84, 61, 0)",
            "0 0 22px rgba(184, 84, 61, 0.22)",
            "0 0 0 rgba(184, 84, 61, 0)",
          ],
        }}
        transition={{
          duration: 1.2,
          delay: glowDelay,
          ease: EASE,
        }}
      >
        <div
          className="font-mono font-light tracking-[0.02em] text-[var(--chat-text)] whitespace-nowrap"
          style={{ fontSize: "clamp(28px, 11cqw, 88px)" }}
          aria-label="Orchestra"
        >
          {LETTERS.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 12, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.88,
                delay: index * LETTER_STAGGER,
                ease: EASE,
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 1.28,
            delay: 0.08,
            ease: EASE,
          }}
          style={{ transformOrigin: "left" }}
          className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#B8543D]"
          aria-hidden
        />
      </motion.div>
    </div>
  )
}
