// ─── Analysis Suite — Types & Demo Data ──────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// 22. DECISION-MAKING TRACE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface DecisionStep {
    id: string
    step: string
    description: string
    quality: 'excellent' | 'good' | 'adequate' | 'poor'
    reasoning: string
}

export interface DecisionTrace {
    candidateName: string
    taskTitle: string
    overallScore: number
    steps: DecisionStep[]
    strengths: string[]
    weaknesses: string[]
    framingQuality: number
    tradeoffArticulation: number
    problemDecomposition: number
}

export const DECISION_QUALITY_CONFIG: Record<string, { label: string; color: string }> = {
    excellent: { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/15' },
    good: { label: 'Good', color: 'text-blue-400 bg-blue-500/15' },
    adequate: { label: 'Adequate', color: 'text-amber-400 bg-amber-500/15' },
    poor: { label: 'Poor', color: 'text-red-400 bg-red-500/15' },
}

export const DEMO_DECISION_TRACE: DecisionTrace = {
    candidateName: 'Alex Rivera',
    taskTitle: 'System Design: Feature Flag Platform',
    overallScore: 82,
    framingQuality: 90,
    tradeoffArticulation: 85,
    problemDecomposition: 78,
    steps: [
        {
            id: 'ds-1', step: 'Problem Framing',
            description: 'Started by clarifying requirements: "How many services? What\'s the latency budget? Do we need targeting?"',
            quality: 'excellent',
            reasoning: 'Asked 4 clarifying questions before proposing anything — shows discipline and stakeholder awareness.',
        },
        {
            id: 'ds-2', step: 'Constraint Identification',
            description: 'Identified <5ms evaluation as the driving constraint. "This means we need client-side evaluation with server-side distribution."',
            quality: 'excellent',
            reasoning: 'Correctly identified the key architectural decision from the constraints. Rare at this level.',
        },
        {
            id: 'ds-3', step: 'Architecture Proposal',
            description: 'Proposed 3-tier architecture: flag management API → distribution service → client SDK with local cache.',
            quality: 'good',
            reasoning: 'Sound architecture. Could have explored event-sourcing for the flag store, but the proposed design works.',
        },
        {
            id: 'ds-4', step: 'Trade-off Discussion',
            description: 'Compared push (SSE) vs pull (polling) for flag distribution. Chose push with polling fallback.',
            quality: 'excellent',
            reasoning: 'Excellent trade-off analysis. Mentioned bandwidth, latency, and failure mode implications of each approach.',
        },
        {
            id: 'ds-5', step: 'Edge Case Handling',
            description: 'Addressed: "What if the flag service is down?" — SDK falls back to last-known-good cached values.',
            quality: 'good',
            reasoning: 'Good failure mode thinking. Missed: what happens if the SDK has never connected? (Cold start problem)',
        },
        {
            id: 'ds-6', step: 'Scale Estimation',
            description: 'Back-of-envelope: "100k evaluations/sec × 5ms = 500 core-seconds. Client-side means zero server load."',
            quality: 'adequate',
            reasoning: 'Correct directionally but the math was rough. Should have considered SDK memory footprint at scale.',
        },
    ],
    strengths: [
        'Strong problem framing — doesn\'t jump to solutions',
        'Excellent trade-off articulation with real reasoning',
        'Good failure mode awareness',
        'Clear communication throughout',
    ],
    weaknesses: [
        'Could improve back-of-envelope estimation rigour',
        'Missed cold-start problem for SDK',
        'Didn\'t discuss monitoring or observability',
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 23. COMMUNICATION QUALITY SCORING
// ═══════════════════════════════════════════════════════════════════════════════

export interface CommunicationDimension {
    dimension: string
    score: number
    maxScore: number
    examples: string[]
    icon: string
}

export interface CommunicationScore {
    candidateName: string
    overallScore: number
    dimensions: CommunicationDimension[]
    topStrengths: string[]
    areasForImprovement: string[]
    sampleQuotes: { quote: string; context: string; rating: 'strong' | 'adequate' | 'weak' }[]
}

export const DEMO_COMMUNICATION_SCORE: CommunicationScore = {
    candidateName: 'Alex Rivera',
    overallScore: 78,
    dimensions: [
        {
            dimension: 'Clarity', score: 85, maxScore: 100, icon: '💎',
            examples: ['Used concrete examples to explain abstract concepts', 'Avoided jargon when unnecessary', 'Structured answers with clear sections'],
        },
        {
            dimension: 'Structure', score: 80, maxScore: 100, icon: '🏗️',
            examples: ['Led with summary before diving into details', 'Used numbered lists for multi-part answers', 'Signposted transitions between topics'],
        },
        {
            dimension: 'Conciseness', score: 65, maxScore: 100, icon: '✂️',
            examples: ['Some answers were 2x longer than needed', 'Occasionally repeated points', 'Could tighten technical explanations'],
        },
        {
            dimension: 'Adaptability', score: 82, maxScore: 100, icon: '🔄',
            examples: ['Adjusted depth when interviewer asked for more detail', 'Simplified explanation for non-technical question', 'Read the room and pivoted approach'],
        },
        {
            dimension: 'Active Listening', score: 78, maxScore: 100, icon: '👂',
            examples: ['Referenced interviewer\'s earlier point', 'Asked for clarification before answering', 'Acknowledged constraints mentioned by interviewer'],
        },
    ],
    topStrengths: [
        'Excellent at using analogies to explain complex concepts',
        'Strong structured thinking — leads with framework, then fills in details',
        'Good at reading social cues and adjusting depth',
    ],
    areasForImprovement: [
        'Tends to over-explain when nervous — could be more concise',
        'Sometimes answers a slightly different question than what was asked',
        'Could improve at explicitly stating assumptions before diving in',
    ],
    sampleQuotes: [
        { quote: 'Think of the flag evaluation like a decision tree cached on the client. Each leaf is a variant, and the branches are targeting rules.', context: 'Explaining feature flag evaluation', rating: 'strong' },
        { quote: 'I would use... well, it depends on the scale. Let me think about this... So basically, we need to consider the tradeoffs between push and pull...', context: 'Answering distribution question', rating: 'adequate' },
        { quote: 'The system handles 100k evals per second. Actually, let me recalculate that. So if each eval is 5ms... actually it\'s client-side so server load is zero.', context: 'Back-of-envelope estimation', rating: 'weak' },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 24. WORK QUALITY BENCHMARKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface BenchmarkMetric {
    metric: string
    candidateScore: number
    p25: number
    p50: number
    p75: number
    p90: number
    unit: string
    interpretation: string
}

export interface WorkBenchmark {
    candidateName: string
    taskTitle: string
    overallPercentile: number
    metrics: BenchmarkMetric[]
    comparisons: { name: string; score: number; hired: boolean }[]
    recommendation: 'strong-hire' | 'hire' | 'borderline' | 'no-hire'
}

export const RECOMMENDATION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    'strong-hire': { label: 'Strong Hire', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: '🟢' },
    'hire': { label: 'Hire', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', icon: '🔵' },
    'borderline': { label: 'Borderline', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '🟡' },
    'no-hire': { label: 'No Hire', color: 'text-red-400 bg-red-500/15 border-red-500/30', icon: '🔴' },
}

export const DEMO_BENCHMARK: WorkBenchmark = {
    candidateName: 'Alex Rivera',
    taskTitle: 'React Frontend Challenge',
    overallPercentile: 82,
    recommendation: 'hire',
    metrics: [
        {
            metric: 'Code Quality',
            candidateScore: 88, p25: 45, p50: 62, p75: 78, p90: 92, unit: '/100',
            interpretation: 'Above P75 — clean, typed, well-structured code with consistent patterns.',
        },
        {
            metric: 'Test Coverage',
            candidateScore: 72, p25: 15, p50: 40, p75: 65, p90: 85, unit: '%',
            interpretation: 'Above P75 — meaningful tests, not just coverage farming.',
        },
        {
            metric: 'Completion Rate',
            candidateScore: 85, p25: 50, p50: 70, p75: 85, p90: 95, unit: '%',
            interpretation: 'At P75 — completed core requirements plus one bonus.',
        },
        {
            metric: 'Time to First Commit',
            candidateScore: 22, p25: 45, p50: 30, p75: 18, p90: 10, unit: 'min',
            interpretation: 'At P75 — read codebase for 15 min before first meaningful commit. Good signal.',
        },
        {
            metric: 'Error Handling',
            candidateScore: 80, p25: 20, p50: 45, p75: 70, p90: 88, unit: '/100',
            interpretation: 'Above P75 — handles connection drops, malformed data, and edge cases.',
        },
        {
            metric: 'Documentation',
            candidateScore: 90, p25: 10, p50: 30, p75: 60, p90: 85, unit: '/100',
            interpretation: 'Above P90 — excellent DECISIONS.md with clear rationale for each choice.',
        },
    ],
    comparisons: [
        { name: 'Alex Rivera', score: 82, hired: false },
        { name: 'Previous Hire #1', score: 78, hired: true },
        { name: 'Previous Hire #2', score: 85, hired: true },
        { name: 'Previous Hire #3', score: 72, hired: true },
        { name: 'Previous Reject #1', score: 55, hired: false },
        { name: 'Previous Reject #2', score: 48, hired: false },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 25. CHEATING & AI-USE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface CheatSignal {
    id: string
    signalType: 'timing' | 'pattern' | 'consistency' | 'external' | 'style'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    evidence: string
    confidence: number
    recommendation: string
}

export const SIGNAL_SEVERITY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    low: { label: 'Low', color: 'text-zinc-400 bg-zinc-500/15 border-zinc-500/30', icon: '○' },
    medium: { label: 'Medium', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '◐' },
    high: { label: 'High', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30', icon: '●' },
    critical: { label: 'Critical', color: 'text-red-400 bg-red-500/15 border-red-500/30', icon: '◉' },
}

export interface CheatDetectionReport {
    candidateName: string
    taskTitle: string
    overallRisk: 'clean' | 'suspicious' | 'likely-ai' | 'confirmed'
    overallConfidence: number
    signals: CheatSignal[]
    aiUsageProbability: number
    summary: string
}

export const RISK_CONFIG: Record<string, { label: string; color: string }> = {
    clean: { label: 'Clean', color: 'text-emerald-400 bg-emerald-500/15' },
    suspicious: { label: 'Suspicious', color: 'text-amber-400 bg-amber-500/15' },
    'likely-ai': { label: 'Likely AI-Assisted', color: 'text-orange-400 bg-orange-500/15' },
    confirmed: { label: 'Confirmed AI/Cheat', color: 'text-red-400 bg-red-500/15' },
}

export const DEMO_CHEAT_REPORT: CheatDetectionReport = {
    candidateName: 'Jordan Lee',
    taskTitle: 'React Frontend Challenge',
    overallRisk: 'suspicious',
    overallConfidence: 68,
    aiUsageProbability: 45,
    summary: 'Multiple signals suggest potential AI assistance, but no definitive proof. The candidate\'s coding style is internally consistent but shows unusual patterns in timing and error-free output.',
    signals: [
        {
            id: 'cs-1', signalType: 'timing', severity: 'medium',
            description: 'Unusually consistent typing speed',
            evidence: 'Typing speed maintained at exactly 85 WPM for 45 minutes with zero pauses. Human developers typically show 30-50% variation.',
            confidence: 65,
            recommendation: 'Flag for follow-up in live interview. Ask candidate to explain their approach step-by-step.',
        },
        {
            id: 'cs-2', signalType: 'pattern', severity: 'high',
            description: 'Code produced in large, complete blocks',
            evidence: '3 functions (avg 40 lines each) were written in single, uninterrupted sessions with zero edits. Typical engineers write 5-10 lines, test, iterate.',
            confidence: 72,
            recommendation: 'Request live coding follow-up for similar problem to compare approach pattern.',
        },
        {
            id: 'cs-3', signalType: 'consistency', severity: 'low',
            description: 'Consistent code style throughout',
            evidence: 'Variable naming, spacing, and patterns are remarkably consistent — more than typical for a 3-hour session.',
            confidence: 40,
            recommendation: 'Minor signal. May indicate strong discipline or AI formatting.',
        },
        {
            id: 'cs-4', signalType: 'style', severity: 'medium',
            description: 'Comments explain "what" not "why"',
            evidence: '80% of comments are descriptive ("// fetch user data") rather than explanatory ("// using stale-while-revalidate because..."). AI-generated code tends to over-comment the obvious.',
            confidence: 58,
            recommendation: 'Ask candidate to explain the reasoning behind their architecture choices.',
        },
        {
            id: 'cs-5', signalType: 'external', severity: 'low',
            description: 'Tab-switching detected',
            evidence: 'Candidate switched away from the IDE 12 times during the session. Average for this cohort is 8 times. Within normal range but on the high side.',
            confidence: 30,
            recommendation: 'Not actionable alone. Cross-reference with other signals.',
        },
    ],
}
