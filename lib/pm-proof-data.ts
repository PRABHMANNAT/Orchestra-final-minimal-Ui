// ─── Proof-Based Hiring — Types & Demo Data ─────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// 18. RESUME-TO-PROOF REPLACEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProofItem {
    id: string
    candidateName: string
    credential: string
    credentialType: 'employer' | 'degree' | 'certification' | 'title' | 'years'
    proofReplacement: string
    proofType: 'code' | 'design' | 'writing' | 'presentation' | 'project' | 'data'
    proofUrl?: string
    confidenceScore: number
    verdict: 'verified' | 'inflated' | 'unverifiable' | 'exceeds'
}

export const VERDICT_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    verified: { label: 'Verified', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: '✅' },
    inflated: { label: 'Inflated', color: 'text-red-400 bg-red-500/15 border-red-500/30', icon: '⚠️' },
    unverifiable: { label: 'Unverifiable', color: 'text-zinc-400 bg-zinc-500/15 border-zinc-500/30', icon: '❓' },
    exceeds: { label: 'Exceeds Claim', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', icon: '🌟' },
}

export const DEMO_PROOF_ITEMS: ProofItem[] = [
    {
        id: 'pi-1', candidateName: 'Alex Rivera',
        credential: '5 years at Google — Senior SWE', credentialType: 'employer',
        proofReplacement: 'Open-source Kubernetes controller with 2.3k stars, handles 10k pods in production at Shopify',
        proofType: 'code', confidenceScore: 95, verdict: 'verified',
    },
    {
        id: 'pi-2', candidateName: 'Alex Rivera',
        credential: 'Stanford CS Degree', credentialType: 'degree',
        proofReplacement: 'Published 3 papers on distributed systems at SIGMOD, 140+ citations',
        proofType: 'writing', confidenceScore: 98, verdict: 'exceeds',
    },
    {
        id: 'pi-3', candidateName: 'Jordan Lee',
        credential: '"Led team of 12 engineers"', credentialType: 'title',
        proofReplacement: 'LinkedIn shows IC role, no reports listed. Conference talk mentions "working with" not "leading" the team.',
        proofType: 'data', confidenceScore: 78, verdict: 'inflated',
    },
    {
        id: 'pi-4', candidateName: 'Jordan Lee',
        credential: 'AWS Solutions Architect Certification', credentialType: 'certification',
        proofReplacement: 'Deployed production infrastructure on AWS for 3 startups, documented in public blog posts with architecture diagrams',
        proofType: 'writing', confidenceScore: 92, verdict: 'verified',
    },
    {
        id: 'pi-5', candidateName: 'Sam Park',
        credential: '"8 years of React experience"', credentialType: 'years',
        proofReplacement: 'First React commit on GitHub dates to 2021. Prior work is all jQuery/Backbone based.',
        proofType: 'code', confidenceScore: 88, verdict: 'inflated',
    },
    {
        id: 'pi-6', candidateName: 'Sam Park',
        credential: '"Built fraud detection ML pipeline"', credentialType: 'title',
        proofReplacement: 'No public evidence found. Company is private, no former colleagues can confirm.',
        proofType: 'data', confidenceScore: 30, verdict: 'unverifiable',
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 19. SANDBOX ENVIRONMENT ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface SandboxConfig {
    id: string
    name: string
    description: string
    stack: string[]
    preLoadedDeps: string[]
    timeLimit: string
    resourceLimits: { cpu: string; memory: string; storage: string }
    features: string[]
    status: 'ready' | 'provisioning' | 'active' | 'expired'
    templateRepo?: string
}

export const SANDBOX_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    ready: { label: 'Ready', color: 'text-emerald-400 bg-emerald-500/15' },
    provisioning: { label: 'Provisioning', color: 'text-amber-400 bg-amber-500/15' },
    active: { label: 'Active', color: 'text-blue-400 bg-blue-500/15' },
    expired: { label: 'Expired', color: 'text-zinc-400 bg-zinc-500/15' },
}

export const DEMO_SANDBOXES: SandboxConfig[] = [
    {
        id: 'sb-1',
        name: 'React Frontend Challenge',
        description: 'Pre-configured Next.js project with design system, API mocks, and test suite. Candidate builds a feature in the existing codebase.',
        stack: ['Next.js 14', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Vitest'],
        preLoadedDeps: ['@tanstack/react-query', 'zod', 'date-fns', 'lucide-react'],
        timeLimit: '3 hours',
        resourceLimits: { cpu: '2 cores', memory: '4GB', storage: '10GB' },
        features: ['Live preview', 'Terminal access', 'Git integration', 'VS Code in browser', 'Auto-save every 30s'],
        status: 'ready',
        templateRepo: 'github/forge-sandbox-react',
    },
    {
        id: 'sb-2',
        name: 'Full-Stack API Challenge',
        description: 'Node.js API with PostgreSQL database, seed data, and Postman collection. Candidate implements endpoints and writes tests.',
        stack: ['Node.js 20', 'TypeScript', 'Prisma', 'PostgreSQL', 'Jest'],
        preLoadedDeps: ['express', 'zod', 'bcrypt', 'jsonwebtoken'],
        timeLimit: '3 hours',
        resourceLimits: { cpu: '2 cores', memory: '4GB', storage: '10GB' },
        features: ['Database GUI', 'API testing panel', 'Terminal access', 'Git integration', 'Auto-save'],
        status: 'ready',
        templateRepo: 'github/forge-sandbox-api',
    },
    {
        id: 'sb-3',
        name: 'System Design Whiteboard',
        description: 'Interactive whiteboard with architecture diagram templates, load calculator, and cost estimator built in.',
        stack: ['Excalidraw', 'Calculator widgets', 'Diagram templates'],
        preLoadedDeps: [],
        timeLimit: '1 hour',
        resourceLimits: { cpu: '1 core', memory: '2GB', storage: '1GB' },
        features: ['Real-time collaboration', 'Architecture templates', 'Export to PDF', 'Interviewer viewing mode'],
        status: 'ready',
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 20. BLACK-BOX ASYNC INTERVIEW ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface AsyncQuestion {
    id: string
    type: 'text' | 'video' | 'code' | 'diagram'
    question: string
    timeLimit: string
    instructions: string
    evaluationCriteria: string[]
    order: number
}

export interface AsyncInterview {
    id: string
    title: string
    roleTitle: string
    totalDuration: string
    questions: AsyncQuestion[]
    candidateCount: number
    completionRate: number
    avgCompletionTime: string
}

export const DEMO_ASYNC_INTERVIEW: AsyncInterview = {
    id: 'ai-1',
    title: 'Senior React Engineer — Async Screen',
    roleTitle: 'Senior React Engineer',
    totalDuration: '90 min total',
    candidateCount: 24,
    completionRate: 83,
    avgCompletionTime: '72 min',
    questions: [
        {
            id: 'aq-1', type: 'video', order: 1,
            question: 'Walk us through a technically challenging project you\'ve worked on. Focus on the architecture decisions and trade-offs you made.',
            timeLimit: '5 min recording',
            instructions: 'Record a video (max 5 min). You may share your screen to show diagrams or code. We\'re evaluating communication clarity, technical depth, and self-awareness.',
            evaluationCriteria: ['Communication clarity', 'Technical depth', 'Self-awareness about tradeoffs', 'Structured thinking'],
        },
        {
            id: 'aq-2', type: 'code', order: 2,
            question: 'Given a list of GitHub repositories, build a React component that displays them with search, sorting by stars, and infinite scroll. Use TypeScript.',
            timeLimit: '45 min',
            instructions: 'Complete in the provided sandbox. Focus on code quality over feature completeness. We expect tests.',
            evaluationCriteria: ['Code architecture', 'TypeScript usage', 'Performance awareness', 'Testing', 'Error handling'],
        },
        {
            id: 'aq-3', type: 'text', order: 3,
            question: 'Your team inherits a legacy React class component codebase (500+ components). The PM wants new features shipped weekly. Propose a migration strategy.',
            timeLimit: '20 min writing',
            instructions: 'Write a 300-500 word technical proposal. Consider timeline, risk, prioritisation, and team impact.',
            evaluationCriteria: ['Strategic thinking', 'Pragmatism', 'Risk awareness', 'Communication quality'],
        },
        {
            id: 'aq-4', type: 'diagram', order: 4,
            question: 'Design the data flow for a real-time notification system that handles 10k events/second, supports priority levels, and allows user preferences for delivery channels.',
            timeLimit: '20 min',
            instructions: 'Draw a system diagram showing components, data flow, and key decisions. Explain your choices in annotations.',
            evaluationCriteria: ['System thinking', 'Scalability awareness', 'Clarity of diagram', 'Trade-off articulation'],
        },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 21. LIVE CODING / TASK REPLAY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ReplayEvent {
    timestamp: string
    minutesMark: number
    event: string
    category: 'exploration' | 'implementation' | 'debugging' | 'testing' | 'refactoring' | 'idle'
    insight: string
    sentiment: 'positive' | 'neutral' | 'concerning'
}

export interface ReplayAnalysis {
    candidateName: string
    taskTitle: string
    totalDuration: string
    timeBreakdown: { category: string; percentage: number; color: string }[]
    events: ReplayEvent[]
    overallInsights: string[]
    strengthSignals: string[]
    concernSignals: string[]
}

export const DEMO_REPLAY: ReplayAnalysis = {
    candidateName: 'Alex Rivera',
    taskTitle: 'Real-Time Notification System',
    totalDuration: '2h 34m',
    timeBreakdown: [
        { category: 'Exploration', percentage: 15, color: '#818CF8' },
        { category: 'Implementation', percentage: 45, color: '#34D399' },
        { category: 'Debugging', percentage: 12, color: '#F59E0B' },
        { category: 'Testing', percentage: 18, color: '#3B82F6' },
        { category: 'Refactoring', percentage: 8, color: '#EC4899' },
        { category: 'Idle', percentage: 2, color: '#6B7280' },
    ],
    events: [
        { timestamp: '00:00', minutesMark: 0, event: 'Starts reading existing codebase', category: 'exploration', insight: 'Spends first 15 min understanding patterns — strong signal', sentiment: 'positive' },
        { timestamp: '00:15', minutesMark: 15, event: 'Opens package.json, checks dependencies', category: 'exploration', insight: 'Checks constraints before writing code', sentiment: 'positive' },
        { timestamp: '00:22', minutesMark: 22, event: 'Creates WebSocket hook with reconnection logic', category: 'implementation', insight: 'Starts with infrastructure, not UI — good prioritisation', sentiment: 'positive' },
        { timestamp: '00:45', minutesMark: 45, event: 'Adds exponential backoff to reconnection', category: 'implementation', insight: 'Handles edge case proactively without being asked', sentiment: 'positive' },
        { timestamp: '01:10', minutesMark: 70, event: 'Notification grouping logic — struggles with reduce', category: 'debugging', insight: 'Debugging takes 15 min, tries 3 approaches before solving', sentiment: 'neutral' },
        { timestamp: '01:25', minutesMark: 85, event: 'Writes test for WebSocket hook', category: 'testing', insight: 'Tests infrastructure before building UI on top', sentiment: 'positive' },
        { timestamp: '01:50', minutesMark: 110, event: 'Implements virtualised list for notifications', category: 'implementation', insight: 'Considers performance from the start', sentiment: 'positive' },
        { timestamp: '02:10', minutesMark: 130, event: 'Refactors notification store for immutability', category: 'refactoring', insight: 'Takes time to clean up after implementation — quality signal', sentiment: 'positive' },
        { timestamp: '02:20', minutesMark: 140, event: 'Writes DECISIONS.md explaining trade-offs', category: 'implementation', insight: 'Documents decisions without being prompted', sentiment: 'positive' },
        { timestamp: '02:30', minutesMark: 150, event: 'Final review and commit cleanup', category: 'refactoring', insight: 'Cleans commit history before submission — professional', sentiment: 'positive' },
    ],
    overallInsights: [
        'Reads before writing — spent 15% of time understanding the codebase before touching it',
        'Infrastructure-first approach — built the WebSocket layer before any UI',
        'Tests while building — not bolted on at the end',
        'Self-documents — wrote DECISIONS.md without being asked',
    ],
    strengthSignals: [
        'Strong codebase reading discipline',
        'Proactive edge case handling (reconnection backoff)',
        'Clean git history and commit messages',
        'Testing integrated into workflow, not afterthought',
    ],
    concernSignals: [
        'Debugging grouping logic took longer than expected (15 min for reduce)',
        'No accessibility considerations in the notification list',
    ],
}
