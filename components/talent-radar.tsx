"use client"

import { useState, useMemo } from "react"
import {
  Radar,
  Mail,
  DollarSign,
  MapPin,
  Building2,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Github,
  Linkedin,
  ExternalLink,
  Loader2,
  Target,
  Star,
  Clock,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  FileText,
  Award,
  ArrowRight,
  Calendar,
  Shield,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type PassiveCandidate, type TalentTier, PASSIVE_CANDIDATES_SEED } from "@/lib/talent-radar"

const TIER_CONFIG: Record<
  TalentTier,
  {
    label: string
    shortLabel: string
    description: string
    bgColor: string
    textColor: string
    borderColor: string
    badgeBg: string
  }
> = {
  unicorn: {
    label: "Unicorn",
    shortLabel: "U",
    description: "Perfect match. Extremely rare.",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
    borderColor: "border-violet-500/30",
    badgeBg: "bg-violet-500/20",
  },
  rising_star: {
    label: "Rising Star",
    shortLabel: "RS",
    description: "Proven track record. High potential.",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    badgeBg: "bg-amber-500/20",
  },
  hidden_gem: {
    label: "Hidden Gem",
    shortLabel: "HG",
    description: "Underrated talent. Great value.",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    badgeBg: "bg-cyan-500/20",
  },
  sleeper: {
    label: "Sleeper",
    shortLabel: "S",
    description: "Solid fit. May need convincing.",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-400",
    borderColor: "border-slate-500/30",
    badgeBg: "bg-slate-500/20",
  },
}

