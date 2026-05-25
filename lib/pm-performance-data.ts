// ─── Performance Intelligence & People Ops ──────────────────────────────────
// Data types and demo content for 7 features:
// 44. Continuous Performance Summary
// 45. Promotion Readiness
// 46. Underperformance Detection
// 47. Manager Coaching AI
// 48. Peer Signal Aggregation
// 49. Internal Mobility Recommendation
// 50. Workforce Capability Mapping

// ─── 44. Continuous Performance Summary ──────────────────────────────────────

export interface PerformanceSummary {
    employeeId: string
    name: string
    role: string
    team: string
    avatar: string
    overallScore: number
    trend: 'rising' | 'stable' | 'declining'
    trendDelta: number
    period: string
    signals: PerformanceSignal[]
    weeklyScores: number[]  // last 12 weeks for sparkline
    highlights: string[]
    areasToWatch: string[]
}

export interface PerformanceSignal {
    id: string
    category: 'output' | 'quality' | 'collaboration' | 'growth' | 'leadership'
    metric: string
    value: number
    maxValue: number
    trend: 'up' | 'stable' | 'down'
    insight: string
}

export const SIGNAL_CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    output: { label: 'Output', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '📊' },
    quality: { label: 'Quality', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '✨' },
    collaboration: { label: 'Collaboration', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: '🤝' },
    growth: { label: 'Growth', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '📈' },
    leadership: { label: 'Leadership', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: '👑' },
}

export const DEMO_PERFORMANCE_SUMMARIES: PerformanceSummary[] = [
    {
        employeeId: 'emp-001',
        name: 'Sarah Chen',
        role: 'Senior Frontend Engineer',
        team: 'Platform',
        avatar: 'SC',
        overallScore: 87,
        trend: 'rising',
        trendDelta: 8,
        period: 'Q4 2025',
        weeklyScores: [72, 75, 74, 78, 80, 79, 82, 84, 85, 87, 86, 87],
        signals: [
            { id: 'ps-1', category: 'output', metric: 'PRs Merged / Week', value: 12, maxValue: 15, trend: 'up', insight: 'Consistently above team average of 8.2' },
            { id: 'ps-2', category: 'quality', metric: 'Review Pass Rate', value: 94, maxValue: 100, trend: 'up', insight: 'First-pass approval rate increased 11% this quarter' },
            { id: 'ps-3', category: 'collaboration', metric: 'Code Reviews Given', value: 28, maxValue: 35, trend: 'stable', insight: 'Active reviewer, particularly on junior PRs' },
            { id: 'ps-4', category: 'growth', metric: 'New Tech Adoption', value: 3, maxValue: 5, trend: 'up', insight: 'Led migration to RSC, mentored 2 juniors' },
            { id: 'ps-5', category: 'leadership', metric: 'Initiative Score', value: 8, maxValue: 10, trend: 'up', insight: 'Proposed and shipped design system overhaul' },
        ],
        highlights: ['Shipped design system v2 — adopted by 4 teams', 'Reduced bundle size 34% via code-splitting initiative', 'Mentored 2 junior engineers through onboarding'],
        areasToWatch: ['Documentation velocity could improve', 'Cross-team communication sometimes delayed'],
    },
    {
        employeeId: 'emp-002',
        name: 'Marcus Johnson',
        role: 'Backend Engineer',
        team: 'Infrastructure',
        avatar: 'MJ',
        overallScore: 71,
        trend: 'stable',
        trendDelta: 2,
        period: 'Q4 2025',
        weeklyScores: [68, 70, 69, 72, 71, 70, 73, 72, 71, 70, 72, 71],
        signals: [
            { id: 'ps-6', category: 'output', metric: 'PRs Merged / Week', value: 7, maxValue: 15, trend: 'stable', insight: 'Consistent but below team median of 9.1' },
            { id: 'ps-7', category: 'quality', metric: 'Incident Response', value: 85, maxValue: 100, trend: 'up', insight: 'Strong on-call performance, 15min avg response' },
            { id: 'ps-8', category: 'collaboration', metric: 'Cross-team Projects', value: 2, maxValue: 5, trend: 'down', insight: 'Fewer cross-functional initiatives than peers' },
            { id: 'ps-9', category: 'growth', metric: 'Learning Hours', value: 6, maxValue: 10, trend: 'stable', insight: 'Steady upskilling on distributed systems' },
        ],
        highlights: ['Zero production incidents during on-call rotations', 'Optimised database queries — 40% latency reduction'],
        areasToWatch: ['Output volume below team average', 'Limited involvement in architecture discussions'],
    },
]

