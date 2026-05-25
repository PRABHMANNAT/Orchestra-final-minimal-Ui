"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"
import {
  ArrowRight,
  Play,
  Upload,
  Check,
  ShieldCheck,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
  GitBranch,
  Brain,
  Sparkles,
} from "lucide-react"
import { writePitchSeedToLocalStorage, PITCH_CANDIDATES } from "@/lib/pitch"
import { ImportModal } from "@/components/import-modal"
import { GuidedDemoOverlay, type DemoStep } from "@/components/guided-demo-overlay"
import { generateDemoSteps, writeDemoDataToLocalStorage } from "@/lib/demo-seed"

const funnelData = [
  { name: "Intake", value: 127, fill: "#ffffff" },
  { name: "Verified Evidence", value: 84, fill: "#cccccc" },
  { name: "τ Gate Pass", value: 52, fill: "#999999" },
  { name: "Shortlist", value: 18, fill: "#666666" },
]

const proofMixData = [
  { name: "GitHub", value: 42, fill: "#ffffff" },
  { name: "Portfolio", value: 18, fill: "#cccccc" },
  { name: "Writing", value: 12, fill: "#999999" },
  { name: "LinkedIn", value: 15, fill: "#777777" },
  { name: "Resume", value: 10, fill: "#555555" },
  { name: "Other", value: 3, fill: "#333333" },
]

const calibrationData = [
  { stage: "Pre", confidence: 62 },
  { stage: "12 labels", confidence: 71 },
  { stage: "24 labels", confidence: 79 },
  { stage: "Post", confidence: 86 },
]

const chartConfig = {
  traditional: { label: "Traditional", color: "#444444" },
  forge: { label: "FORGE", color: "#ffffff" },
  value: { label: "Value", color: "#ffffff" },
  confidence: { label: "Confidence", color: "#ffffff" },
}

const PITCH_STEPS = [
  { label: "Loading demo role", done: false },
  { label: "Validating candidates", done: false },
  { label: "Analyzing GitHub profiles", done: false },
  { label: "Scoring & ranking", done: false },
  { label: "Opening cockpit", done: false },
]

const PIPELINE_STEPS = [
  { label: "Extract Skills", icon: FileText },
  { label: "τ Gate", icon: ShieldCheck },
  { label: "CS × XS", icon: Zap },
  { label: "Interview Pack", icon: MessageSquare },
]

const OUTPUTS = [
  {
    label: "Ranked Decision List",
    description: "Candidates sorted by FORGE_SCORE with verdicts",
    contents: "Score, CS, XS, verdict, confidence",
  },
  {
    label: "Evidence Receipts",
    description: "Proof-tier tagged links to real work",
    contents: "GitHub repos, portfolios, writing samples",
  },
  {
    label: "Interview Pack",
    description: "Tailored questions per candidate",
    contents: "15/30/60-min plans, probes, mini-tasks",
  },
  {
    label: "Why Not Hired Report",
    description: "Actionable feedback for τ-filtered",
    contents: "Missing proof, next artifacts needed",
  },
  {
    label: "Shareable Hiring Packet",
    description: "One-click export for team review",
    contents: "PDF/JSON with full analysis",
  },
]

