
// ─── Work Simulation — Types & Demo Data ────────────────────────────────────
// "Deep Sandbox" Engine Schema

export type RoleDNA = {
    id: string
    title: string
    level: string
    coreTasks: { id: string; title: string; description: string; icon: string }[]
    failureModes: { id: string; title: string; riskLevel: 'high' | 'critical'; description: string }[]
    decisionPoints: { id: string; title: string; tension: string }[]
    requiredThinking: { trait: string; description: string; value: number }[] // value 0-100
    goodProfile: string
    badProfile: string
}

export type AdaptiveNode = {
    id: string
    type: 'baseline' | 'stretch' | 'chaos'
    title: string
    description: string
    triggerCondition: string // e.g. "Candidate cruises -> inject harder follow-ups"
    assets: { type: 'code' | 'logs' | 'email' | 'design'; title: string; content: string }[]
    constraints: string[]
}

export type SignalProbe = {
    id: string
    category: 'framing' | 'decision-making' | 'iteration' | 'communication' | 'taste'
    signal: string
    positiveIndicator: string
    negativeIndicator: string
    weight: number // 1-10
}

export type BlackBoxProbe = {
    id: string
    trigger: string // e.g. "After implementation"
    question: string
    intent: string // "Test whether candidate understands their own work"
}

export type HiringBrief = {
    candidateName: string
    role: string
    recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'mixed'
    confidence: number // 0-100
    riskProfile: { area: string; risk: 'low' | 'medium' | 'high'; description: string }[]
    environmentFit: { type: 'startup' | 'enterprise' | 'scale-up'; fit: 'high' | 'medium' | 'low'; reason: string }[]
    capabilities: { skill: string; score: number; evidence: string }[]
}

export type SimulationScenario = {
    id: string
    roleDna: RoleDNA
    adaptiveFlow: AdaptiveNode[]
    instrumentation: {
        signals: SignalProbe[]
        probes: BlackBoxProbe[]
    }
    demoBrief: HiringBrief
}

// ─── DEMO DATA: Senior Backend Engineer ──────────────────────────────────────

