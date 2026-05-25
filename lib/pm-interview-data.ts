// ─── Interview & Evaluation Generation — Types & Demo Data ──────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// 7. STRUCTURED INTERVIEW PLAN
// ═══════════════════════════════════════════════════════════════════════════════

export interface InterviewSection {
    id: string
    title: string
    duration: string
    durationMinutes: number
    objectives: string[]
    probes: string[]
    followUps: string[]
    type: 'intro' | 'technical' | 'behavioural' | 'system-design' | 'culture' | 'closing'
    interviewer?: string
    notes?: string
}

export interface InterviewPlan {
    roleTitle: string
    totalDuration: string
    totalRounds: number
    sections: InterviewSection[]
}

export const DEMO_INTERVIEW_PLAN: InterviewPlan = {
    roleTitle: 'Senior React Engineer',
    totalDuration: '4h 30m across 4 rounds',
    totalRounds: 4,
    sections: [
        {
            id: 'sec-1',
            title: 'Warm-up & Culture Alignment',
            duration: '25 min',
            durationMinutes: 25,
            type: 'intro',
            objectives: ['Assess culture fit', 'Gauge motivation and career goals', 'Evaluate communication style'],
            probes: [
                'Walk me through a project where you had to make a difficult technical compromise. What drove the decision?',
                'How do you decide when to refactor vs ship?',
                'Describe a time you disagreed with a technical lead. How did you handle it?',
            ],
            followUps: [
                'What would you do differently if you had more time?',
                'How did the team react to your decision?',
                'What metrics did you use to validate the compromise?',
            ],
            interviewer: 'Engineering Manager',
            notes: 'Focus on self-awareness and growth mindset. Watch for blame-shifting.',
        },
        {
            id: 'sec-2',
            title: 'React & Frontend Deep-Dive',
            duration: '60 min',
            durationMinutes: 60,
            type: 'technical',
            objectives: ['Validate React architecture expertise', 'Assess state management depth', 'Test performance optimisation knowledge'],
            probes: [
                'Design a real-time collaborative editor component. Walk me through your state management approach.',
                'Explain your mental model for React\'s reconciliation algorithm. When does it break down?',
                'How would you architect a micro-frontend system for a team of 8 frontend engineers?',
            ],
            followUps: [
                'What happens when two users edit the same paragraph simultaneously?',
                'How would you handle 10,000 re-renders per second in a data dashboard?',
                'Walk me through your testing strategy for this architecture.',
            ],
            interviewer: 'Staff Engineer',
        },
        {
            id: 'sec-3',
            title: 'System Design Challenge',
            duration: '45 min',
            durationMinutes: 45,
            type: 'system-design',
            objectives: ['Evaluate system-level thinking', 'Assess scalability awareness', 'Test tradeoff articulation'],
            probes: [
                'Design the frontend architecture for a Figma-like design tool that supports real-time collaboration.',
                'How would you build a performant search experience across 10M documents?',
            ],
            followUps: [
                'What\'s your caching strategy at the CDN vs application layer?',
                'How do you handle offline mode and conflict resolution?',
                'Walk me through the data flow from user input to render.',
            ],
            interviewer: 'Principal Engineer',
        },
        {
            id: 'sec-4',
            title: 'Behavioural & Leadership',
            duration: '30 min',
            durationMinutes: 30,
            type: 'behavioural',
            objectives: ['Assess mentorship capability', 'Evaluate cross-team collaboration', 'Test conflict resolution skills'],
            probes: [
                'Tell me about a time you mentored a junior engineer through a complex feature.',
                'How do you handle scope creep when you\'re the tech lead on a project?',
                'Describe a situation where you had to push back on a product requirement.',
            ],
            followUps: [
                'What was the measurable outcome of your mentoring?',
                'How did you communicate the scope change to stakeholders?',
                'Did you ever have to escalate? How did you decide when?',
            ],
            interviewer: 'VP of Engineering',
        },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. COMPETENCY-BASED QUESTION BANK
// ═══════════════════════════════════════════════════════════════════════════════

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface CompetencyQuestion {
    id: string
    competency: string
    category: 'technical' | 'domain' | 'soft' | 'leadership'
    difficulty: QuestionDifficulty
    question: string
    expectedSignals: string[]
    redFlags: string[]
    timeAllocation: string
}

export const DIFFICULTY_CONFIG: Record<QuestionDifficulty, { label: string; color: string; icon: string }> = {
    easy: { label: 'Easy', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: '🟢' },
    medium: { label: 'Medium', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: '🟡' },
    hard: { label: 'Hard', color: 'text-red-400 bg-red-500/15 border-red-500/30', icon: '🔴' },
}

export const DEMO_QUESTION_BANK: CompetencyQuestion[] = [
    {
        id: 'q-1', competency: 'React / Next.js', category: 'technical', difficulty: 'easy',
        question: 'Explain the difference between server components and client components in Next.js 14. When would you use each?',
        expectedSignals: ['Understands RSC mental model', 'Can articulate serialisation boundary', 'Mentions bundle size impact'],
        redFlags: ['Confuses with SSR/SSG', 'Can\'t explain "use client" directive'],
        timeAllocation: '5 min',
    },
    {
        id: 'q-2', competency: 'React / Next.js', category: 'technical', difficulty: 'medium',
        question: 'Walk me through how you\'d implement optimistic updates in a React app using Server Actions. Handle the error rollback case.',
        expectedSignals: ['Uses useOptimistic or similar pattern', 'Handles error boundaries', 'Consider race conditions'],
        redFlags: ['No error handling', 'Blocks UI during mutation'],
        timeAllocation: '10 min',
    },
    {
        id: 'q-3', competency: 'React / Next.js', category: 'technical', difficulty: 'hard',
        question: 'Design a streaming SSR system for a dashboard with mixed static and dynamic data. How do you handle suspense boundaries, error recovery, and cache invalidation?',
        expectedSignals: ['Deep suspense understanding', 'Streaming architecture', 'Cache hierarchy design', 'Graceful degradation'],
        redFlags: ['No mention of streaming', 'Single loading state for entire page'],
        timeAllocation: '20 min',
    },
    {
        id: 'q-4', competency: 'State Management', category: 'technical', difficulty: 'easy',
        question: 'What\'s the difference between useState, useReducer, and an external store like Zustand? When do you reach for each?',
        expectedSignals: ['Understands local vs global state', 'Knows re-render implications', 'Mentions selector patterns'],
        redFlags: ['Always uses Redux for everything', 'Can\'t explain re-render triggers'],
        timeAllocation: '5 min',
    },
    {
        id: 'q-5', competency: 'State Management', category: 'technical', difficulty: 'hard',
        question: 'You have a real-time collaborative whiteboard. Design the state synchronisation layer — how do you handle concurrent edits, undo/redo, and offline support?',
        expectedSignals: ['Mentions CRDTs or OT', 'Conflict resolution strategy', 'Undo stack per-user', 'Offline queue with reconciliation'],
        redFlags: ['Last-write-wins only', 'No offline consideration', 'Ignores concurrent edits'],
        timeAllocation: '20 min',
    },
    {
        id: 'q-6', competency: 'Testing', category: 'technical', difficulty: 'medium',
        question: 'How do you decide what to test with unit tests vs integration tests vs E2E tests in a React application? Walk me through your testing strategy for a checkout flow.',
        expectedSignals: ['Testing pyramid understanding', 'Knows MSW for API mocking', 'Tests user behaviour not implementation'],
        redFlags: ['Only snapshot tests', 'Tests implementation details', 'No E2E consideration'],
        timeAllocation: '10 min',
    },
    {
        id: 'q-7', competency: 'API Design', category: 'domain', difficulty: 'medium',
        question: 'Design a REST API for a multi-tenant SaaS application. How do you handle tenant isolation, rate limiting, and versioning?',
        expectedSignals: ['Tenant context via headers/subdomain', 'Rate limiting strategy', 'API versioning approach'],
        redFlags: ['No tenant isolation', 'Ignores rate limiting', 'Breaking changes without versioning'],
        timeAllocation: '15 min',
    },
    {
        id: 'q-8', competency: 'Communication', category: 'soft', difficulty: 'medium',
        question: 'You need to convince your team to adopt a new state management library that requires rewriting several components. How do you build the case?',
        expectedSignals: ['Data-driven arguments', 'Acknowledges migration cost', 'Proposes incremental adoption', 'Seeks team consensus'],
        redFlags: ['Forces opinion', 'No migration plan', 'Ignores team concerns'],
        timeAllocation: '8 min',
    },
    {
        id: 'q-9', competency: 'Mentorship', category: 'leadership', difficulty: 'medium',
        question: 'A junior engineer on your team keeps shipping code with poor error handling. How do you address this without demotivating them?',
        expectedSignals: ['Empathetic approach', 'Concrete examples', 'Creates learning opportunity', 'Sets up guardrails (linting, PR checklist)'],
        redFlags: ['Public criticism', 'Just fixes their code', 'No systemic solution'],
        timeAllocation: '8 min',
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 9. DYNAMIC FOLLOW-UP GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export type ResponseQuality = 'strong' | 'adequate' | 'weak'

export interface DynamicFollowUp {
    id: string
    baseQuestion: string
    responseQuality: ResponseQuality
    followUp: string
    purpose: string
    depth: number
}

export const RESPONSE_QUALITY_CONFIG: Record<ResponseQuality, { label: string; color: string; icon: string }> = {
    strong: { label: 'Strong', color: 'text-emerald-400 bg-emerald-500/15', icon: '✅' },
    adequate: { label: 'Adequate', color: 'text-amber-400 bg-amber-500/15', icon: '⚡' },
    weak: { label: 'Weak', color: 'text-red-400 bg-red-500/15', icon: '⚠️' },
}

export const DEMO_FOLLOW_UPS: DynamicFollowUp[] = [
    {
        id: 'fu-1', baseQuestion: 'Explain React reconciliation', responseQuality: 'strong', depth: 2,
        followUp: 'Great. Now, how would you optimise reconciliation for a virtualised list with 100k items where each row has nested state?',
        purpose: 'Push to edge cases — tests depth beyond textbook knowledge',
    },
    {
        id: 'fu-2', baseQuestion: 'Explain React reconciliation', responseQuality: 'adequate', depth: 2,
        followUp: 'You mentioned the diffing algorithm. Can you walk me through a specific scenario where React\'s heuristic fails and how you\'d work around it?',
        purpose: 'Probe granularity — separate memorised answers from real understanding',
    },
    {
        id: 'fu-3', baseQuestion: 'Explain React reconciliation', responseQuality: 'weak', depth: 2,
        followUp: 'Let\'s simplify. If you have a list of items and you add one to the middle, what does React do internally? Walk me through it step by step.',
        purpose: 'Scaffold understanding — give candidate a concrete foothold',
    },
    {
        id: 'fu-4', baseQuestion: 'Design collaborative editor state', responseQuality: 'strong', depth: 3,
        followUp: 'Excellent. Now add presence indicators (cursors, selections) for 50 concurrent users. How do you prevent the presence layer from overwhelming the document layer?',
        purpose: 'Scale test — separates architects from implementers',
    },
    {
        id: 'fu-5', baseQuestion: 'Design collaborative editor state', responseQuality: 'adequate', depth: 3,
        followUp: 'You mentioned using WebSockets. What happens when a user goes offline for 5 minutes and comes back? Walk me through the reconciliation.',
        purpose: 'Edge case — tests offline-first thinking',
    },
    {
        id: 'fu-6', baseQuestion: 'Design collaborative editor state', responseQuality: 'weak', depth: 3,
        followUp: 'Let\'s focus on a simpler case: two users editing different paragraphs simultaneously. How would you keep both clients in sync?',
        purpose: 'Reduce complexity — let candidate demonstrate basic distributed thinking',
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 10. ANTI-CHEAT QUESTION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuestionVariant {
    id: string
    originalId: string
    variantLabel: string
    question: string
    context: string
    isIsomorphic: boolean
    difficultyDelta: number
}

export const DEMO_VARIANTS: QuestionVariant[] = [
    {
        id: 'v-1a', originalId: 'q-3', variantLabel: 'Variant A — E-commerce',
        question: 'Design a streaming SSR system for a product catalog page with mixed static product info and dynamic pricing/availability. Handle suspense and cache.',
        context: 'E-commerce platform with 500k SKUs',
        isIsomorphic: true, difficultyDelta: 0,
    },
    {
        id: 'v-1b', originalId: 'q-3', variantLabel: 'Variant B — Analytics',
        question: 'Design a streaming SSR system for an analytics dashboard where charts load progressively. Some widgets need real-time data, others are cached daily.',
        context: 'SaaS analytics product with 10k DAU',
        isIsomorphic: true, difficultyDelta: 0,
    },
    {
        id: 'v-1c', originalId: 'q-3', variantLabel: 'Variant C — Social Feed',
        question: 'Design a streaming SSR system for a social media feed with mixed static posts and dynamic engagement counts. Handle infinite scroll and stale data.',
        context: 'Social platform with 1M+ posts',
        isIsomorphic: true, difficultyDelta: 1,
    },
    {
        id: 'v-2a', originalId: 'q-5', variantLabel: 'Variant A — Code Editor',
        question: 'Design the state sync layer for a collaborative code editor supporting 10 concurrent users. Handle simultaneous edits to the same function, syntax highlighting, and offline mode.',
        context: 'Cloud IDE similar to Replit',
        isIsomorphic: true, difficultyDelta: 0,
    },
    {
        id: 'v-2b', originalId: 'q-5', variantLabel: 'Variant B — Spreadsheet',
        question: 'Design the state sync layer for a collaborative spreadsheet. Handle formula dependencies, concurrent cell edits, and undo across users.',
        context: 'Google Sheets competitor',
        isIsomorphic: true, difficultyDelta: 0,
    },
    {
        id: 'v-2c', originalId: 'q-5', variantLabel: 'Variant C — Design Tool',
        question: 'Design the state sync layer for a collaborative design canvas. Handle concurrent object manipulation, layer ordering conflicts, and real-time cursor presence.',
        context: 'Figma-like design tool',
        isIsomorphic: true, difficultyDelta: -1,
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 16. INTERVIEWER GUIDANCE PACK
// ═══════════════════════════════════════════════════════════════════════════════

export interface InterviewerGuidance {
    id: string
    question: string
    expectedAnswer: string
    probingStrategy: string[]
    greenFlags: string[]
    redFlags: string[]
    scoringCriteria: { score: number; description: string }[]
    commonMistakes: string[]
}

export const DEMO_INTERVIEWER_GUIDANCE: InterviewerGuidance[] = [
    {
        id: 'ig-1',
        question: 'Explain React\'s reconciliation algorithm and when it breaks down',
        expectedAnswer: 'Should cover: virtual DOM diffing, O(n) heuristic, key-based reconciliation, fiber architecture. Advanced: concurrent mode scheduling, time-slicing, lane priorities.',
        probingStrategy: [
            'Start broad — let them explain at their comfort level',
            'If they mention "virtual DOM diffing" — push on the O(n) heuristic assumptions',
            'If they mention keys — ask about index keys specifically and their pitfalls',
            'If strong — ask about concurrent features and scheduler internals',
        ],
        greenFlags: ['Mentions fiber nodes', 'Discusses heuristic trade-offs', 'Knows when keys matter vs don\'t', 'Can explain priority lanes'],
        redFlags: ['Says "React compares entire trees"', 'Confuses virtual DOM with shadow DOM', 'Can\'t explain why keys help'],
        scoringCriteria: [
            { score: 1, description: 'Cannot explain basic concept' },
            { score: 2, description: 'Knows virtual DOM exists but vague on mechanism' },
            { score: 3, description: 'Solid understanding of diffing and keys' },
            { score: 4, description: 'Explains fiber architecture and scheduling' },
            { score: 5, description: 'Deep knowledge of concurrent mode, lanes, and edge cases' },
        ],
        commonMistakes: [
            'Confusing reconciliation with rendering',
            'Thinking React compares entire trees (it\'s O(n) by assumption)',
            'Not understanding that keys must be stable and unique',
        ],
    },
    {
        id: 'ig-2',
        question: 'Design a real-time collaborative editor state management approach',
        expectedAnswer: 'Should cover: CRDT or OT choice, operation-based vs state-based sync, conflict resolution strategy, presence layer, undo/redo stack design.',
        probingStrategy: [
            'Let them choose their approach — don\'t hint at CRDTs vs OT',
            'Ask about the specific data structure — is it a tree, a sequence, or a map?',
            'Push on concurrent edits to the same character/word',
            'Ask about latency tolerance and UX during sync delays',
        ],
        greenFlags: ['Mentions CRDTs or OT by name', 'Separates document state from presence state', 'Considers undo per-user', 'Addresses offline mode'],
        redFlags: ['Only last-write-wins', 'No conflict resolution', 'Ignores offline scenario', 'Single global undo stack'],
        scoringCriteria: [
            { score: 1, description: 'No awareness of collaboration challenges' },
            { score: 2, description: 'Understands the problem but no concrete solution' },
            { score: 3, description: 'Proposes a workable sync mechanism (e.g. WebSocket + merge)' },
            { score: 4, description: 'References CRDTs/OT, separates concerns well' },
            { score: 5, description: 'Production-grade design with presence, undo, offline, and perf considerations' },
        ],
        commonMistakes: [
            'Treating this as a simple WebSocket broadcast problem',
            'Not separating document operations from cursor/selection presence',
            'Designing undo/redo globally instead of per-user',
        ],
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 17. CANDIDATE INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CandidateInstruction {
    id: string
    section: string
    timeLimit: string
    briefing: string
    expectations: string[]
    doList: string[]
    dontList: string[]
    evaluationPreview: string
}

export const DEMO_CANDIDATE_INSTRUCTIONS: CandidateInstruction[] = [
    {
        id: 'ci-1',
        section: 'Technical Deep-Dive',
        timeLimit: '60 minutes',
        briefing: 'You will be asked 3-4 technical questions about React, state management, and frontend architecture. You may use a whiteboard or shared code editor to illustrate your answers.',
        expectations: [
            'Think out loud — we want to see your reasoning process',
            'Ask clarifying questions before diving into solutions',
            'It\'s okay to say "I don\'t know" — we value honesty over bluffing',
            'Consider edge cases and tradeoffs in your solutions',
        ],
        doList: [
            'Draw diagrams to illustrate architecture decisions',
            'Discuss tradeoffs explicitly — there are no "right" answers',
            'Reference real-world experience where relevant',
            'Ask about constraints (scale, timeline, team size)',
        ],
        dontList: [
            'Don\'t try to show off every technology you know',
            'Don\'t give textbook answers — we want your real thinking',
            'Don\'t rush — clarity matters more than speed',
            'Don\'t be afraid to change your approach mid-answer',
        ],
        evaluationPreview: 'We evaluate depth of understanding, architectural thinking, and ability to reason about tradeoffs — not memorised answers.',
    },
    {
        id: 'ci-2',
        section: 'System Design Challenge',
        timeLimit: '45 minutes',
        briefing: 'You will receive a system design prompt. Treat this as a collaborative discussion — the interviewer will guide scope and ask follow-ups.',
        expectations: [
            'Start by clarifying requirements and constraints',
            'Work top-down: high-level architecture → components → details',
            'Explicitly state assumptions and tradeoffs',
            'Consider scalability, reliability, and user experience',
        ],
        doList: [
            'Use the whiteboard heavily — diagrams are expected',
            'Define non-functional requirements upfront',
            'Estimate back-of-envelope numbers where relevant',
            'Discuss what you\'d do differently at different scales',
        ],
        dontList: [
            'Don\'t jump to database schemas immediately',
            'Don\'t over-engineer for scale you haven\'t been asked about',
            'Don\'t ignore the frontend/UX considerations',
            'Don\'t forget to discuss monitoring and failure modes',
        ],
        evaluationPreview: 'We evaluate system thinking, communication clarity, and ability to make pragmatic engineering decisions under constraints.',
    },
    {
        id: 'ci-3',
        section: 'Work Sample Task',
        timeLimit: '2 hours (async)',
        briefing: 'You will build a small feature in a provided codebase. Focus on code quality, testing, and decisions — not just making it work.',
        expectations: [
            'Read the existing code before writing any new code',
            'Follow existing patterns and conventions in the codebase',
            'Write at least 2-3 meaningful tests',
            'Include a brief DECISIONS.md explaining your choices',
        ],
        doList: [
            'Commit incrementally with meaningful messages',
            'Handle edge cases and errors gracefully',
            'Consider accessibility in UI components',
            'Document any assumptions in your DECISIONS.md',
        ],
        dontList: [
            'Don\'t rewrite the existing codebase',
            'Don\'t use AI code generators (we can detect this)',
            'Don\'t over-engineer — scope the solution appropriately',
            'Don\'t skip error handling to save time',
        ],
        evaluationPreview: 'We evaluate code quality, testing discipline, decision-making, and how well you adapt to an existing codebase — not speed.',
    },
]