export default function RecruiterLandingPage() {
  const router = useRouter()
  const [isPitchRunning, setIsPitchRunning] = useState(false)
  const [pitchStep, setPitchStep] = useState(0)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [activePipelineStep, setActivePipelineStep] = useState(0)
  const [showGuidedDemo, setShowGuidedDemo] = useState(false)
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([])

  useState(() => {
    const interval = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  })

  const handleRunPitchDemo = async () => {
    setIsPitchRunning(true)
    setPitchStep(0)

    try {
      writePitchSeedToLocalStorage("frontend")
      setPitchStep(1)
      await new Promise((r) => setTimeout(r, 500))

      setPitchStep(2)
      const validateRes = await fetch("/api/candidates/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: PITCH_CANDIDATES }),
      })
      await validateRes.json()
      await new Promise((r) => setTimeout(r, 300))

      setPitchStep(3)
      const jobConfig = JSON.parse(localStorage.getItem("forge_job_config") || "{}")
      const analyzeRes = await fetch("/api/candidates/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernames: PITCH_CANDIDATES,
          skills: jobConfig.skills || [],
        }),
      })
      const analyzeData = await analyzeRes.json()
      localStorage.setItem("forge_analysis_results", JSON.stringify(analyzeData.results || []))

      setPitchStep(4)
      await new Promise((r) => setTimeout(r, 400))

      router.push("/results")
    } catch (error) {
      console.error("Pitch demo error:", error)
    } finally {
      setIsPitchRunning(false)
    }
  }

  const handleRunGuidedDemo = () => {
    writeDemoDataToLocalStorage()
    const steps = generateDemoSteps()
    setDemoSteps(steps)
    setShowGuidedDemo(true)
  }

  return (
    <AppShell>
      {showGuidedDemo && <GuidedDemoOverlay steps={demoSteps} onComplete={() => setShowGuidedDemo(false)} />}

      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative">
          <div className="absolute inset-0 grid-background opacity-30" />
          <div className="absolute inset-0 radial-glow" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
                <Image src="/forge-logo.png" alt="FORGE Logo" width={40} height={40} />
              </div>
              <h1 className="text-5xl font-black tracking-tight">FORGE</h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-medium">
              Hire based on <span className="text-foreground font-black">proof</span>
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rank candidates with auditable evidence in under 60 seconds. No resume roulette.
            </p>

            {/* Status badges */}
            <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm">
                <GitBranch className="w-3.5 h-3.5" />
                GitHub LIVE
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">
                <Zap className="w-3.5 h-3.5" />
                Multi-signal
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm">
                <Brain className="w-3.5 h-3.5" />
                Outcome Calibration
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-3 bg-white text-black hover:bg-white/90"
                onClick={handleRunGuidedDemo}
              >
                <Play className="w-5 h-5" />
                Run guided demo
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-3 border-2 bg-transparent" asChild>
                <Link href="/job">
                  Start from scratch
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Chat AI Entry */}
            <div className="mb-6">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-100">Try Forge AI Chat</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Import option */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 mx-auto transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import existing analysis
            </button>
          </div>
        </section>

        {/* Pipeline Visualization */}
        <section className="py-16 px-6 border-t border-border/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-center mb-12">How it works</h2>
            <div className="grid grid-cols-4 gap-4">
              {PIPELINE_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${i === activePipelineStep ? "border-white bg-white/5 scale-105" : "border-border/40 bg-card/30"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${i === activePipelineStep ? "bg-white text-black" : "bg-muted/50"
                      }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold">{step.label}</div>
                  {i < 3 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Explainer */}
        <section className="py-16 px-6 border-t border-border/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-center mb-4">The Algorithm</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Every candidate scored with the same transparent, auditable formula
            </p>

            {/* Formula */}
            <div className="p-8 rounded-3xl border-2 border-border/60 bg-card/50 mb-8">
              <div className="text-center mb-8">
                <code className="text-3xl md:text-4xl font-mono">
                  <span className="text-emerald-400">FORGE</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-blue-400">CS</span>
                  <span className="text-muted-foreground"> × </span>
                  <span className="text-amber-400">XS</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-violet-400">LV</span>
                </code>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-black/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-blue-400 font-mono text-lg">CS</code>
                    <span className="text-sm text-muted-foreground">Capability Score</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Verified artifacts = 100%, Claims = 15%</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-amber-400 font-mono text-lg">XS</code>
                    <span className="text-sm text-muted-foreground">Context Score</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Teamwork, ownership, communication signals</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-violet-400 font-mono text-lg">LV</code>
                    <span className="text-sm text-muted-foreground">Learning Velocity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bonus for growth patterns</p>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-foreground font-mono text-lg">τ</code>
                    <span className="text-sm text-muted-foreground">Smart Gate</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Pool-relative threshold, default 40%</p>
                </div>
              </div>

              {/* v3 improvements */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                    NEW in v3
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                    Corroboration Boost
                  </div>
                  <div className="text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                    Soft Must-Haves
                  </div>
                  <div className="text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                    Claims Count (15%)
                  </div>
                  <div className="text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                    Related Skills
                  </div>
                </div>
              </div>
            </div>

            {/* Worked example toggle */}
            <button
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors"
            >
              {showExample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showExample ? "Hide" : "Show"} worked example
            </button>

            {showExample && (
              <div className="mt-6 p-6 rounded-2xl border border-border/40 bg-card/30 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Sample Scoring</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CS_total</span>
                        <span>58</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CS_verified</span>
                        <span>42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">XS</span>
                        <span>0.75</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">LV</span>
                        <span>+3</span>
                      </div>
                      <div className="flex justify-between border-t border-border/40 pt-2 mt-2">
                        <span className="text-foreground font-semibold">FORGE</span>
                        <span className="text-emerald-400">35</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Gate Check</h4>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-sm font-mono mb-2">
                        CS_verified (42) ≥ τ (40) → <span className="text-emerald-400">PASS</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        In v2 this would fail at τ 65. In v3 they pass with adjusted threshold.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Proof Tier Pyramid */}
        <section className="py-16 px-6 border-t border-border/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-center mb-4">Proof Tiers</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Every piece of evidence weighted by verification strength
            </p>

            <div className="space-y-3">
              {[
                {
                  tier: "Verified Artifact",
                  mult: "×1.0",
                  desc: "Owned repo, 10+ commits, shipped product",
                  width: "100%",
                },
                {
                  tier: "Strong Signals",
                  mult: "×0.7",
                  desc: "Contributed to repos, details corroborated",
                  width: "70%",
                },
                { tier: "Weak Signals", mult: "×0.4", desc: "Some repo mentions, partial context", width: "40%" },
                { tier: "Claim Only", mult: "×0.15", desc: "Resume/portfolio claims with NO GitHub", width: "15%" },
                { tier: "Unverified", mult: "×0.0", desc: "No evidence found", width: "0%" },
              ].map((item, i) => (
                <div
                  key={item.tier}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/30"
                >
                  <div className="w-16 text-right font-mono font-black text-muted-foreground">{item.mult}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.tier}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <div className="w-32 h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white to-white/50 rounded-full"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 border-t border-border/40">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Ready to hire smarter?</h2>
            <p className="text-muted-foreground mb-8">
              Start evaluating candidates with proof-first scoring in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-3 bg-white text-black hover:bg-white/90"
                onClick={handleRunGuidedDemo}
              >
                <Play className="w-5 h-5" />
                Run guided demo
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-3 border-2 bg-transparent" asChild>
                <Link href="/job">
                  Start from scratch
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ImportModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </AppShell>
  )
}