export const DEMO_LATENCY_SCENARIO: SimulationScenario = {
    id: 'sim-backend-latency',
    roleDna: {
        id: 'role-be-senior',
        title: 'Senior Backend Engineer',
        level: 'L5',
        coreTasks: [
            { id: 'ct-1', title: 'System Diagnosis', description: 'Root causing production incidents under pressure', icon: '🔍' },
            { id: 'ct-2', title: 'Performance Optimization', description: 'Improving throughput/latency constraints', icon: '⚡' },
            { id: 'ct-3', title: 'Code Refactoring', description: 'Reducing tech debt without regression', icon: '🛠️' },
        ],
        failureModes: [
            { id: 'fm-1', title: 'Tunnel Vision', riskLevel: 'critical', description: 'Fixes symptom but misses systemic cause' },
            { id: 'fm-2', title: 'Over-Engineering', riskLevel: 'high', description: 'Implements complex caching before simple db indexing' },
            { id: 'fm-3', title: 'Poor Communication', riskLevel: 'high', description: 'Fails to communicate impact/risks to stakeholders' },
        ],
        decisionPoints: [
            { id: 'dp-1', title: 'Speed vs Correctness', tension: 'Production fire vs Long-term fix' },
            { id: 'dp-2', title: 'Complexity vs Maintainability', tension: 'Clever optimization vs Readable code' },
        ],
        requiredThinking: [
            { trait: 'Pragmatism', description: 'Bias for simple, working solutions', value: 85 },
            { trait: 'Systems Thinking', description: 'Understanding ripple effects', value: 90 },
            { trait: 'Speed', description: 'Time to mitigation', value: 70 },
        ],
        goodProfile: 'Methodical debugger who isolates variables. Communicates trade-offs. Starts with simplest fix.',
        badProfile: 'Jumps to "rewrite it". Blames "legacy code". Optimizes prematurely. Silent during crisis.',
    },
    adaptiveFlow: [
        {
            id: 'node-baseline',
            type: 'baseline',
            title: 'The Incident',
            description: 'You\'re joining a product where latency spikes during peak usage. Here\'s a simplified service with logs. Investigate the bottleneck.',
            triggerCondition: 'Start',
            assets: [
                {
                    type: 'logs', title: 'access.log', content: `[2024-02-18 14:02:01] GET /api/v1/feed 200 120ms
[2024-02-18 14:02:05] GET /api/v1/feed 200 4500ms (TIMEOUT WARNING)
[2024-02-18 14:02:06] GET /api/v1/feed 504 5001ms
[ERROR] Connection pool exhausted. Active connections: 50/50.`
                },
                {
                    type: 'code', title: 'FeedService.ts', content: `async function getFeed(userId) {
  // N+1 query issue common in "bad hire" patterns
  const posts = await db.posts.find({ userId }).limit(20);
  const enriched = await Promise.all(posts.map(async (p) => {
    const user = await db.users.findById(p.authorId); // ⚠️ The bottleneck
    const comments = await db.comments.find({ postId: p.id }).limit(3);
    return { ...p, author: user, comments };
  }));
  return enriched;
}`
                }
            ],
            constraints: ['Cannot change database schema', 'Must deploy fix in <30 mins']
        },
        {
            id: 'node-stretch',
            type: 'stretch',
            title: 'The Scale-Up',
            description: 'Traffic just doubled. Your previous fix (batching) is holding, but memory usage is spiking. Re-architect for 10x scale.',
            triggerCondition: 'Candidate solves baseline > 7/10',
            assets: [
                { type: 'email', title: 'CTO Update', content: 'Great job stabilizing. Marketing is launching a campaign in 2 hours. Expect 10x load. Current implementation won\'t handle the concurrent connections. Architecture proposal needed.' }
            ],
            constraints: ['Keep latency < 200ms p99', 'Cache invalidation must be handled']
        },
        {
            id: 'node-chaos',
            type: 'chaos',
            title: 'The Outage',
            description: 'The cache layer (Redis) just failed. Your service is falling back to DB and originally slow queries are returning. Mitigation?',
            triggerCondition: 'Candidate proposes Caching strategy',
            assets: [
                { type: 'logs', title: 'system.log', content: 'ConnectionRefused: Redis at 10.0.0.5:6379. Fallback strategy initiated.' }
            ],
            constraints: ['System must degrade gracefully', 'No data loss allowed']
        }
    ],
    instrumentation: {
        signals: [
            {
                id: 'sig-1', category: 'framing', signal: 'Clarifies Requirements', weight: 9,
                positiveIndicator: 'Asks about traffic patterns / read-write ratio', negativeIndicator: 'Immediately starts writing code'
            },
            {
                id: 'sig-2', category: 'decision-making', signal: 'N+1 Detection', weight: 10,
                positiveIndicator: 'Identifies N+1 immediately', negativeIndicator: 'Optimizes loop without fixing query pattern'
            },
            {
                id: 'sig-3', category: 'iteration', signal: 'Verification', weight: 8,
                positiveIndicator: 'Writes a test case reproducing the timeout', negativeIndicator: 'Deploys without verifying locally'
            },
            {
                id: 'sig-4', category: 'communication', signal: 'Trade-off Narration', weight: 7,
                positiveIndicator: 'Explains "This is a quick fix, not long term"', negativeIndicator: 'Silent execution'
            }
        ],
        probes: [
            { id: 'bb-1', trigger: 'After Fix', question: 'Why did you choose to batch queries instead of caching?', intent: 'Test depth of understanding vs pattern matching' },
            { id: 'bb-2', trigger: 'Stretch', question: 'What breaks first if we get 100k concurrent users?', intent: 'Test system limits awareness' },
        ]
    },
    demoBrief: {
        candidateName: 'Alex Rivero',
        role: 'Senior Backend Engineer',
        recommendation: 'strong_hire',
        confidence: 88,
        riskProfile: [
            { area: 'Complexity Bias', risk: 'low', description: 'Chose simple batching over complex caching layer initially.' },
            { area: 'Testing Discipline', risk: 'medium', description: 'Did not write unit tests for the fix, relied on manual verification.' }
        ],
        environmentFit: [
            { type: 'startup', fit: 'high', reason: 'Bias for action, pragmatism under pressure.' },
            { type: 'enterprise', fit: 'medium', reason: 'Might struggle with rigid "process-first" environments.' }
        ],
        capabilities: [
            { skill: 'System Debugging', score: 92, evidence: 'Identified connection pool exhaustion immediately.' },
            { skill: 'Database Performance', score: 85, evidence: 'Optimized N+1 query to single batch query.' },
            { skill: 'Communication', score: 78, evidence: 'Clear commit messages, but minimal verbal narration.' }
        ]
    }
}
