"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Mail,
    Send,
    Clock,
    Play,
    Pause,
    Check,
    Copy,
    Eye,
    ChevronRight,
    Zap,
    Users,
    BarChart3,
    ArrowRight,
    Sparkles,
    Edit3,
    Trash2,
    Plus,
    MailCheck,
    MailOpen,
    MailX,
    Reply,
    Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DEMO_CAMPAIGN,
    DEFAULT_SEQUENCE,
    TOKENS,
    personalizeTemplate,
    getStatusConfig,
    getCampaignStatusConfig,
    type OutreachMessage,
    type OutreachTemplate,
    type CampaignStatus,
    type MessageStatus,
} from "@/lib/outreach-data"

interface OutreachPanelProps {
    onClose: () => void
    candidates?: any[]
}

export function OutreachPanel({ onClose, candidates }: OutreachPanelProps) {
    const [campaign, setCampaign] = useState(DEMO_CAMPAIGN)
    const [activeView, setActiveView] = useState<"overview" | "sequence" | "preview">("overview")
    const [selectedMessage, setSelectedMessage] = useState<OutreachMessage | null>(null)
    const [selectedStep, setSelectedStep] = useState(0)
    const [editingTemplate, setEditingTemplate] = useState<OutreachTemplate | null>(null)
    const [copied, setCopied] = useState(false)
    const [launching, setLaunching] = useState(false)

    const handleLaunch = () => {
        setLaunching(true)
        setTimeout(() => {
            setCampaign(prev => ({
                ...prev,
                status: "active" as CampaignStatus,
                messages: prev.messages.map(m =>
                    m.status === "draft"
                        ? { ...m, status: "scheduled" as MessageStatus, scheduledAt: new Date(Date.now() + 86400000).toISOString() }
                        : m
                ),
                stats: {
                    ...prev.stats,
                    total: prev.messages.length,
                },
            }))
            setLaunching(false)
        }, 1500)
    }

    const handlePause = () => {
        setCampaign(prev => ({ ...prev, status: prev.status === "paused" ? "active" : "paused" as CampaignStatus }))
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePreview = (msg: OutreachMessage) => {
        setSelectedMessage(msg)
        setActiveView("preview")
    }

    const handleRemoveCandidate = (msgId: string) => {
        setCampaign(prev => ({
            ...prev,
            messages: prev.messages.filter(m => m.id !== msgId),
        }))
    }

    const statusIcon = (status: MessageStatus) => {
        switch (status) {
            case "draft": return <Edit3 className="w-3 h-3" />
            case "scheduled": return <Calendar className="w-3 h-3" />
            case "sent": return <Send className="w-3 h-3" />
            case "opened": return <MailOpen className="w-3 h-3" />
            case "replied": return <Reply className="w-3 h-3" />
            case "bounced": return <MailX className="w-3 h-3" />
        }
    }

    const campaignStatusConfig = getCampaignStatusConfig(campaign.status)
    const openRate = campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0
    const replyRate = campaign.stats.sent > 0 ? Math.round((campaign.stats.replied / campaign.stats.sent) * 100) : 0

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed inset-y-0 right-0 w-[700px] bg-[#080808] shadow-2xl z-[100] flex flex-col font-mono text-xs overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-[#0A0A0A]">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-orange-500/10 rounded">
                        <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-white/90 text-sm font-medium">{campaign.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn("text-[10px] uppercase tracking-wider", campaignStatusConfig.color)}>
                                ● {campaignStatusConfig.label}
                            </span>
                            <span className="text-white/20">·</span>
                            <span className="text-white/30 text-[10px]">{campaign.messages.length} candidates</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-white/10 text-white/40 hover:text-white" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-5 gap-px bg-white/[0.03] shrink-0">
                {[
                    { label: "Total", value: campaign.stats.total, color: "text-white/70" },
                    { label: "Sent", value: campaign.stats.sent, color: "text-amber-400" },
                    { label: "Opened", value: campaign.stats.opened, color: "text-emerald-400" },
                    { label: "Replied", value: campaign.stats.replied, color: "text-purple-400" },
                    { label: "Bounced", value: campaign.stats.bounced, color: "text-red-400" },
                ].map(stat => (
                    <div key={stat.label} className="bg-[#0A0A0A] px-4 py-3 text-center">
                        <div className={cn("text-lg font-light", stat.color)}>{stat.value}</div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Rates Bar */}
            <div className="flex items-center gap-6 px-6 py-3 bg-[#0A0A0A] shrink-0">
                <div className="flex items-center gap-2">
                    <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${openRate}%` }} />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">{openRate}% open rate</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all" style={{ width: `${replyRate}%` }} />
                    </div>
                    <span className="text-[10px] text-purple-400 font-medium">{replyRate}% reply rate</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                    {campaign.status === "active" && (
                        <Button variant="ghost" size="sm" onClick={handlePause} className="h-7 text-[10px] uppercase tracking-wider text-amber-400 hover:bg-amber-500/10">
                            <Pause className="w-3 h-3 mr-1.5" /> Pause
                        </Button>
                    )}
                    {campaign.status === "paused" && (
                        <Button variant="ghost" size="sm" onClick={handlePause} className="h-7 text-[10px] uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10">
                            <Play className="w-3 h-3 mr-1.5" /> Resume
                        </Button>
                    )}
                </div>
            </div>

            {/* Tab Nav */}
            <div className="flex px-6 shrink-0 bg-[#0A0A0A]">
                {[
                    { key: "overview", label: "Candidate Queue", icon: Users },
                    { key: "sequence", label: "Email Sequence", icon: Mail },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveView(tab.key as any); setSelectedMessage(null) }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-wider font-medium transition-colors",
                            activeView === tab.key || (tab.key === "overview" && activeView === "preview")
                                ? "text-orange-500 border-b border-orange-500"
                                : "text-white/30 hover:text-white/60"
                        )}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                    {/* ─── CANDIDATE QUEUE ─── */}
                    {(activeView === "overview" || activeView === "preview") && !selectedMessage && (
                        <motion.div
                            key="queue"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 space-y-1"
                        >
                            {campaign.messages.map((msg, i) => {
                                const statusCfg = getStatusConfig(msg.status)
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                                    >
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded bg-white/10 shrink-0 overflow-hidden">
                                            {msg.candidateUsername ? (
                                                <img
                                                    src={`https://github.com/${msg.candidateUsername}.png`}
                                                    className="w-full h-full object-cover grayscale opacity-70"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-sm text-white/30">
                                                    {msg.candidateName.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + Email */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white/80 text-xs font-medium truncate">{msg.candidateName}</div>
                                            <div className="text-white/30 text-[10px] truncate">{msg.candidateEmail}</div>
                                        </div>

                                        {/* Step indicator */}
                                        <div className="text-[10px] text-white/20 shrink-0">
                                            Step {msg.stepIndex + 1}/{campaign.sequence.steps.length}
                                        </div>

                                        {/* Status Badge */}
                                        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium shrink-0", statusCfg.bg, statusCfg.color)}>
                                            {statusIcon(msg.status)}
                                            {statusCfg.label}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-white/30 hover:text-white hover:bg-white/10"
                                                onClick={() => handlePreview(msg)}
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-white/30 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleRemoveCandidate(msg.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )
                            })}

                            {/* Launch / Bulk Actions */}
                            <div className="pt-6 flex items-center gap-3">
                                <Button
                                    onClick={handleLaunch}
                                    disabled={launching || campaign.status === "active"}
                                    className="flex-1 h-10 bg-orange-500 hover:bg-orange-600 text-black font-medium text-xs uppercase tracking-wider rounded-lg"
                                >
                                    {launching ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                        </motion.div>
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    {launching ? "Scheduling..." : campaign.status === "active" ? "Campaign Active" : "Launch Sequence"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="h-10 text-white/40 hover:text-white hover:bg-white/5 text-xs uppercase tracking-wider"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Candidates
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── EMAIL PREVIEW ─── */}
                    {activeView === "preview" && selectedMessage && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6 space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setSelectedMessage(null); setActiveView("overview") }}
                                    className="h-7 text-white/40 hover:text-white text-[10px]"
                                >
                                    ← Back to Queue
                                </Button>
                                <div className="flex-1" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy(`Subject: ${selectedMessage.subject}\n\n${selectedMessage.body}`)}
                                    className="h-7 text-[10px] uppercase tracking-wider text-white/40 hover:text-white"
                                >
                                    {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>

                            {/* Recipient */}
                            <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-lg">
                                <div className="w-10 h-10 rounded bg-white/10 overflow-hidden">
                                    <img
                                        src={`https://github.com/${selectedMessage.candidateUsername}.png`}
                                        className="w-full h-full object-cover grayscale opacity-70"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <div className="text-white/80 font-medium">{selectedMessage.candidateName}</div>
                                    <div className="text-white/30 text-[10px]">{selectedMessage.candidateEmail}</div>
                                </div>
                                <div className="flex-1" />
                                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium", getStatusConfig(selectedMessage.status).bg, getStatusConfig(selectedMessage.status).color)}>
                                    {statusIcon(selectedMessage.status)}
                                    {getStatusConfig(selectedMessage.status).label}
                                </div>
                            </div>

                            {/* Email Content */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-white/20 block mb-2">Subject</label>
                                    <div className="bg-white/[0.03] rounded-lg px-4 py-3 text-white/70 text-sm">
                                        {selectedMessage.subject}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-white/20 block mb-2">Body</label>
                                    <div className="bg-white/[0.03] rounded-lg px-4 py-4 text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.body}
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            {(selectedMessage.sentAt || selectedMessage.openedAt || selectedMessage.repliedAt) && (
                                <div className="space-y-2">
                                    <div className="text-[10px] uppercase tracking-wider text-white/20">Activity</div>
                                    <div className="space-y-1.5">
                                        {selectedMessage.sentAt && (
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                <Send className="w-3 h-3 text-amber-400" />
                                                Sent {new Date(selectedMessage.sentAt).toLocaleString()}
                                            </div>
                                        )}
                                        {selectedMessage.openedAt && (
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                <MailOpen className="w-3 h-3 text-emerald-400" />
                                                Opened {new Date(selectedMessage.openedAt).toLocaleString()}
                                            </div>
                                        )}
                                        {selectedMessage.repliedAt && (
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                <Reply className="w-3 h-3 text-purple-400" />
                                                Replied {new Date(selectedMessage.repliedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4">
                                {selectedMessage.status === "draft" && (
                                    <Button className="flex-1 h-9 bg-orange-500 hover:bg-orange-600 text-black text-[10px] uppercase tracking-wider font-medium">
                                        <Send className="w-3 h-3 mr-2" /> Send Now
                                    </Button>
                                )}
                                {selectedMessage.status === "scheduled" && (
                                    <Button className="flex-1 h-9 bg-blue-500 hover:bg-blue-600 text-white text-[10px] uppercase tracking-wider font-medium">
                                        <Clock className="w-3 h-3 mr-2" /> Scheduled for {selectedMessage.scheduledAt ? new Date(selectedMessage.scheduledAt).toLocaleDateString() : "TBD"}
                                    </Button>
                                )}
                                {selectedMessage.status === "replied" && (
                                    <Button className="flex-1 h-9 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-[10px] uppercase tracking-wider font-medium">
                                        <MailCheck className="w-3 h-3 mr-2" /> View Reply Thread
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── SEQUENCE BUILDER ─── */}
                    {activeView === "sequence" && (
                        <motion.div
                            key="sequence"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 space-y-6"
                        >
                            {/* Token Legend */}
                            <div className="space-y-2">
                                <div className="text-[10px] uppercase tracking-wider text-white/20">Personalization Tokens</div>
                                <div className="flex flex-wrap gap-2">
                                    {TOKENS.map(token => (
                                        <span
                                            key={token.key}
                                            className={cn("px-2 py-1 bg-white/5 rounded text-[10px] font-mono cursor-pointer hover:bg-white/10 transition-colors", token.color)}
                                            onClick={() => handleCopy(token.key)}
                                        >
                                            {token.key}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="space-y-4">
                                {campaign.sequence.steps.map((step, i) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={cn(
                                            "rounded-lg overflow-hidden transition-colors cursor-pointer",
                                            selectedStep === i ? "bg-white/[0.05] ring-1 ring-orange-500/30" : "bg-white/[0.02] hover:bg-white/[0.04]"
                                        )}
                                        onClick={() => setSelectedStep(i)}
                                    >
                                        {/* Step Header */}
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium",
                                                selectedStep === i ? "bg-orange-500 text-black" : "bg-white/10 text-white/40"
                                            )}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white/80 text-xs font-medium">{step.name}</div>
                                                <div className="text-white/30 text-[10px]">
                                                    {step.delayDays === 0 ? "Immediate" : `${step.delayDays} days after prev`}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {step.delayDays > 0 && (
                                                    <span className="flex items-center gap-1 text-[10px] text-white/20">
                                                        <Clock className="w-3 h-3" /> +{step.delayDays}d
                                                    </span>
                                                )}
                                                <ChevronRight className={cn("w-4 h-4 text-white/20 transition-transform", selectedStep === i && "rotate-90")} />
                                            </div>
                                        </div>

                                        {/* Expanded Step */}
                                        <AnimatePresence>
                                            {selectedStep === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 space-y-3">
                                                        <div>
                                                            <label className="text-[9px] uppercase tracking-wider text-white/20 block mb-1">Subject</label>
                                                            <div className="bg-black/40 rounded px-3 py-2 text-white/60 text-xs font-mono">
                                                                {step.subject}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] uppercase tracking-wider text-white/20 block mb-1">Body</label>
                                                            <div className="bg-black/40 rounded px-3 py-3 text-white/50 text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-hide">
                                                                {step.body}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-[10px] uppercase tracking-wider text-white/30 hover:text-white"
                                                                onClick={(e) => { e.stopPropagation(); handleCopy(`Subject: ${step.subject}\n\n${step.body}`) }}
                                                            >
                                                                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                                                {copied ? "Copied" : "Copy Template"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}

                                {/* Connector lines between steps */}
                                {/* Add Step button */}
                                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-white/10 text-white/20 hover:text-white/40 hover:border-white/20 transition-colors text-[10px] uppercase tracking-wider">
                                    <Plus className="w-3 h-3" /> Add Step
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