const STATUS_CONFIG = {
  discovered: { label: "New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  researching: { label: "Researching", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  outreach_sent: { label: "Contacted", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  responded: { label: "Responded", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  interviewing: { label: "Interviewing", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  offer_sent: { label: "Offer Sent", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  closed: { label: "Closed", color: "bg-success/20 text-success border-success/30" },
}

const OPENNESS_CONFIG = {
  likely: { label: "Likely Open", color: "text-emerald-400" },
  possible: { label: "Possibly Open", color: "text-amber-400" },
  unknown: { label: "Unknown", color: "text-muted-foreground" },
  unlikely: { label: "Unlikely", color: "text-red-400" },
}

function TalentCard({
  candidate,
  onClick,
}: {
  candidate: PassiveCandidate
  onClick: () => void
}) {
  const tier = TIER_CONFIG[candidate.tier]
  const status = STATUS_CONFIG[candidate.status]
  const openness = OPENNESS_CONFIG[candidate.openToOpportunities]

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-black/30 rounded-xl p-4 border border-border cursor-pointer",
        "hover:border-foreground/30 transition-all group",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={candidate.avatarUrl || "/placeholder.svg?height=40&width=40"}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground truncate">{candidate.name}</span>
              <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", tier.badgeBg, tier.textColor)}>
                {tier.shortLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {candidate.currentRole} @ {candidate.currentCompany}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={cn("text-2xl font-black", tier.textColor)}>{candidate.matchScore}</div>
          <div className="text-[10px] text-muted-foreground">match</div>
        </div>
      </div>

      {/* Quick Info Row */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{candidate.location}</span>
        <span className="text-border">|</span>
        <Clock className="w-3 h-3" />
        <span>{candidate.yearsExperience}y exp</span>
      </div>

      {/* Skills Preview */}
      <div className="flex flex-wrap gap-1 mb-3">
        {candidate.skillsOverlap?.slice(0, 4).map((skill) => (
          <span
            key={skill.skill}
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded",
              skill.strength >= 0.9 ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground",
            )}
          >
            {skill.skill}
          </span>
        ))}
        {(candidate.skillsOverlap?.length || 0) > 4 && (
          <span className="text-[10px] text-muted-foreground">+{candidate.skillsOverlap.length - 4}</span>
        )}
      </div>

      {/* Why Reach Out Preview */}
      {candidate.whyReachOut?.[0] && (
        <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
          <span className="text-amber-400 font-medium">Why now:</span> {candidate.whyReachOut[0]}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", status.color)}>
            {status.label}
          </Badge>
          <span className={cn("text-[10px]", openness.color)}>{openness.label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
          View Full Profile <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  )
}

function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
}: {
  candidate: PassiveCandidate | null
  isOpen: boolean
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)
  const [generatingEmail, setGeneratingEmail] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")

  if (!candidate) return null

  const tier = TIER_CONFIG[candidate.tier]
  const status = STATUS_CONFIG[candidate.status]
  const openness = OPENNESS_CONFIG[candidate.openToOpportunities]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateOutreachEmail = async () => {
    setGeneratingEmail(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setGeneratedEmail(`Subject: ${candidate.name} - Quick question about ${candidate.currentCompany}

Hi ${candidate.name.split(" ")[0]},

${candidate.outreachAngle}

I'm reaching out because we're building something that I think would genuinely interest you:

${candidate.pitchPoints.map((p) => `• ${p}`).join("\n")}

I'd love to grab 20 minutes to share more. No pressure, no hard sell - just a conversation about what we're building and whether it might be interesting.

What does your calendar look like next week?

Best,
[Your name]

P.S. ${candidate.aiSuggestions.find((s) => s.category === "approach")?.insight || "Really enjoyed your recent work."}`)
    setGeneratingEmail(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[90vw] min-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border p-8">
        {/* Header */}
        <div className="flex items-start gap-6 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={candidate.avatarUrl || "/placeholder.svg?height=80&width=80"}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-nowrap">
              <h2 className="text-2xl font-bold text-foreground">{candidate.name}</h2>
              <span
                className={cn("text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap", tier.badgeBg, tier.textColor)}
              >
                {tier.label}
              </span>
              <Badge variant="outline" className={cn("text-xs whitespace-nowrap", status.color)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{candidate.headline}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {candidate.currentCompany}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {candidate.yearsExperience} years
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {candidate.tenure}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 pl-6">
            <div className={cn("text-5xl font-black", tier.textColor)}>{candidate.matchScore}</div>
            <div className="text-sm text-muted-foreground mt-1">match score</div>
            <div className={cn("text-sm mt-2 font-medium", openness.color)}>{openness.label}</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-black/30 border border-border w-full flex justify-start gap-1 p-1">
            <TabsTrigger value="overview" className="flex-1 px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex-1 px-4">
              Experience
            </TabsTrigger>
            <TabsTrigger value="whyreach" className="flex-1 px-4">
              Why Reach Out
            </TabsTrigger>
            <TabsTrigger value="aiinsights" className="flex-1 px-4">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex-1 px-4">
              Craft Outreach
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* What They Bring */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                What They Bring
              </h3>
              <ul className="space-y-2">
                {candidate.whatTheyBring.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Unique Strengths */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-violet-400" />
                Unique Strengths
              </h3>
              <ul className="space-y-2">
                {candidate.uniqueStrengths.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact & Ramp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Potential Impact
                </h3>
                <p className="text-sm text-muted-foreground">{candidate.potentialImpact}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Ramp-Up Time
                </h3>
                <p className="text-sm text-muted-foreground">{candidate.rampUpTime}</p>
              </div>
            </div>

            {/* Skills Overlap */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3">Skills Match</h3>
              <div className="grid grid-cols-2 gap-2">
                {candidate.skillsOverlap.map((skill) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            skill.strength >= 0.9
                              ? "bg-emerald-500"
                              : skill.strength >= 0.7
                                ? "bg-amber-500"
                                : "bg-muted-foreground",
                          )}
                          style={{ width: `${skill.strength * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{Math.round(skill.strength * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {candidate.missingSkills.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Missing: </span>
                  {candidate.missingSkills.map((skill) => (
                    <span key={skill} className="text-xs text-red-400 mr-2">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Compensation Intel */}
            {candidate.estimatedSalary && (
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Compensation Intel
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Estimated Salary</div>
                    <div className="text-lg font-semibold text-foreground">
                      {candidate.estimatedSalary.currency} {(candidate.estimatedSalary.min / 1000).toFixed(0)}k -{" "}
                      {(candidate.estimatedSalary.max / 1000).toFixed(0)}k
                    </div>
                    <div className="text-[10px] text-muted-foreground">Source: {candidate.salarySource}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Equity Expectation</div>
                    <div className="text-sm text-foreground">{candidate.equityExpectation || "Not available"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Comp Estimate</div>
                    <div className="text-sm text-foreground">{candidate.totalCompEstimate || "Not available"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-2">
              {candidate.githubUrl && (
                <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Github className="w-4 h-4" /> GitHub
                  </Button>
                </a>
              )}
              {candidate.linkedinUrl && (
                <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </Button>
                </a>
              )}
              {candidate.blogUrl && (
                <a href={candidate.blogUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <FileText className="w-4 h-4" /> Blog
                  </Button>
                </a>
              )}
              {candidate.twitterUrl && (
                <a href={candidate.twitterUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ExternalLink className="w-4 h-4" /> Twitter
                  </Button>
                </a>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-6 space-y-6">
            {/* Current Role */}
            <div className="bg-black/30 rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Current</Badge>
                <span className="text-xs text-muted-foreground">{candidate.tenure}</span>
              </div>
              <h3 className="font-semibold text-foreground">{candidate.currentRole}</h3>
              <p className="text-sm text-muted-foreground">
                {candidate.currentCompany} • {candidate.location}
              </p>
              <ul className="mt-3 space-y-1">
                {candidate.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Previous Roles */}
            {candidate.previousRoles.map((role, i) => (
              <div key={i} className="bg-black/30 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{role.duration}</span>
                </div>
                <h3 className="font-semibold text-foreground">{role.role}</h3>
                <p className="text-sm text-muted-foreground">{role.company}</p>
                <ul className="mt-3 space-y-1">
                  {role.highlights.map((h, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Check className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Notable Achievements */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Notable Achievements
              </h3>
              <ul className="space-y-2">
                {candidate.notableAchievements.map((a, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Trajectory */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Career Trajectory</h3>
              <Badge
                variant="outline"
                className={cn(
                  candidate.careerTrajectory === "rapid_growth"
                    ? "border-emerald-500/30 text-emerald-400"
                    : candidate.careerTrajectory === "steady"
                      ? "border-amber-500/30 text-amber-400"
                      : "border-border text-muted-foreground",
                )}
              >
                {candidate.careerTrajectory === "rapid_growth"
                  ? "Rapid Growth"
                  : candidate.careerTrajectory === "steady"
                    ? "Steady Progression"
                    : candidate.careerTrajectory === "lateral"
                      ? "Lateral Moves"
                      : "Recent Change"}
              </Badge>
            </div>
          </TabsContent>

          {/* Why Reach Out Tab */}
          <TabsContent value="whyreach" className="mt-6 space-y-6">
            {/* Timing Signals */}
            <div className="bg-black/30 rounded-xl p-4 border border-amber-500/30">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Timing Signals
              </h3>
              <ul className="space-y-2">
                {candidate.timingSignals.map((signal, i) => (
                  <li key={i} className="text-sm text-amber-400/90 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Reach Out */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Why Reach Out Now
              </h3>
              <ul className="space-y-2">
                {candidate.whyReachOut.map((reason, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitch Points */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Key Pitch Points
              </h3>
              <ul className="space-y-2">
                {candidate.pitchPoints.map((point, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Objections */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                Potential Objections & Counters
              </h3>
              <div className="space-y-4">
                {candidate.potentialObjections.map((obj, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-sm text-red-400/90">
                      <span className="font-medium">Objection:</span> "{obj.objection}"
                    </div>
                    <div className="text-sm text-emerald-400/90 pl-4 border-l-2 border-emerald-500/30">
                      <span className="font-medium">Counter:</span> "{obj.counter}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="aiinsights" className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <h3 className="font-semibold text-foreground">AI-Powered Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These insights are generated by analyzing public signals, career patterns, and market conditions.
              </p>
            </div>

            {candidate.aiSuggestions.map((suggestion, i) => (
              <div
                key={i}
                className={cn(
                  "bg-black/30 rounded-xl p-4 border",
                  suggestion.category === "opportunity"
                    ? "border-emerald-500/30"
                    : suggestion.category === "risk"
                      ? "border-red-500/30"
                      : suggestion.category === "timing"
                        ? "border-amber-500/30"
                        : "border-cyan-500/30",
                )}
              >
                <div className="flex items-center justify-between mb-3 gap-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex-shrink-0",
                      suggestion.category === "opportunity"
                        ? "border-emerald-500/30 text-emerald-400"
                        : suggestion.category === "risk"
                          ? "border-red-500/30 text-red-400"
                          : suggestion.category === "timing"
                            ? "border-amber-500/30 text-amber-400"
                            : "border-cyan-500/30 text-cyan-400",
                    )}
                  >
                    {suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {suggestion.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{suggestion.insight}</p>
              </div>
            ))}

            {/* Outreach Angle */}
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                Recommended Approach
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{candidate.outreachAngle}</p>
            </div>
          </TabsContent>

          {/* Outreach Tab */}
          <TabsContent value="outreach" className="mt-6 space-y-6">
            <div className="bg-black/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  AI-Generated Outreach Email
                </h3>
                {!generatedEmail && (
                  <Button onClick={generateOutreachEmail} disabled={generatingEmail} className="gap-2">
                    {generatingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Email
                      </>
                    )}
                  </Button>
                )}
              </div>

              {generatedEmail ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="min-h-[300px] font-mono text-sm bg-black/30 border-border"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleCopy(generatedEmail)} variant="outline" className="gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Email"}
                    </Button>
                    <Button onClick={() => setGeneratedEmail("")} variant="ghost">
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click "Generate Email" to create a personalized outreach message based on {candidate.name}'s profile,
                  interests, and our AI insights about the best approach.
                </p>
              )}
            </div>

            {/* Quick Copy Sections */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h4 className="font-medium text-foreground mb-2 text-sm">Subject Line Ideas</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleCopy(`Quick question about ${candidate.currentCompany}`)}
                  >
                    "Quick question about {candidate.currentCompany}"
                  </li>
                  {candidate.highlights?.[0] && (
                    <li
                      className="cursor-pointer hover:text-foreground"
                      onClick={() =>
                        handleCopy(`Loved your work on ${candidate.highlights[0].split(" ").slice(0, 3).join(" ")}`)
                      }
                    >
                      "Loved your work on {candidate.highlights[0].split(" ").slice(0, 3).join(" ")}..."
                    </li>
                  )}
                  <li
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleCopy(`${candidate.name.split(" ")[0]} - 20 min chat?`)}
                  >
                    "{candidate.name.split(" ")[0]} - 20 min chat?"
                  </li>
                </ul>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h4 className="font-medium text-foreground mb-2 text-sm">Opening Lines</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="cursor-pointer hover:text-foreground">"I've been following your work on..."</li>
                  {candidate.notableAchievements?.[0] && (
                    <li className="cursor-pointer hover:text-foreground">
                      "Your {candidate.notableAchievements[0].split(" ").slice(0, 4).join(" ")}... caught my eye"
                    </li>
                  )}
                  <li className="cursor-pointer hover:text-foreground">
                    "[Mutual connection] suggested I reach out..."
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export function TalentRadar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTier, setSelectedTier] = useState<TalentTier | "all">("all")
  const [selectedCandidate, setSelectedCandidate] = useState<PassiveCandidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const candidates = PASSIVE_CANDIDATES_SEED

  const filteredCandidates = useMemo(() => {
    if (selectedTier === "all") return candidates
    return candidates.filter((c) => c.tier === selectedTier)
  }, [candidates, selectedTier])

  const tierCounts = useMemo(() => {
    return {
      unicorn: candidates.filter((c) => c.tier === "unicorn").length,
      rising_star: candidates.filter((c) => c.tier === "rising_star").length,
      hidden_gem: candidates.filter((c) => c.tier === "hidden_gem").length,
      sleeper: candidates.filter((c) => c.tier === "sleeper").length,
    }
  }, [candidates])

  const handleCardClick = (candidate: PassiveCandidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Radar className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Talent Radar
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px]">AI-Powered</Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              {candidates.length} passive candidates discovered • {tierCounts.unicorn} unicorn
              {tierCounts.unicorn !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tier Filter Pills */}
          <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
            <button
              onClick={() => setSelectedTier("all")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                selectedTier === "all"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All {candidates.length}
            </button>
            {(["unicorn", "rising_star", "hidden_gem", "sleeper"] as TalentTier[]).map((tier) => {
              const config = TIER_CONFIG[tier]
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1",
                    selectedTier === tier
                      ? cn(config.badgeBg, config.textColor)
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold",
                      config.badgeBg,
                      config.textColor,
                    )}
                  >
                    {config.shortLabel}
                  </span>
                  {tierCounts[tier]}
                </button>
              )
            })}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="gap-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>

      {/* Collapsed State - Summary Cards */}
      {!isExpanded && (
        <div className="grid grid-cols-4 gap-3">
          {(["unicorn", "rising_star", "hidden_gem", "sleeper"] as TalentTier[]).map((tier) => {
            const config = TIER_CONFIG[tier]
            const count = tierCounts[tier]
            return (
              <div
                key={tier}
                onClick={() => {
                  setSelectedTier(tier)
                  setIsExpanded(true)
                }}
                className={cn(
                  "bg-black/30 rounded-xl p-3 border cursor-pointer transition-all hover:border-foreground/30",
                  config.borderColor,
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "w-6 h-6 rounded text-xs flex items-center justify-center font-bold",
                      config.badgeBg,
                      config.textColor,
                    )}
                  >
                    {config.shortLabel}
                  </span>
                  <span className={cn("text-xl font-black", config.textColor)}>{count}</span>
                </div>
                <div className="text-xs font-medium text-foreground">{config.label}s</div>
                <div className="text-[10px] text-muted-foreground">{config.description}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Expanded State - Candidate Grid */}
      {isExpanded && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {filteredCandidates.map((candidate) => (
            <TalentCard key={candidate.id} candidate={candidate} onClick={() => handleCardClick(candidate)} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCandidate(null)
        }}
      />
    </div>
  )
}