// ─── 45. Promotion Readiness ─────────────────────────────────────────────────

export interface PromotionCase {
    employeeId: string
    name: string
    currentLevel: string
    targetLevel: string
    readinessScore: number
    readinessLabel: 'ready' | 'almost' | 'developing' | 'not-ready'
    timeInRole: string
    evidenceAreas: PromotionEvidence[]
    gapAreas: PromotionGap[]
    comparisons: { metric: string; candidate: number; levelAvg: number; nextLevelAvg: number }[]
    recommendation: string
}

export interface PromotionEvidence {
    area: string
    score: number
    maxScore: number
    examples: string[]
    weight: number
}

export interface PromotionGap {
    area: string
    current: string
    required: string
    actionPlan: string
    timeToClose: string
}

export const READINESS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    ready: { label: 'Ready Now', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: '🚀' },
    almost: { label: 'Almost Ready', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '⏳' },
    developing: { label: 'Developing', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', icon: '📈' },
    'not-ready': { label: 'Not Ready', color: 'text-red-400 bg-red-500/15 border-red-500/30', icon: '🔴' },
}

export const DEMO_PROMOTION_CASE: PromotionCase = {
    employeeId: 'emp-001',
    name: 'Sarah Chen',
    currentLevel: 'L5 — Senior Engineer',
    targetLevel: 'L6 — Staff Engineer',
    readinessScore: 82,
    readinessLabel: 'almost',
    timeInRole: '2.3 years',
    evidenceAreas: [
        { area: 'Technical Depth', score: 92, maxScore: 100, weight: 25, examples: ['Led React Server Components migration for entire platform', 'Designed caching layer reducing API calls 60%', 'Published internal RFC on state management patterns'] },
        { area: 'Scope & Impact', score: 85, maxScore: 100, weight: 25, examples: ['Design system v2 adopted by 4 product teams', 'Bundle size reduction saved $12K/mo in CDN costs', 'Performance improvements lifted NPS by 8 points'] },
        { area: 'Technical Leadership', score: 78, maxScore: 100, weight: 20, examples: ['Mentored 2 juniors through onboarding', 'Runs weekly frontend architecture review', 'Drove consensus on TypeScript strict mode adoption'] },
        { area: 'Communication', score: 80, maxScore: 100, weight: 15, examples: ['Clear RFCs with diagrams and trade-off analysis', 'Effective sprint demos with business context', 'Good async communication in Slack'] },
        { area: 'Strategic Thinking', score: 72, maxScore: 100, weight: 15, examples: ['Proposed micro-frontend architecture for scale', 'Identified technical debt priority matrix'] },
    ],
    gapAreas: [
        { area: 'Cross-org influence', current: 'Primarily within Platform team', required: 'Regularly drives decisions across 2+ orgs', actionPlan: 'Lead the upcoming API governance initiative with Backend and Mobile teams', timeToClose: '3-6 months' },
        { area: 'Mentorship breadth', current: 'Mentors 2 juniors', required: 'Mentors across levels and teams', actionPlan: 'Take on a senior engineer mentee from another team', timeToClose: '2-3 months' },
    ],
    comparisons: [
        { metric: 'Technical Depth', candidate: 92, levelAvg: 78, nextLevelAvg: 88 },
        { metric: 'Scope & Impact', candidate: 85, levelAvg: 72, nextLevelAvg: 85 },
        { metric: 'Leadership', candidate: 78, levelAvg: 65, nextLevelAvg: 82 },
        { metric: 'Communication', candidate: 80, levelAvg: 70, nextLevelAvg: 80 },
        { metric: 'Strategic Thinking', candidate: 72, levelAvg: 60, nextLevelAvg: 78 },
    ],
    recommendation: 'Sarah is performing at or above L6 expectations in Technical Depth and Scope. The primary gap is cross-org influence — with 3-6 months of targeted development on the API governance initiative, she should be fully ready for promotion. Recommend starting the promotion process in Q2 2026.',
}

