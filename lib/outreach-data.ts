// FORGE — Outreach Automation Data Layer

// ─── Types ──────────────────────────────────────────────────────────────

export type MessageStatus = "draft" | "scheduled" | "sent" | "opened" | "replied" | "bounced"
export type CampaignStatus = "draft" | "active" | "paused" | "completed"

export interface OutreachTemplate {
    id: string
    name: string
    subject: string
    body: string
    delayDays: number // days after previous step (0 for first step)
}

export interface OutreachSequence {
    id: string
    name: string
    steps: OutreachTemplate[]
}

export interface OutreachMessage {
    id: string
    candidateId: string
    candidateName: string
    candidateUsername: string
    candidateEmail: string
    stepIndex: number
    subject: string
    body: string
    status: MessageStatus
    scheduledAt?: string
    sentAt?: string
    openedAt?: string
    repliedAt?: string
}

export interface OutreachCampaign {
    id: string
    name: string
    status: CampaignStatus
    sequence: OutreachSequence
    messages: OutreachMessage[]
    createdAt: string
    stats: {
        total: number
        sent: number
        opened: number
        replied: number
        bounced: number
    }
}

// ─── Personalization Tokens ─────────────────────────────────────────────

export const TOKENS = [
    { key: "{{firstName}}", label: "First Name", color: "text-emerald-400" },
    { key: "{{lastName}}", label: "Last Name", color: "text-emerald-400" },
    { key: "{{companyName}}", label: "Company", color: "text-blue-400" },
    { key: "{{roleTitle}}", label: "Role", color: "text-blue-400" },
    { key: "{{topSkill}}", label: "Top Skill", color: "text-orange-400" },
    { key: "{{repoName}}", label: "Best Repo", color: "text-purple-400" },
    { key: "{{senderName}}", label: "Sender", color: "text-white/60" },
] as const

export function personalizeTemplate(
    template: string,
    values: Record<string, string>
): string {
    let result = template
    for (const [key, value] of Object.entries(values)) {
        result = result.replaceAll(key, value)
    }
    return result
}

// ─── Default Sequence Templates ────────────────────────────────────────

export const DEFAULT_SEQUENCE: OutreachSequence = {
    id: "seq-default",
    name: "Engineering Talent Outreach",
    steps: [
        {
            id: "step-1",
            name: "Initial Outreach",
            delayDays: 0,
            subject: "Your work on {{repoName}} caught our eye — {{companyName}} is hiring",
            body: `Hi {{firstName}},

I came across your work on {{repoName}} and was genuinely impressed by your approach to {{topSkill}}. The depth of your contributions stood out.

We're building the engineering team at {{companyName}}, and we're looking for a {{roleTitle}} who thinks the way you do — someone who ships real systems, not just talks about them.

Would you be open to a quick 15-minute chat? No pressure, just want to share what we're building and see if there's a fit.

Best,
{{senderName}}`,
        },
        {
            id: "step-2",
            name: "Follow-up #1",
            delayDays: 3,
            subject: "Re: Your work on {{repoName}}",
            body: `Hi {{firstName}},

Just bumping this in case it got buried — I know inboxes are brutal.

I really do think you'd find what we're building at {{companyName}} interesting, especially given your background in {{topSkill}}. The team is small, the problems are hard, and the impact is immediate.

Happy to send over more details if you're curious.

{{senderName}}`,
        },
        {
            id: "step-3",
            name: "Follow-up #2",
            delayDays: 7,
            subject: "Quick question, {{firstName}}",
            body: `Hey {{firstName}},

One last try — if the {{roleTitle}} role isn't a fit right now, totally understand. But I'd genuinely love to get your take on what would make an opportunity interesting to you.

We're always iterating on how we approach talent, and people with your caliber of work on {{repoName}} are exactly who we want to learn from.

Either way, keep shipping great stuff.

{{senderName}}`,
        },
        {
            id: "step-4",
            name: "Breakup Email",
            delayDays: 14,
            subject: "Closing the loop",
            body: `Hi {{firstName}},

I'll take the hint — this isn't the right time. Totally respect that.

I'm going to close out this thread, but if anything changes or you ever want to explore what {{companyName}} is building, my inbox is always open.

Best of luck with everything.

{{senderName}}`,
        },
    ],
}

// ─── Demo Campaign Data ────────────────────────────────────────────────