// ─── 46. Underperformance Detection ──────────────────────────────────────────

export interface UnderperformanceAlert {
    id: string
    employeeId: string
    name: string
    role: string
    team: string
    riskLevel: 'critical' | 'high' | 'moderate' | 'watch'
    riskScore: number
    detectedDate: string
    signals: EarlyWarningSignal[]
    weeklyTrend: number[] // last 8 weeks
    suggestedActions: string[]
    managerNotes: string
}

export interface EarlyWarningSignal {
    signal: string
    category: 'velocity' | 'quality' | 'engagement' | 'collaboration'
    severity: 'critical' | 'warning' | 'info'
    detail: string
    dataPoint: string
}

export const RISK_LEVEL_CONFIG: Record<string, { label: string; color: string; glow: string }> = {
    critical: { label: 'Critical', color: 'text-red-400 bg-red-500/15 border-red-500/30', glow: 'shadow-red-500/20' },
    high: { label: 'High Risk', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30', glow: 'shadow-orange-500/20' },
    moderate: { label: 'Moderate', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', glow: 'shadow-amber-500/20' },
    watch: { label: 'Watch', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', glow: 'shadow-blue-500/20' },
}

export const DEMO_UNDERPERFORMANCE_ALERTS: UnderperformanceAlert[] = [
    {
        id: 'ua-1',
        employeeId: 'emp-005',
        name: 'Tyler Brooks',
        role: 'Mid-Level Engineer',
        team: 'Payments',
        riskLevel: 'high',
        riskScore: 72,
        detectedDate: '2 weeks ago',
        weeklyTrend: [78, 75, 72, 68, 65, 63, 60, 58],
        signals: [
            { signal: 'PR velocity down 45%', category: 'velocity', severity: 'critical', detail: 'Averaged 2.1 PRs/week vs historic 3.8', dataPoint: '-45% over 4 weeks' },
            { signal: 'Standup participation dropped', category: 'engagement', severity: 'warning', detail: 'Missed 3 of last 10 standups, camera off when present', dataPoint: '30% absence rate' },
            { signal: 'Code review quality declining', category: 'quality', severity: 'warning', detail: 'Reviews shortened from avg 12 comments to 3', dataPoint: '-75% review depth' },
            { signal: 'Slack activity reduced', category: 'engagement', severity: 'info', detail: 'Messages down 60% in team channels', dataPoint: '4 msgs/day → 1.5' },
        ],
        suggestedActions: ['Schedule private 1:1 to check in on wellbeing', 'Review recent work for blockers or confusion', 'Consider temporarily reducing scope', 'Connect with HR for support resources if needed'],
        managerNotes: 'Tyler recently went through a personal situation. Approach with empathy first.',
    },
    {
        id: 'ua-2',
        employeeId: 'emp-006',
        name: 'Priya Sharma',
        role: 'Senior Designer',
        team: 'Product',
        riskLevel: 'moderate',
        riskScore: 45,
        detectedDate: '1 week ago',
        weeklyTrend: [82, 80, 78, 76, 74, 73, 72, 70],
        signals: [
            { signal: 'Design iteration cycles increasing', category: 'velocity', severity: 'warning', detail: 'Average iterations per deliverable up from 2.3 to 4.1', dataPoint: '+78% iterations' },
            { signal: 'Stakeholder feedback mixed', category: 'quality', severity: 'info', detail: 'Last 3 design reviews had significant revision requests', dataPoint: '3 consecutive revisions' },
        ],
        suggestedActions: ['Discuss design brief clarity with PM', 'Review stakeholder alignment process', 'Pair with senior designer on next project'],
        managerNotes: 'May be related to shifting product requirements. Investigate upstream causes.',
    },
]

// ─── 47. Manager Coaching AI ─────────────────────────────────────────────────

export interface CoachingSuggestion {
    id: string
    scenario: string
    context: string
    category: 'feedback' | 'development' | 'growth' | 'conflict' | 'recognition'
    urgency: 'immediate' | 'this-week' | 'this-quarter'
    suggestedLanguage: SuggestedLanguage[]
    developmentPlan: DevelopmentStep[]
    doList: string[]
    dontList: string[]
}

export interface SuggestedLanguage {
    situation: string
    script: string
    tone: string
}

export interface DevelopmentStep {
    step: string
    timeline: string
    metrics: string
    owner: string
}

export const COACHING_CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    feedback: { label: 'Feedback', color: 'text-blue-400 bg-blue-500/10', icon: '💬' },
    development: { label: 'Development', color: 'text-emerald-400 bg-emerald-500/10', icon: '🌱' },
    growth: { label: 'Growth Path', color: 'text-violet-400 bg-violet-500/10', icon: '🚀' },
    conflict: { label: 'Conflict', color: 'text-red-400 bg-red-500/10', icon: '⚡' },
    recognition: { label: 'Recognition', color: 'text-amber-400 bg-amber-500/10', icon: '🌟' },
}

export const DEMO_COACHING: CoachingSuggestion[] = [
    {
        id: 'coach-1',
        scenario: 'Addressing declining code review quality',
        context: 'Tyler\'s code reviews have gone from detailed and constructive to superficial "LGTM" comments over the past 3 weeks.',
        category: 'feedback',
        urgency: 'this-week',
        suggestedLanguage: [
            { situation: 'Opening the conversation', script: 'I\'ve noticed a shift in your code reviews recently, and I wanted to check in. Your reviews used to be really thorough — the team benefits a lot from your insights. Is there something going on that\'s making it harder to give reviews the attention they deserve?', tone: 'Curious, not accusatory' },
            { situation: 'If they cite time pressure', script: 'I hear you. Let\'s look at your current workload together. I\'d rather reduce your task count slightly than lose the quality of your reviews, because they genuinely help the team ship better code.', tone: 'Supportive, problem-solving' },
            { situation: 'Setting expectations', script: 'Going forward, I\'d love for us to target at least 3-4 substantive comments per review. Not nitpicks — real architectural or logic feedback. Can we try that for the next two weeks and see how it feels?', tone: 'Collaborative, specific' },
        ],
        developmentPlan: [
            { step: 'Reduce sprint commitment by 1 story point', timeline: 'This sprint', metrics: 'Review depth returns to baseline', owner: 'Manager' },
            { step: 'Pair review session with senior engineer', timeline: 'Next week', metrics: 'Quality of feedback improves', owner: 'Tyler + Senior' },
            { step: 'Check-in on review quality', timeline: '2 weeks', metrics: 'Avg comments per review ≥ 4', owner: 'Manager' },
        ],
        doList: ['Lead with curiosity, not judgment', 'Reference specific examples', 'Offer concrete support and resources', 'Follow up within 2 weeks'],
        dontList: ['Don\'t compare to other team members', 'Don\'t assume the cause', 'Don\'t combine with other feedback topics', 'Don\'t make it about metrics only'],
    },
    {
        id: 'coach-2',
        scenario: 'Recognising exceptional cross-team contribution',
        context: 'Sarah led the API governance initiative that unified 3 teams\' API standards, saving an estimated 200 engineering hours per quarter.',
        category: 'recognition',
        urgency: 'immediate',
        suggestedLanguage: [
            { situation: 'Public recognition (team meeting)', script: 'I want to call out Sarah\'s work on the API governance initiative. She didn\'t just solve a technical problem — she brought three teams together, navigated competing priorities, and delivered a standard that\'s already saving us significant engineering time. This is exactly the kind of Staff-level impact we value.', tone: 'Celebratory, specific' },
            { situation: 'Private follow-up', script: 'I meant what I said in the meeting. The way you handled the politics of getting Backend, Mobile, and Platform aligned was impressive. That\'s a skill that\'s hard to teach. How are you feeling about the project?', tone: 'Warm, genuine' },
        ],
        developmentPlan: [
            { step: 'Nominate for quarterly impact award', timeline: 'This week', metrics: 'Formal recognition', owner: 'Manager' },
            { step: 'Connect work to promotion case', timeline: 'This week', metrics: 'Document in promotion packet', owner: 'Manager' },
            { step: 'Give Sarah visibility with VP', timeline: 'Next all-hands', metrics: 'Senior leadership awareness', owner: 'Manager' },
        ],
        doList: ['Be specific about what was impressive', 'Connect to career growth', 'Recognise both technical and soft skills', 'Put it in writing for the record'],
        dontList: ['Don\'t delay recognition', 'Don\'t be vague ("good job")', 'Don\'t only recognise in private', 'Don\'t forget to document for promotion'],
    },
]

// ─── 48. Peer Signal Aggregation ─────────────────────────────────────────────

export interface PeerSignalReport {
    employeeId: string
    name: string
    role: string
    feedbackCount: number
    period: string
    overallSentiment: number // 0-100
    sentimentTrend: number[]  // monthly, 6 months
    themes: PeerTheme[]
    verbatims: PeerVerbatim[]
    blindSpots: string[]
}

export interface PeerTheme {
    theme: string
    frequency: number
    sentiment: 'positive' | 'neutral' | 'negative'
    examples: string[]
}

export interface PeerVerbatim {
    quote: string
    context: string
    sentiment: 'positive' | 'neutral' | 'constructive'
    anonymous: boolean
}

export const DEMO_PEER_REPORT: PeerSignalReport = {
    employeeId: 'emp-001',
    name: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    feedbackCount: 14,
    period: 'Last 6 months',
    overallSentiment: 84,
    sentimentTrend: [78, 80, 82, 81, 85, 84],
    themes: [
        { theme: 'Technical mentorship', frequency: 9, sentiment: 'positive', examples: ['Always takes time to explain the "why"', 'Her code reviews teach me new patterns'] },
        { theme: 'Clear communication', frequency: 7, sentiment: 'positive', examples: ['RFCs are a model for the team', 'Explains complex trade-offs simply'] },
        { theme: 'Collaboration style', frequency: 5, sentiment: 'neutral', examples: ['Sometimes moves fast without checking alignment', 'Great in pairing sessions, less async'] },
        { theme: 'Ownership & drive', frequency: 8, sentiment: 'positive', examples: ['Doesn\'t wait for permission to fix things', 'Proactively identifies tech debt'] },
        { theme: 'Cross-team dynamics', frequency: 3, sentiment: 'neutral', examples: ['Could be more visible outside Platform team', 'Backend team wishes she joined their arch reviews'] },
    ],
    verbatims: [
        { quote: 'Sarah\'s code reviews are the best on the team. She catches things nobody else does and always explains why it matters.', context: 'Peer review cycle', sentiment: 'positive', anonymous: true },
        { quote: 'I wish she would slow down sometimes and bring others along. She can move so fast that it\'s hard to keep up.', context: 'Quarterly feedback', sentiment: 'constructive', anonymous: true },
        { quote: 'She\'s the reason I understand React Server Components. She spent 2 hours with me when she didn\'t have to.', context: 'Onboarding feedback', sentiment: 'positive', anonymous: false },
        { quote: 'Her Slack messages can be terse. Sometimes I\'m not sure if she\'s frustrated or just busy.', context: 'Communication feedback', sentiment: 'constructive', anonymous: true },
    ],
    blindSpots: ['Perception of being "too fast" may create distance with slower-paced team members', 'Async communication style may be misread as impatient', 'Limited visibility outside Platform team is a promotion gap'],
}

// ─── 49. Internal Mobility ───────────────────────────────────────────────────

export interface MobilityRecommendation {
    id: string
    employeeName: string
    currentRole: string
    currentTeam: string
    recommendedRole: string
    recommendedTeam: string
    matchScore: number
    reasoning: string
    skillOverlap: { skill: string; current: number; required: number }[]
    growthOpportunities: string[]
    risks: string[]
    impactOnCurrentTeam: string
    timeline: string
}

export const DEMO_MOBILITY: MobilityRecommendation[] = [
    {
        id: 'mob-1',
        employeeName: 'Marcus Johnson',
        currentRole: 'Backend Engineer',
        currentTeam: 'Infrastructure',
        recommendedRole: 'Site Reliability Engineer',
        recommendedTeam: 'Platform Reliability',
        matchScore: 91,
        reasoning: 'Marcus\'s strong incident response skills (top 10% on-call performance) and deep infrastructure knowledge make him an exceptional SRE candidate. His current output concerns may stem from role-interest misalignment.',
        skillOverlap: [
            { skill: 'Incident Response', current: 92, required: 85 },
            { skill: 'Infrastructure Design', current: 88, required: 80 },
            { skill: 'Monitoring & Observability', current: 75, required: 85 },
            { skill: 'Automation', current: 70, required: 80 },
            { skill: 'Capacity Planning', current: 60, required: 75 },
        ],
        growthOpportunities: ['Would be one of the strongest incident responders on the SRE team', 'Natural progression path to SRE Lead within 18 months', 'Aligns with his stated interest in reliability engineering'],
        risks: ['Infrastructure team loses a solid contributor', '2-3 month ramp-up on SRE-specific tooling', 'May need Terraform and Kubernetes certifications'],
        impactOnCurrentTeam: 'Moderate — team has depth in backend. Recommend backfilling within 1 quarter.',
        timeline: 'Start transition in Q1, full transfer by end of Q1',
    },
    {
        id: 'mob-2',
        employeeName: 'Priya Sharma',
        currentRole: 'Senior Designer',
        currentTeam: 'Product',
        recommendedRole: 'Design Systems Lead',
        recommendedTeam: 'Platform',
        matchScore: 86,
        reasoning: 'Priya\'s frustration may be tied to rapidly shifting product requirements. Her systematic approach and component thinking would thrive in a design systems role with more stability and technical depth.',
        skillOverlap: [
            { skill: 'Component Design', current: 95, required: 90 },
            { skill: 'Design Tokens', current: 80, required: 85 },
            { skill: 'Developer Collaboration', current: 85, required: 90 },
            { skill: 'Documentation', current: 90, required: 85 },
            { skill: 'Accessibility', current: 75, required: 80 },
        ],
        growthOpportunities: ['Would own the design system end-to-end', 'More stable scope aligns with her working style', 'High visibility across all product teams'],
        risks: ['Product team loses their most experienced designer', 'Design systems requires more technical fluency with code'],
        impactOnCurrentTeam: 'High — requires hiring a senior replacement. Recommend staggered transition.',
        timeline: 'Exploratory conversation Q1, potential move Q2',
    },
]

// ─── 50. Workforce Capability Mapping ────────────────────────────────────────

export interface CapabilityMap {
    teamName: string
    headcount: number
    capabilities: TeamCapability[]
    futureNeeds: FutureNeed[]
    skillGaps: SkillGap[]
    hireRecommendations: HireRecommendation[]
}

export interface TeamCapability {
    skill: string
    category: 'core' | 'emerging' | 'declining'
    currentCoverage: number   // how many people have this skill
    proficiencyAvg: number    // 0-100
    criticalityScore: number  // how important is this skill, 0-100
    trend: 'growing' | 'stable' | 'shrinking'
}

export interface FutureNeed {
    skill: string
    demandTimeline: string
    currentGap: number  // percentage gap
    urgency: 'critical' | 'high' | 'medium'
    source: string
}

export interface SkillGap {
    skill: string
    needed: number
    current: number
    gap: number
    strategy: 'hire' | 'train' | 'contract'
}

export interface HireRecommendation {
    role: string
    priority: 'critical' | 'high' | 'medium'
    justification: string
    skills: string[]
    timeline: string
}

export const CAPABILITY_CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
    core: { label: 'Core', color: 'text-emerald-400 bg-emerald-500/15' },
    emerging: { label: 'Emerging', color: 'text-violet-400 bg-violet-500/15' },
    declining: { label: 'Declining', color: 'text-red-400 bg-red-500/15' },
}

export const DEMO_CAPABILITY_MAP: CapabilityMap = {
    teamName: 'Platform Engineering',
    headcount: 14,
    capabilities: [
        { skill: 'React / Next.js', category: 'core', currentCoverage: 10, proficiencyAvg: 82, criticalityScore: 95, trend: 'stable' },
        { skill: 'TypeScript', category: 'core', currentCoverage: 12, proficiencyAvg: 78, criticalityScore: 90, trend: 'growing' },
        { skill: 'Node.js / Express', category: 'core', currentCoverage: 8, proficiencyAvg: 75, criticalityScore: 80, trend: 'stable' },
        { skill: 'GraphQL', category: 'core', currentCoverage: 5, proficiencyAvg: 68, criticalityScore: 70, trend: 'growing' },
        { skill: 'AI / ML Integration', category: 'emerging', currentCoverage: 2, proficiencyAvg: 45, criticalityScore: 85, trend: 'growing' },
        { skill: 'Edge Computing', category: 'emerging', currentCoverage: 1, proficiencyAvg: 35, criticalityScore: 60, trend: 'growing' },
        { skill: 'WebAssembly', category: 'emerging', currentCoverage: 1, proficiencyAvg: 30, criticalityScore: 40, trend: 'stable' },
        { skill: 'jQuery / Legacy', category: 'declining', currentCoverage: 4, proficiencyAvg: 85, criticalityScore: 15, trend: 'shrinking' },
    ],
    futureNeeds: [
        { skill: 'AI / ML Integration', demandTimeline: 'Next 6 months', currentGap: 65, urgency: 'critical', source: 'Product roadmap: AI-powered features in Q2' },
        { skill: 'Edge Computing', demandTimeline: 'Next 12 months', currentGap: 50, urgency: 'high', source: 'Performance goals: sub-100ms global latency' },
        { skill: 'Observability / SRE', demandTimeline: 'Next 3 months', currentGap: 40, urgency: 'critical', source: 'Scaling from 10K → 100K users' },
    ],
    skillGaps: [
        { skill: 'AI / ML Integration', needed: 5, current: 2, gap: 3, strategy: 'hire' },
        { skill: 'Observability / SRE', needed: 3, current: 1, gap: 2, strategy: 'hire' },
        { skill: 'Edge Computing', needed: 3, current: 1, gap: 2, strategy: 'train' },
        { skill: 'GraphQL', needed: 8, current: 5, gap: 3, strategy: 'train' },
    ],
    hireRecommendations: [
        { role: 'ML Engineer (Frontend AI)', priority: 'critical', justification: 'AI features on Q2 roadmap with zero dedicated ML capacity on Platform team', skills: ['TensorFlow.js', 'LLM Integration', 'React', 'Python'], timeline: 'Hire by end of Q1' },
        { role: 'Site Reliability Engineer', priority: 'critical', justification: 'Scaling 10x requires dedicated SRE — currently relying on part-time infra eng', skills: ['Kubernetes', 'Prometheus', 'Terraform', 'Incident Management'], timeline: 'Hire by end of Q1' },
        { role: 'Senior Frontend Engineer (Edge)', priority: 'high', justification: 'Edge deployment initiative needs specialist — only 1 person with basic knowledge', skills: ['Cloudflare Workers', 'Deno', 'WebAssembly', 'CDN Architecture'], timeline: 'Hire in Q2' },
    ],
}