export const DEMO_CAMPAIGN: OutreachCampaign = {
    id: "campaign-1",
    name: "Rust Engineer Outreach — Q1 2026",
    status: "active",
    sequence: DEFAULT_SEQUENCE,
    createdAt: "2026-02-15T09:00:00Z",
    stats: {
        total: 15,
        sent: 9,
        opened: 6,
        replied: 2,
        bounced: 1,
    },
    messages: [
        {
            id: "msg-1",
            candidateId: "c1",
            candidateName: "Zimo Ji",
            candidateUsername: "lltsdyp",
            candidateEmail: "zimo@example.com",
            stepIndex: 0,
            subject: "Your work on core-lib caught our eye — Forge is hiring",
            body: "Hi Zimo,\n\nI came across your work on core-lib and was genuinely impressed by your approach to systems programming...",
            status: "opened",
            scheduledAt: "2026-02-15T10:00:00Z",
            sentAt: "2026-02-15T10:00:00Z",
            openedAt: "2026-02-15T14:30:00Z",
        },
        {
            id: "msg-2",
            candidateId: "c2",
            candidateName: "Andreas Kling",
            candidateUsername: "awesomekling",
            candidateEmail: "andreas@example.com",
            stepIndex: 0,
            subject: "Your work on SerenityOS caught our eye — Forge is hiring",
            body: "Hi Andreas,\n\nI came across your work on SerenityOS and was genuinely impressed by your approach to browser engineering...",
            status: "replied",
            scheduledAt: "2026-02-15T10:00:00Z",
            sentAt: "2026-02-15T10:00:00Z",
            openedAt: "2026-02-15T12:00:00Z",
            repliedAt: "2026-02-15T18:45:00Z",
        },
        {
            id: "msg-3",
            candidateId: "c3",
            candidateName: "Tanner Linsley",
            candidateUsername: "tannerlinsley",
            candidateEmail: "tanner@example.com",
            stepIndex: 0,
            subject: "Your work on TanStack caught our eye — Forge is hiring",
            body: "Hi Tanner,\n\nI came across your work on TanStack and was genuinely impressed by your approach to React state management...",
            status: "sent",
            scheduledAt: "2026-02-15T10:00:00Z",
            sentAt: "2026-02-15T10:00:00Z",
        },
        {
            id: "msg-4",
            candidateId: "c4",
            candidateName: "Rich Harris",
            candidateUsername: "rich-harris",
            candidateEmail: "rich@example.com",
            stepIndex: 1,
            subject: "Re: Your work on Svelte",
            body: "Hi Rich,\n\nJust bumping this in case it got buried...",
            status: "sent",
            scheduledAt: "2026-02-18T10:00:00Z",
            sentAt: "2026-02-18T10:00:00Z",
        },
        {
            id: "msg-5",
            candidateId: "c5",
            candidateName: "Sarah Drasner",
            candidateUsername: "sdras",
            candidateEmail: "sarah@example.com",
            stepIndex: 0,
            subject: "Your work on Vue.js caught our eye — Forge is hiring",
            body: "Hi Sarah,\n\nI came across your work on Vue.js and was genuinely impressed...",
            status: "opened",
            scheduledAt: "2026-02-15T10:00:00Z",
            sentAt: "2026-02-15T10:00:00Z",
            openedAt: "2026-02-16T09:00:00Z",
        },
        {
            id: "msg-6",
            candidateId: "c6",
            candidateName: "Lee Robinson",
            candidateUsername: "leerob",
            candidateEmail: "lee@example.com",
            stepIndex: 0,
            subject: "Your work on Next.js caught our eye — Forge is hiring",
            body: "Hi Lee,\n\nI came across your work on Next.js and was genuinely impressed...",
            status: "scheduled",
            scheduledAt: "2026-02-19T10:00:00Z",
        },
        {
            id: "msg-7",
            candidateId: "c7",
            candidateName: "Quinn Lee",
            candidateUsername: "quinnleetv",
            candidateEmail: "quinn@example.com",
            stepIndex: 0,
            subject: "Your work on embedded-ml caught our eye — Forge is hiring",
            body: "Hi Quinn,\n\nI came across your work on embedded-ml...",
            status: "draft",
        },
        {
            id: "msg-8",
            candidateId: "c8",
            candidateName: "Alex Kim",
            candidateUsername: "alexkim98",
            candidateEmail: "alex@example.com",
            stepIndex: 0,
            subject: "Your work on gpu-accelerator caught our eye — Forge is hiring",
            body: "Hi Alex,\n\nI came across your work on gpu-accelerator...",
            status: "draft",
        },
        {
            id: "msg-9",
            candidateId: "c9",
            candidateName: "Parker Patel",
            candidateUsername: "parkerpatel78",
            candidateEmail: "parker@example.com",
            stepIndex: 0,
            subject: "Your work on design-tokens caught our eye — Forge is hiring",
            body: "Hi Parker,\n\nI came across your work on design-tokens...",
            status: "bounced",
            scheduledAt: "2026-02-15T10:00:00Z",
            sentAt: "2026-02-15T10:00:00Z",
        },
    ],
}

// ─── Helpers ──────────────────────────────────────────────────────────

export function getStatusConfig(status: MessageStatus) {
    const configs: Record<MessageStatus, { label: string; color: string; bg: string }> = {
        draft: { label: "Draft", color: "text-white/40", bg: "bg-white/5" },
        scheduled: { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-500/10" },
        sent: { label: "Sent", color: "text-amber-400", bg: "bg-amber-500/10" },
        opened: { label: "Opened", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        replied: { label: "Replied", color: "text-purple-400", bg: "bg-purple-500/10" },
        bounced: { label: "Bounced", color: "text-red-400", bg: "bg-red-500/10" },
    }
    return configs[status]
}

export function getCampaignStatusConfig(status: CampaignStatus) {
    const configs: Record<CampaignStatus, { label: string; color: string }> = {
        draft: { label: "Draft", color: "text-white/40" },
        active: { label: "Active", color: "text-emerald-400" },
        paused: { label: "Paused", color: "text-amber-400" },
        completed: { label: "Completed", color: "text-blue-400" },
    }
    return configs[status]
}
