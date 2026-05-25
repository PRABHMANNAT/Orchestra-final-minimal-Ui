// ─── AI Hiring PM — Types & Demo Data ───────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'staff' | 'principal'

export const SENIORITY_CONFIG: Record<SeniorityLevel, { label: string; color: string; years: string }> = {
    junior: { label: 'Junior', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30', years: '0–2 yrs' },
    mid: { label: 'Mid', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30', years: '2–5 yrs' },
    senior: { label: 'Senior', color: 'text-violet-400 bg-violet-500/15 border-violet-500/30', years: '5–8 yrs' },
    staff: { label: 'Staff', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', years: '8–12 yrs' },
    principal: { label: 'Principal', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', years: '12+ yrs' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AI CHAT
// ═══════════════════════════════════════════════════════════════════════════════

export type PMMessageRole = 'user' | 'ai'
export type PMPanelType = 'rubric' | 'company' | 'market' | 'bias' | 'strategy' | 'poach' | 'interview-pkg' | 'work-sim' | 'proof-engine' | 'analysis' | 'performance' | null

export interface PMMessage {
    id: string
    role: PMMessageRole
    content: string
    timestamp: Date
    panelTrigger?: PMPanelType       // which right-panel to activate
    panelData?: string               // key into demo data
}

export const WELCOME_MESSAGE: PMMessage = {
    id: 'welcome',
    role: 'ai',
    content: `Hey! I'm your AI Hiring PM. I can help you with:\n\n• **Create hiring rubrics** — "Build a rubric for Senior React Engineer"\n• **Learn your company** — "Here's our tech stack and culture"\n• **Check the market** — "What's the market like for ML Engineers?"\n• **Audit for bias** — "Run a bias check on our evaluation"\n• **Build a strategy** — "Recommend a sourcing strategy for this role"\n• **Poach star players** — "Find me star engineers to poach from competitors"\n• **Interview package** — "Generate an interview plan for this role"\n• **Work simulations** — "Create coding challenges and scenarios"\n• **Proof-based screening** — "Verify candidate claims with proof"\n• **Candidate analysis** — "Analyse this candidate's performance"\n• **Performance intelligence** — "Show me team performance and promotion readiness"\n\nWhat would you like to start with?`,
    timestamp: new Date(),
    panelTrigger: null,
}

export const SUGGESTED_PROMPTS = [
    { label: 'New Role', prompt: 'Create a rubric for a Senior React Engineer', icon: 'FileText', panel: 'rubric' as PMPanelType },
    { label: 'Company Setup', prompt: 'Let me tell you about our company', icon: 'Building2', panel: 'company' as PMPanelType },
    { label: 'Market Check', prompt: 'What does the market look like for ML Engineers?', icon: 'TrendingUp', panel: 'market' as PMPanelType },
    { label: 'Bias Audit', prompt: 'Run a bias check on our current evaluation criteria', icon: 'Shield', panel: 'bias' as PMPanelType },
    { label: 'Strategy', prompt: 'Recommend a hiring strategy for this role', icon: 'Compass', panel: 'strategy' as PMPanelType },
    { label: 'Poach Stars', prompt: 'Find me star engineers to poach from competitors', icon: 'Crown', panel: 'poach' as PMPanelType },
    { label: 'Interview Pack', prompt: 'Generate a structured interview plan for Senior React Engineer', icon: 'ClipboardList', panel: 'interview-pkg' as PMPanelType },
    { label: 'Work Sim', prompt: 'Create work sample tasks and design challenges', icon: 'Hammer', panel: 'work-sim' as PMPanelType },
    { label: 'Proof Engine', prompt: 'Verify candidate claims and set up proof-based screening', icon: 'Microscope', panel: 'proof-engine' as PMPanelType },
    { label: 'Analysis', prompt: 'Analyse candidate performance and detect anomalies', icon: 'BarChart3', panel: 'analysis' as PMPanelType },
    { label: 'People Ops', prompt: 'Show team performance summaries, promotion readiness and coaching', icon: 'Activity', panel: 'performance' as PMPanelType },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 2. ROLE-TO-RUBRIC ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface RubricSkill {
    name: string
    weight: number
    importance: 'must-have' | 'nice-to-have'
    evaluationCriteria: string
    category: 'technical' | 'domain' | 'soft' | 'leadership'
}

export interface RubricConfig {
    roleTitle: string
    seniority: SeniorityLevel
    skills: RubricSkill[]
    responsibilities: string[]
    interviewStructure: { round: string; duration: string; focus: string }[]
}

export const DEMO_RUBRICS: Record<string, RubricConfig> = {
    'senior-react': {
        roleTitle: 'Senior React Engineer',
        seniority: 'senior',
        skills: [
            { name: 'React / Next.js', weight: 25, importance: 'must-have', evaluationCriteria: 'Can architect complex SPAs, SSR/SSG patterns, performance optimization', category: 'technical' },
            { name: 'TypeScript', weight: 20, importance: 'must-have', evaluationCriteria: 'Advanced generics, type-safe API layers, discriminated unions', category: 'technical' },
            { name: 'State Management', weight: 12, importance: 'must-have', evaluationCriteria: 'Redux/Zustand/Jotai patterns, async state, caching strategies', category: 'technical' },
            { name: 'Testing', weight: 10, importance: 'must-have', evaluationCriteria: 'Unit, integration, E2E with Jest/Playwright, TDD mindset', category: 'technical' },
            { name: 'CSS / Design Systems', weight: 8, importance: 'nice-to-have', evaluationCriteria: 'Tailwind/CSS-in-JS, responsive design, accessibility', category: 'technical' },
            { name: 'API Design', weight: 8, importance: 'must-have', evaluationCriteria: 'REST/GraphQL, error handling, pagination, caching', category: 'domain' },
            { name: 'System Design', weight: 7, importance: 'nice-to-have', evaluationCriteria: 'Micro-frontends, CDN strategy, performance budgets', category: 'domain' },
            { name: 'Mentorship', weight: 5, importance: 'nice-to-have', evaluationCriteria: 'Code reviews, pair programming, growing junior engineers', category: 'leadership' },
            { name: 'Communication', weight: 5, importance: 'must-have', evaluationCriteria: 'RFC writing, cross-team collaboration, stakeholder updates', category: 'soft' },
        ],
        responsibilities: [
            'Own frontend architecture decisions for core product',
            'Lead migration from legacy CRA to Next.js App Router',
            'Establish testing culture and CI/CD frontend pipeline',
            'Mentor 2–3 junior engineers through code reviews and pairing',
            'Collaborate with design on component library and design system',
        ],
        interviewStructure: [
            { round: 'Technical Screen', duration: '45 min', focus: 'React patterns, TypeScript, live coding' },
            { round: 'System Design', duration: '60 min', focus: 'Frontend architecture, performance, scalability' },
            { round: 'Behavioral', duration: '45 min', focus: 'Ownership, mentorship, conflict resolution' },
            { round: 'Culture & Values', duration: '30 min', focus: 'Team fit, growth mindset, collaboration style' },
        ],
    },
    'backend-go': {
        roleTitle: 'Backend Engineer (Go)',
        seniority: 'mid',
        skills: [
            { name: 'Go', weight: 30, importance: 'must-have', evaluationCriteria: 'Goroutines, channels, error handling patterns, stdlib mastery', category: 'technical' },
            { name: 'PostgreSQL', weight: 18, importance: 'must-have', evaluationCriteria: 'Schema design, query optimization, migrations, indexing', category: 'technical' },
            { name: 'gRPC / Protobuf', weight: 12, importance: 'must-have', evaluationCriteria: 'Service definitions, streaming, backward compatibility', category: 'technical' },
            { name: 'Docker / K8s', weight: 10, importance: 'nice-to-have', evaluationCriteria: 'Containerization, pod scaling, health checks', category: 'domain' },
            { name: 'Distributed Systems', weight: 10, importance: 'nice-to-have', evaluationCriteria: 'Consistency models, partitioning, CAP trade-offs', category: 'domain' },
            { name: 'Testing', weight: 8, importance: 'must-have', evaluationCriteria: 'Table-driven tests, mocking, benchmarks, fuzz testing', category: 'technical' },
            { name: 'Observability', weight: 7, importance: 'nice-to-have', evaluationCriteria: 'Structured logging, tracing, metrics, alerting', category: 'domain' },
            { name: 'Communication', weight: 5, importance: 'must-have', evaluationCriteria: 'Design docs, PR descriptions, async communication', category: 'soft' },
        ],
        responsibilities: [
            'Design and implement microservices handling 10k+ RPS',
            'Own database schema evolution and migration strategy',
            'Write comprehensive tests with >85% coverage targets',
            'Participate in on-call rotation and incident response',
        ],
        interviewStructure: [
            { round: 'Go Deep Dive', duration: '60 min', focus: 'Concurrency, error handling, system design in Go' },
            { round: 'Database Design', duration: '45 min', focus: 'Schema modeling, query optimization, trade-offs' },
            { round: 'Behavioral', duration: '30 min', focus: 'Incident response, ownership, collaboration' },
        ],
    },
    'product-manager': {
        roleTitle: 'Product Manager',
        seniority: 'senior',
        skills: [
            { name: 'Product Strategy', weight: 22, importance: 'must-have', evaluationCriteria: 'Vision setting, roadmap prioritization, opportunity sizing', category: 'domain' },
            { name: 'Data Analysis', weight: 18, importance: 'must-have', evaluationCriteria: 'SQL, A/B testing, funnel analysis, metric definition', category: 'technical' },
            { name: 'User Research', weight: 15, importance: 'must-have', evaluationCriteria: 'Interview design, synthesis, persona development', category: 'domain' },
            { name: 'Stakeholder Management', weight: 12, importance: 'must-have', evaluationCriteria: 'Executive communication, cross-functional alignment', category: 'leadership' },
            { name: 'Technical Fluency', weight: 10, importance: 'nice-to-have', evaluationCriteria: 'API concepts, trade-off discussions with engineers', category: 'technical' },
            { name: 'Design Thinking', weight: 8, importance: 'nice-to-have', evaluationCriteria: 'Wireframing, prototype feedback, design system awareness', category: 'domain' },
            { name: 'Go-to-Market', weight: 8, importance: 'must-have', evaluationCriteria: 'Launch planning, positioning, competitive analysis', category: 'domain' },
            { name: 'Written Communication', weight: 7, importance: 'must-have', evaluationCriteria: 'PRDs, one-pagers, decision docs, async updates', category: 'soft' },
        ],
        responsibilities: [
            'Define product vision and quarterly OKRs for growth pod',
            'Run weekly sprint planning and backlog grooming',
            'Own key metrics: activation, retention, and NPS',
            'Lead cross-functional discovery with design and engineering',
        ],
        interviewStructure: [
            { round: 'Product Sense', duration: '45 min', focus: 'Problem framing, opportunity sizing, trade-offs' },
            { round: 'Analytical', duration: '45 min', focus: 'Metric definition, A/B test design, SQL' },
            { round: 'Execution', duration: '45 min', focus: 'Roadmap prioritization, stakeholder conflict scenario' },
            { round: 'Leadership', duration: '30 min', focus: 'Team dynamics, influence without authority' },
        ],
    },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. COMPANY CONTEXT INGESTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompanyProfile {
    name: string
    stage: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth' | 'public'
    headcount: number
    techStack: string[]
    productDescription: string
    cultureValues: string[]
    hiringConstraints: string[]
    pastHirePatterns: { trait: string; frequency: string }[]
    preferences: { key: string; value: string }[]
}

export const DEMO_COMPANY: CompanyProfile = {
    name: 'Acme Labs',
    stage: 'series-b',
    headcount: 85,
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Terraform', 'GitHub Actions'],
    productDescription: 'B2B developer tools platform helping engineering teams automate code review and deployment pipelines. 2,400 paying teams, $8M ARR.',
    cultureValues: [
        'Ship fast, learn faster',
        'Default to transparency',
        'Ownership over delegation',
        'Disagree and commit',
        'Craft matters',
    ],
    hiringConstraints: [
        'Remote-first (US/EU timezones)',
        'Budget: $150–220k base + equity',
        'No sponsorship available',
        'Must overlap 4+ hours with EST',
    ],
    pastHirePatterns: [
        { trait: 'Open source contributors', frequency: '60% of eng hires' },
        { trait: 'Bootcamp grads', frequency: '15% of eng hires' },
        { trait: 'Ex-FAANG', frequency: '25% of eng hires' },
        { trait: 'Career switchers', frequency: '10% of all hires' },
        { trait: 'Internal promotions', frequency: '30% of senior roles' },
    ],
    preferences: [
        { key: 'Interview Timeline', value: '2 weeks max, 3 rounds' },
        { key: 'Offer Speed', value: '48-hour decision after final round' },
        { key: 'Trial Period', value: '1-week paid project for senior+ roles' },
        { key: 'Team Size Target', value: 'Eng team: 85 → 120 by Q3' },
    ],
}

export const STAGE_CONFIG: Record<CompanyProfile['stage'], { label: string; color: string }> = {
    'seed': { label: 'Seed', color: 'text-lime-400 bg-lime-500/15' },
    'series-a': { label: 'Series A', color: 'text-emerald-400 bg-emerald-500/15' },
    'series-b': { label: 'Series B', color: 'text-cyan-400 bg-cyan-500/15' },
    'series-c': { label: 'Series C', color: 'text-blue-400 bg-blue-500/15' },
    'growth': { label: 'Growth', color: 'text-violet-400 bg-violet-500/15' },
    'public': { label: 'Public', color: 'text-amber-400 bg-amber-500/15' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MARKET-AWARE ROLE CALIBRATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface MarketBenchmark {
    roleTitle: string
    salaryBands: { p25: number; p50: number; p75: number; p90: number; currency: string }
    supplyDemand: 'abundant' | 'balanced' | 'scarce' | 'critical'
    competitionIntensity: number // 0–100
    avgTimeToHire: number        // days
    topCompetitors: string[]
    talentPoolSize: number
    growthRate: number            // YoY % change in demand
    remoteAvailability: number    // % of candidates open to remote
}

export const DEMO_MARKET_DATA: Record<string, MarketBenchmark> = {
    'senior-react': {
        roleTitle: 'Senior React Engineer',
        salaryBands: { p25: 145000, p50: 175000, p75: 210000, p90: 250000, currency: 'USD' },
        supplyDemand: 'balanced',
        competitionIntensity: 68,
        avgTimeToHire: 32,
        topCompetitors: ['Vercel', 'Stripe', 'Linear', 'Notion', 'Figma'],
        talentPoolSize: 48000,
        growthRate: 12,
        remoteAvailability: 78,
    },
    'ml-engineer': {
        roleTitle: 'ML Engineer',
        salaryBands: { p25: 170000, p50: 210000, p75: 260000, p90: 320000, currency: 'USD' },
        supplyDemand: 'scarce',
        competitionIntensity: 89,
        avgTimeToHire: 55,
        topCompetitors: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'Scale AI'],
        talentPoolSize: 12000,
        growthRate: 45,
        remoteAvailability: 65,
    },
    'backend-go': {
        roleTitle: 'Backend Engineer (Go)',
        salaryBands: { p25: 135000, p50: 165000, p75: 195000, p90: 230000, currency: 'USD' },
        supplyDemand: 'balanced',
        competitionIntensity: 55,
        avgTimeToHire: 28,
        topCompetitors: ['Cloudflare', 'HashiCorp', 'CockroachDB', 'Uber', 'Docker'],
        talentPoolSize: 35000,
        growthRate: 18,
        remoteAvailability: 72,
    },
    'product-manager': {
        roleTitle: 'Senior Product Manager',
        salaryBands: { p25: 155000, p50: 185000, p75: 225000, p90: 275000, currency: 'USD' },
        supplyDemand: 'abundant',
        competitionIntensity: 42,
        avgTimeToHire: 24,
        topCompetitors: ['Airbnb', 'Spotify', 'Slack', 'Atlassian', 'Shopify'],
        talentPoolSize: 85000,
        growthRate: 8,
        remoteAvailability: 82,
    },
}

export const SUPPLY_DEMAND_CONFIG: Record<MarketBenchmark['supplyDemand'], { label: string; color: string; icon: string }> = {
    abundant: { label: 'Abundant Supply', color: 'text-emerald-400 bg-emerald-500/15', icon: '🟢' },
    balanced: { label: 'Balanced Market', color: 'text-blue-400 bg-blue-500/15', icon: '🔵' },
    scarce: { label: 'Scarce Talent', color: 'text-amber-400 bg-amber-500/15', icon: '🟡' },
    critical: { label: 'Critical Shortage', color: 'text-red-400 bg-red-500/15', icon: '🔴' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BIAS-REDUCED EVALUATION FRAMEWORK
// ═══════════════════════════════════════════════════════════════════════════════

export type BiasType = 'pedigree' | 'school' | 'brand' | 'demographic' | 'age' | 'name'

export interface BiasFlag {
    type: BiasType
    label: string
    icon: string
    description: string
    severity: 'low' | 'medium' | 'high'
}

export interface CandidateScoreComparison {
    candidateId: string
    name: string
    rawScore: number
    normalizedScore: number
    flaggedBiases: BiasType[]
    scoreChange: number // positive = boosted after normalization, negative = reduced
}

export interface BiasCheckResult {
    overallBiasRisk: number // 0–100
    reductionPercentage: number
    flagsDetected: BiasFlag[]
    candidates: CandidateScoreComparison[]
}

export const BIAS_FLAGS: Record<BiasType, BiasFlag> = {
    pedigree: { type: 'pedigree', label: 'Pedigree Bias', icon: '🏛️', description: 'Score influenced by employer prestige rather than actual output', severity: 'high' },
    school: { type: 'school', label: 'School Bias', icon: '🎓', description: 'Weighting toward elite university attendance', severity: 'high' },
    brand: { type: 'brand', label: 'Brand Bias', icon: '🏢', description: 'Favoring candidates from well-known companies', severity: 'medium' },
    demographic: { type: 'demographic', label: 'Demographic Bias', icon: '👤', description: 'Patterns suggesting name/gender/ethnicity influence', severity: 'high' },
    age: { type: 'age', label: 'Age Bias', icon: '📅', description: 'Penalizing or favoring based on years of experience as proxy for age', severity: 'medium' },
    name: { type: 'name', label: 'Name Bias', icon: '📝', description: 'Unconscious association patterns based on candidate names', severity: 'medium' },
}

export const DEMO_BIAS_CHECK: BiasCheckResult = {
    overallBiasRisk: 34,
    reductionPercentage: 67,
    flagsDetected: [
        BIAS_FLAGS.pedigree,
        BIAS_FLAGS.school,
        BIAS_FLAGS.brand,
    ],
    candidates: [
        { candidateId: '1', name: 'Candidate A', rawScore: 92, normalizedScore: 85, flaggedBiases: ['pedigree', 'school'], scoreChange: -7 },
        { candidateId: '2', name: 'Candidate B', rawScore: 71, normalizedScore: 82, flaggedBiases: ['brand'], scoreChange: +11 },
        { candidateId: '3', name: 'Candidate C', rawScore: 68, normalizedScore: 79, flaggedBiases: [], scoreChange: +11 },
        { candidateId: '4', name: 'Candidate D', rawScore: 84, normalizedScore: 78, flaggedBiases: ['pedigree'], scoreChange: -6 },
        { candidateId: '5', name: 'Candidate E', rawScore: 59, normalizedScore: 76, flaggedBiases: [], scoreChange: +17 },
        { candidateId: '6', name: 'Candidate F', rawScore: 88, normalizedScore: 74, flaggedBiases: ['school', 'pedigree'], scoreChange: -14 },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. HIRING STRATEGY GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export interface SourcingChannel {
    name: string
    expectedYield: number      // % of pipeline
    costPerHire: string
    timeToFill: string
    effortLevel: 'low' | 'medium' | 'high'
    recommended: boolean
    icon: string
    description: string
}

export interface StrategyRecommendation {
    roleTitle: string
    totalPipelineTarget: number
    expectedTimeToHire: string
    channels: SourcingChannel[]
    pipelineFunnel: { stage: string; count: number; color: string }[]
    evaluationDepth: { stage: string; description: string; duration: string }[]
}

export const DEMO_STRATEGY: StrategyRecommendation = {
    roleTitle: 'Senior React Engineer',
    totalPipelineTarget: 120,
    expectedTimeToHire: '4–6 weeks',
    channels: [
        {
            name: 'LinkedIn Outreach',
            expectedYield: 35,
            costPerHire: '$2,800',
            timeToFill: '3–4 weeks',
            effortLevel: 'medium',
            recommended: true,
            icon: '💼',
            description: 'Targeted outreach to passive candidates with React/Next.js experience',
        },
        {
            name: 'GitHub Sourcing',
            expectedYield: 20,
            costPerHire: '$1,200',
            timeToFill: '2–3 weeks',
            effortLevel: 'high',
            recommended: true,
            icon: '🐙',
            description: 'Mine open source contributors in React ecosystem (Next.js, Remix, Vite)',
        },
        {
            name: 'Employee Referrals',
            expectedYield: 25,
            costPerHire: '$800',
            timeToFill: '1–2 weeks',
            effortLevel: 'low',
            recommended: true,
            icon: '🤝',
            description: 'Internal referral program with $5k bonus — highest close rate',
        },
        {
            name: 'Job Boards',
            expectedYield: 10,
            costPerHire: '$3,500',
            timeToFill: '4–6 weeks',
            effortLevel: 'low',
            recommended: false,
            icon: '📋',
            description: 'Y Combinator, Wellfound, and niche React job boards',
        },
        {
            name: 'Headhunter / Agency',
            expectedYield: 10,
            costPerHire: '$35,000',
            timeToFill: '2–4 weeks',
            effortLevel: 'low',
            recommended: false,
            icon: '🎯',
            description: 'Last resort — 20% fee but fast for hard-to-fill senior roles',
        },
    ],
    pipelineFunnel: [
        { stage: 'Sourced', count: 120, color: 'bg-white/20' },
        { stage: 'Screened', count: 45, color: 'bg-blue-500/40' },
        { stage: 'Technical Round', count: 18, color: 'bg-violet-500/40' },
        { stage: 'Final Round', count: 8, color: 'bg-amber-500/40' },
        { stage: 'Offer', count: 3, color: 'bg-emerald-500/40' },
        { stage: 'Hired', count: 1, color: 'bg-emerald-500/80' },
    ],
    evaluationDepth: [
        { stage: 'Screening', description: 'Resume + GitHub scan, 5-min async video intro', duration: '15 min' },
        { stage: 'Technical', description: 'Live coding + system design (React architecture)', duration: '90 min' },
        { stage: 'Culture Fit', description: 'Values alignment, working style, team dynamics', duration: '45 min' },
        { stage: 'Reference Check', description: '2 references focused on collaboration and ownership', duration: '30 min' },
    ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. COMPETITIVE HIRING — STAR PLAYER POACHING
// ═══════════════════════════════════════════════════════════════════════════════

export type VulnerabilityLevel = 'low' | 'medium' | 'high' | 'very-high'

export interface PoachIncentive {
    type: 'compensation' | 'equity' | 'role' | 'culture' | 'mission' | 'flexibility' | 'growth'
    label: string
    description: string
    impact: 'low' | 'medium' | 'high'
    icon: string
}

export interface StarPlayer {
    id: string
    name: string
    currentCompany: string
    currentRole: string
    field: string
    seniority: SeniorityLevel
    estimatedSalary: string
    publicSignals: string[]
    vulnerabilities: { signal: string; confidence: VulnerabilityLevel }[]
    suggestedIncentives: PoachIncentive[]
    poachDifficulty: number // 0–100
    impactIfHired: number   // 0–100
    linkedinUrl?: string
    githubUrl?: string
    notableWork: string
}

export interface CompetitorCompany {
    name: string
    logo: string
    field: string
    knownIssues: string[]
    attritionRisk: 'low' | 'medium' | 'high'
    avgTenure: string
    recentEvents: string[]
    starPlayers: StarPlayer[]
}

export const VULNERABILITY_CONFIG: Record<VulnerabilityLevel, { label: string; color: string }> = {
    low: { label: 'Low', color: 'text-emerald-400 bg-emerald-500/15' },
    medium: { label: 'Medium', color: 'text-blue-400 bg-blue-500/15' },
    high: { label: 'High', color: 'text-amber-400 bg-amber-500/15' },
    'very-high': { label: 'Very High', color: 'text-red-400 bg-red-500/15' },
}

export const INCENTIVE_TYPE_CONFIG: Record<PoachIncentive['type'], { color: string }> = {
    compensation: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    equity: { color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    role: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    culture: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    mission: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    flexibility: { color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    growth: { color: 'text-lime-400 bg-lime-500/10 border-lime-500/20' },
}

export const DEMO_POACH_TARGETS: CompetitorCompany[] = [
    {
        name: 'Vercel',
        logo: '▲',
        field: 'Frontend Infrastructure',
        knownIssues: ['Recent layoffs in DX team', 'Slowing growth post-Series D', 'Key architects leaving for AI startups'],
        attritionRisk: 'high',
        avgTenure: '1.8 years',
        recentEvents: ['15% DX team reduction (Jan 2026)', 'CTO departure rumored', 'Competitor Next.js forks gaining traction'],
        starPlayers: [
            {
                id: 'sp-1',
                name: 'Maya Chen',
                currentCompany: 'Vercel',
                currentRole: 'Staff Engineer — Next.js Core',
                field: 'Frontend',
                seniority: 'staff',
                estimatedSalary: '$245k + equity',
                publicSignals: ['200+ commits to Next.js in 2025', 'Led App Router migration', 'Conference speaker (React Conf, Next.js Conf)'],
                vulnerabilities: [
                    { signal: 'Team downsized — her direct reports were let go', confidence: 'very-high' },
                    { signal: 'LinkedIn status changed to "Open to opportunities"', confidence: 'high' },
                    { signal: 'Reduced GitHub activity in last 2 months', confidence: 'medium' },
                ],
                suggestedIncentives: [
                    { type: 'role', label: 'VP of Engineering offer', description: 'She\'s capped at Staff — offer VP/Director title with direct CEO access', impact: 'high', icon: '👑' },
                    { type: 'equity', label: '0.5% founding-level equity', description: 'Series B equity with 4-year vest, 1-year cliff — significant upside if IPO', impact: 'high', icon: '📈' },
                    { type: 'mission', label: 'Greenfield architecture ownership', description: 'Let her design the entire frontend platform from scratch — no legacy constraints', impact: 'high', icon: '🏗️' },
                    { type: 'compensation', label: 'P90 compensation: $280k base', description: 'Beat Vercel\'s package by 15% to remove financial hesitation', impact: 'medium', icon: '💰' },
                ],
                poachDifficulty: 35,
                impactIfHired: 95,
                notableWork: 'Architected Next.js App Router, 15k+ GitHub stars on personal projects',
            },
            {
                id: 'sp-2',
                name: 'Raj Patel',
                currentCompany: 'Vercel',
                currentRole: 'Senior Engineer — Turbopack',
                field: 'Frontend / Tooling',
                seniority: 'senior',
                estimatedSalary: '$210k + equity',
                publicSignals: ['Core contributor to Turbopack', 'Rust + TypeScript polyglot', 'Active in build tooling community'],
                vulnerabilities: [
                    { signal: 'Turbopack roadmap deprioritized in favor of AI features', confidence: 'high' },
                    { signal: 'Posted about "builder burnout" on Twitter/X', confidence: 'medium' },
                ],
                suggestedIncentives: [
                    { type: 'mission', label: 'Lead build tooling initiative', description: 'Own the entire DX/build pipeline — his passion project with full autonomy', impact: 'high', icon: '🔧' },
                    { type: 'flexibility', label: 'Async-first + 4-day work week', description: 'Directly addresses burnout signal — sustainable pace, real impact', impact: 'high', icon: '🌴' },
                    { type: 'compensation', label: '$235k base + signing bonus', description: '$25k signing bonus to offset unvested equity left behind', impact: 'medium', icon: '💰' },
                ],
                poachDifficulty: 45,
                impactIfHired: 82,
                notableWork: 'Co-authored Turbopack incremental compilation engine',
            },
        ],
    },
    {
        name: 'Stripe',
        logo: '💳',
        field: 'Payments / FinTech',
        knownIssues: ['4th round of layoffs', 'IPO delay frustration', 'Equity cliff for early employees'],
        attritionRisk: 'high',
        avgTenure: '2.4 years',
        recentEvents: ['Another 300-person reduction (Feb 2026)', 'IPO pushed to 2027', 'Multiple VP departures to competitors'],
        starPlayers: [
            {
                id: 'sp-3',
                name: 'Elena Vasquez',
                currentCompany: 'Stripe',
                currentRole: 'Staff Engineer — Payments API',
                field: 'Backend / Payments',
                seniority: 'staff',
                estimatedSalary: '$290k + equity',
                publicSignals: ['Designed Stripe\'s idempotency layer', 'Author of internal distributed systems course', '10+ years in fintech'],
                vulnerabilities: [
                    { signal: 'Equity package underwater due to revaluation', confidence: 'very-high' },
                    { signal: 'Her team\'s project was cancelled in restructuring', confidence: 'high' },
                    { signal: 'Publicly liked posts about "startup energy" on LinkedIn', confidence: 'medium' },
                ],
                suggestedIncentives: [
                    { type: 'equity', label: 'Equity refresh at current valuation', description: 'Fresh equity grant at Series B valuation — massive upside vs. Stripe\'s flat stock', impact: 'high', icon: '📈' },
                    { type: 'role', label: 'Head of Platform Engineering', description: 'Leadership role with 8–12 direct reports, strategic influence on architecture', impact: 'high', icon: '👑' },
                    { type: 'growth', label: 'Conference speaking sponsorship', description: 'Fund her speaking at 4+ conferences/year + blog platform — build public profile', impact: 'medium', icon: '🎤' },
                    { type: 'compensation', label: '$310k base + $50k signing', description: 'Clear financial win — covers equity gap loss from leaving Stripe', impact: 'high', icon: '💰' },
                ],
                poachDifficulty: 40,
                impactIfHired: 92,
                notableWork: 'Architected Stripe payment processing pipeline handling $1T+ annually',
            },
        ],
    },
    {
        name: 'Linear',
        logo: '◆',
        field: 'Developer Tools / PM',
        knownIssues: ['Small team = burnout risk', 'Limited career ladder', 'Intense shipping pace'],
        attritionRisk: 'medium',
        avgTenure: '2.1 years',
        recentEvents: ['Key designer left for Figma', 'Series C pressure on margins', 'Increased focus on enterprise — culture shift'],
        starPlayers: [
            {
                id: 'sp-4',
                name: 'Alex Kim',
                currentCompany: 'Linear',
                currentRole: 'Senior Engineer — Editor & Sync',
                field: 'Frontend / Real-time',
                seniority: 'senior',
                estimatedSalary: '$195k + equity',
                publicSignals: ['Built Linear\'s CRDT sync engine', 'Active in local-first community', 'Published papers on collaborative editing'],
                vulnerabilities: [
                    { signal: 'Small team — limited growth beyond IC track', confidence: 'high' },
                    { signal: 'Enterprise pivot may misalign with craft-oriented values', confidence: 'medium' },
                ],
                suggestedIncentives: [
                    { type: 'growth', label: 'Staff → Principal path with mentorship', description: 'Clear IC ladder with title + comp progression — what Linear can\'t offer at their size', impact: 'high', icon: '🪜' },
                    { type: 'culture', label: 'Research time allocation (20%)', description: '1 day/week for CRDT/local-first research — publish papers, build open source', impact: 'high', icon: '🔬' },
                    { type: 'compensation', label: '$240k base', description: '23% raise over current comp — significant for someone at a smaller startup', impact: 'medium', icon: '💰' },
                ],
                poachDifficulty: 55,
                impactIfHired: 88,
                notableWork: 'Core architect of Linear\'s offline-first sync engine',
            },
        ],
    },
    {
        name: 'OpenAI',
        logo: '⬡',
        field: 'AI / ML',
        knownIssues: ['Governance instability', 'Safety team departures', 'For-profit restructuring concerns'],
        attritionRisk: 'medium',
        avgTenure: '1.6 years',
        recentEvents: ['Safety-focused researchers leaving in waves', 'Nonprofit → for-profit controversy', 'Microsoft relationship tension'],
        starPlayers: [
            {
                id: 'sp-5',
                name: 'Priya Sharma',
                currentCompany: 'OpenAI',
                currentRole: 'Research Engineer — Applied AI',
                field: 'AI / ML',
                seniority: 'senior',
                estimatedSalary: '$320k + equity',
                publicSignals: ['Co-author on GPT-4 evaluation paper', 'Built internal fine-tuning pipeline', 'Background in responsible AI'],
                vulnerabilities: [
                    { signal: 'Publicly expressed concerns about safety culture changes', confidence: 'very-high' },
                    { signal: 'Multiple safety-team colleagues have already left', confidence: 'high' },
                    { signal: 'Research interests misaligned with commercial roadmap', confidence: 'high' },
                ],
                suggestedIncentives: [
                    { type: 'mission', label: 'Head of Responsible AI', description: 'Title + budget to build an ethical AI practice from Day 1 — the role she wishes she had at OpenAI', impact: 'high', icon: '🛡️' },
                    { type: 'equity', label: '0.8% equity (early-stage upside)', description: 'OpenAI equity is uncertain — fresh Series B equity with clear liquidity path', impact: 'high', icon: '📈' },
                    { type: 'culture', label: 'Research publication freedom', description: 'Publish freely without corporate approval — the #1 complaint from ex-OpenAI researchers', impact: 'high', icon: '📝' },
                    { type: 'flexibility', label: 'Remote + conference circuit', description: 'Work from anywhere + sponsored speaking at NeurIPS, ICML, etc.', impact: 'medium', icon: '🌍' },
                ],
                poachDifficulty: 50,
                impactIfHired: 90,
                notableWork: 'Led GPT-4 evaluation framework, built fine-tuning infrastructure used by 100k+ developers',
            },
        ],
    },
    {
        name: 'Shopify',
        logo: '🛍️',
        field: 'E-commerce / Full-stack',
        knownIssues: ['Mandatory RTO causing friction', 'Tobi\'s "chaos" management style', 'Frequent reorgs'],
        attritionRisk: 'high',
        avgTenure: '2.0 years',
        recentEvents: ['Return-to-office mandate (3 days/week)', 'Annual "chaos monkey" reorg', 'Several principal engineers left for remote-first companies'],
        starPlayers: [
            {
                id: 'sp-6',
                name: 'Marcus Johnson',
                currentCompany: 'Shopify',
                currentRole: 'Principal Engineer — Storefront Renderer',
                field: 'Full-stack / Performance',
                seniority: 'principal',
                estimatedSalary: '$340k + equity',
                publicSignals: ['Built Hydrogen/Oxygen rendering stack', 'Core contributor to Remix', 'Published Shopify engineering blog posts on performance'],
                vulnerabilities: [
                    { signal: 'Frustrated with RTO — he relocated to rural Colorado during COVID', confidence: 'very-high' },
                    { signal: 'His project (Hydrogen) was deprioritized in latest reorg', confidence: 'high' },
                    { signal: 'Active GitHub contributions to non-Shopify projects increasing', confidence: 'medium' },
                ],
                suggestedIncentives: [
                    { type: 'flexibility', label: '100% remote, forever', description: 'The single biggest lever — he can\'t get this at Shopify anymore', impact: 'high', icon: '🏡' },
                    { type: 'role', label: 'Distinguished Engineer title', description: 'Beyond Principal — org-wide technical authority with no management overhead', impact: 'high', icon: '👑' },
                    { type: 'equity', label: '1.0% equity at Series B', description: 'Shopify stock is flat — fresh startup equity with real upside potential', impact: 'high', icon: '📈' },
                    { type: 'mission', label: 'Own performance engineering org', description: 'Build and lead a dedicated performance team — his passion', impact: 'medium', icon: '⚡' },
                ],
                poachDifficulty: 30,
                impactIfHired: 97,
                notableWork: 'Architected Shopify Hydrogen framework, cut storefront render time by 60%',
            },
        ],
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AI RESPONSE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export function getAIResponse(userMessage: string): { content: string; panelTrigger: PMPanelType; panelData: string } {
    const lower = userMessage.toLowerCase()

    if (lower.includes('rubric') || lower.includes('role') || lower.includes('react engineer') || lower.includes('new role')) {
        return {
            content: `I've generated a hiring rubric for **Senior React Engineer**.\n\nThe rubric includes **9 weighted skills** across technical, domain, soft, and leadership categories. I've structured a **4-round interview** that progressively evaluates depth.\n\n**Key highlights:**\n• React/Next.js (25%) and TypeScript (20%) are the heaviest weights\n• Testing is a must-have at 10% — this filters out ~40% of candidates\n• Mentorship is nice-to-have but signals staff-readiness\n\nYou can adjust weights in the panel on the right. Want me to calibrate this against market data?`,
            panelTrigger: 'rubric',
            panelData: 'senior-react',
        }
    }

    if (lower.includes('company') || lower.includes('stack') || lower.includes('culture') || lower.includes('about us')) {
        return {
            content: `I've loaded your company profile for **Acme Labs**.\n\n**Quick summary:**\n• Series B, 85-person team scaling to 120 by Q3\n• Stack: React/Next.js + Node.js + PostgreSQL on AWS\n• Remote-first, US/EU timezones\n• Strong open-source contributor hiring pattern (60% of eng)\n\nI'll use this context to calibrate all rubrics, market benchmarks, and strategy recommendations. You can edit any field in the panel.\n\nShall I check the market for your next hire?`,
            panelTrigger: 'company',
            panelData: 'acme',
        }
    }

    if (lower.includes('market') || lower.includes('salary') || lower.includes('compensation') || lower.includes('ml engineer')) {
        return {
            content: `Here's the market data for **ML Engineers**.\n\n**⚠️ This is a scarce talent market:**\n• Median salary: **$210k** (P75: $260k, P90: $320k)\n• Competition intensity: **89/100** — OpenAI, Anthropic, and DeepMind are aggressively hiring\n• Average time-to-hire: **55 days** — nearly 2× the industry average\n• YoY demand growth: **+45%** — fastest-growing role category\n\n**My recommendation:** Offer at P75+ ($260k) to be competitive. Consider equity-heavy packages and remote flexibility to expand the talent pool (65% open to remote).\n\nWant me to build a sourcing strategy for this role?`,
            panelTrigger: 'market',
            panelData: 'ml-engineer',
        }
    }

    if (lower.includes('bias') || lower.includes('fair') || lower.includes('audit') || lower.includes('evaluation')) {
        return {
            content: `I've run a bias audit on your evaluation framework.\n\n**Results:**\n• Overall bias risk: **34/100** (moderate)\n• After normalization: **67% bias reduction**\n• 3 bias patterns detected: Pedigree, School, and Brand bias\n\n**What this means:**\n• Candidate A scored 92 raw but drops to 85 after removing FAANG/Ivy League signal inflation\n• Candidate E scored only 59 raw but jumps to 76 after removing anti-bias against non-traditional backgrounds\n• **The rank ordering changes significantly** — proof matters more than pedigree\n\nI recommend enabling the bias-normalized view for all evaluations. Want me to adjust the rubric weights to minimize these signals?`,
            panelTrigger: 'bias',
            panelData: 'default',
        }
    }

    if (lower.includes('strategy') || lower.includes('sourcing') || lower.includes('channel') || lower.includes('pipeline') || lower.includes('recommend')) {
        return {
            content: `Here's my recommended hiring strategy for **Senior React Engineer**.\n\n**Pipeline target: 120 candidates → 1 hire**\n\n**Top 3 channels (ranked by ROI):**\n1. 🤝 **Employee Referrals** — $800/hire, 1–2 week fill, highest close rate\n2. 🐙 **GitHub Sourcing** — $1,200/hire, mine React ecosystem OSS contributors\n3. 💼 **LinkedIn Outreach** — $2,800/hire, targeted passive candidate outreach\n\n**Avoid for now:** Agencies ($35k/hire) — save for Staff+ roles where speed justifies cost.\n\n**Evaluation depth:** 4-stage pipeline from 15-min screen to reference check. Total candidate time commitment: ~3 hours.\n\nThe full funnel and channel breakdown are in the panel. Shall I draft outreach templates?`,
            panelTrigger: 'strategy',
            panelData: 'default',
        }
    }

    if (lower.includes('poach') || lower.includes('star') || lower.includes('competitor') || lower.includes('steal') || lower.includes('recruit from') || lower.includes('talent raid') || lower.includes('hire from')) {
        return {
            content: `I've identified **6 star players** across **5 competitor companies** who are showing vulnerability signals right now.\n\n**🔥 Highest-priority targets:**\n\n1. **Marcus Johnson** (Shopify, Principal) — Poach difficulty: **30/100**\n   → Frustrated with RTO mandate, project deprioritized. Offer: 100% remote + Distinguished Engineer title\n\n2. **Maya Chen** (Vercel, Staff) — Poach difficulty: **35/100**\n   → Team downsized, LinkedIn set to \"Open\". Offer: VP of Eng + 0.5% equity\n\n3. **Elena Vasquez** (Stripe, Staff) — Poach difficulty: **40/100**\n   → Equity underwater, project cancelled. Offer: Head of Platform + equity refresh\n\n**Key insight:** Companies with recent layoffs (Vercel, Stripe, Shopify) have **3× higher attrition risk** for star players. The window to poach is typically **4–8 weeks** post-event.\n\nEach target has personalized incentive packages in the panel. Want me to draft outreach for any of them?`,
            panelTrigger: 'poach',
            panelData: 'default',
        }
    }

    if (lower.includes('interview') || lower.includes('plan') || lower.includes('questions') || lower.includes('interview pack') || lower.includes('follow-up') || lower.includes('anti-cheat')) {
        return {
            content: `I've generated a **comprehensive interview package** for Senior React Engineer.\n\n**📋 What's included:**\n\n1. **Structured Interview Plan** — 4 rounds, 2h 40m total, with timed sections and objectives\n2. **Competency Question Bank** — 9 tiered questions across technical, domain, soft, and leadership\n3. **Dynamic Follow-ups** — Adaptive probes that adjust based on candidate response quality\n4. **Anti-Cheat Variants** — 6 isomorphic question variants to prevent memorisation\n5. **Interviewer Guidance** — Expected answers, scoring rubrics, and probing strategies\n6. **Candidate Instructions** — Briefs for each interview section\n\n**Key design decisions:**\n• Technical rounds front-loaded to filter early\n• Every question has 3 follow-up paths (strong/adequate/weak responses)\n• Anti-cheat variants use different domains but test identical competencies\n\nThe full package is in the panel. Want me to customise question difficulty or focus areas?`,
            panelTrigger: 'interview-pkg',
            panelData: 'default',
        }
    }

    if (lower.includes('work sample') || lower.includes('coding challenge') || lower.includes('system design') || lower.includes('behavioural') || lower.includes('culture') || lower.includes('stress test') || lower.includes('eval rubric') || lower.includes('work sim') || lower.includes('scenario')) {
        return {
            content: `I've built a **work simulation suite** for Senior React Engineer.\n\n**🔨 What's ready:**\n\n1. **3 Work-Sample Tasks** — Role-specific sandbox challenges (not LeetCode!)\n   • Real-Time Notification System (2–3h)\n   • Data Table with Server-Side Ops (2–3h)\n   • Form Builder with Validation Engine (3–4h, expert)\n\n2. **2 System Design Scenarios** — Aligned to your product context\n   • Collaborative Document Editor\n   • Feature Flag Platform\n\n3. **4 Behavioural Questions** — Mapped to your company values\n4. **3 Culture Stress Tests** — Real workplace tradeoff scenarios\n5. **5-criterion Evaluation Rubric** — With scoring scales and flag definitions\n\n**Philosophy:** Every task mirrors real day-1 work at your company — no algorithmic puzzles, no trivia.\n\nExplore the full suite in the panel. Want me to adjust task difficulty or time limits?`,
            panelTrigger: 'work-sim',
            panelData: 'default',
        }
    }

    if (lower.includes('proof') || lower.includes('verify') || lower.includes('resume') || lower.includes('sandbox') || lower.includes('async') || lower.includes('replay') || lower.includes('screen') || lower.includes('credential')) {
        return {
            content: `I've set up the **proof-based screening engine**.\n\n**🔬 What's active:**\n\n1. **Resume → Proof Analysis** — 6 credential claims checked against real evidence\n   • ✅ 2 Verified | 🌟 1 Exceeds Claim | ⚠️ 2 Inflated | ❓ 1 Unverifiable\n\n2. **3 Sandbox Environments** — Ready to deploy\n   • React Frontend Challenge (Next.js + TypeScript)\n   • Full-Stack API Challenge (Node.js + Prisma)\n   • System Design Whiteboard (Excalidraw-based)\n\n3. **Async Interview** — 4-question async screen running\n   • 24 candidates invited, 83% completion rate\n   • Mix of video, code, text, and diagram questions\n\n4. **Live Replay Analysis** — Alex Rivera's session analysed\n   • 2h 34m total, 45% implementation, 18% testing\n   • Strong signals: reads before writing, tests while building\n\nDig into each in the panel. Want me to set up a new sandbox or analyse another candidate?`,
            panelTrigger: 'proof-engine',
            panelData: 'default',
        }
    }

    if (lower.includes('performance summary') || lower.includes('promotion read') || lower.includes('underperform') || lower.includes('coaching') || lower.includes('peer signal') || lower.includes('peer feedback') || lower.includes('mobility') || lower.includes('capability map') || lower.includes('people ops') || lower.includes('workforce') || lower.includes('team performance')) {
        return {
            content: `I've loaded the **Performance Intelligence** suite for your team.\n\n**📊 What's inside:**\n\n1. **Rolling Performance Summaries** — 2 employees tracked with real work signals\n   • Sarah Chen (87, ↑8%) — Design system v2, bundle size -34%, mentoring 2 juniors\n   • Marcus Johnson (71, stable) — Strong on-call, but output below team average\n\n2. **Promotion Readiness** — Sarah Chen → L6 Staff Engineer\n   • Readiness: **82%** — Almost ready. Gap: cross-org influence (3-6 months)\n   • Already exceeds L6 bar in Technical Depth (92) and Scope (85)\n\n3. **Underperformance Alerts** — 2 early warnings\n   • 🔴 Tyler Brooks — PR velocity -45%, standup absence 30%\n   • 🟡 Priya Sharma — Design iterations +78%, possible upstream cause\n\n4. **Manager Coaching AI** — Ready-to-use scripts and development plans\n5. **Peer Signal Aggregation** — 14 feedback signals synthesised\n6. **Internal Mobility** — 2 recommended transfers\n7. **Workforce Capability Map** — Skills vs future needs with hire recs\n\nExplore everything in the panel →`,
            panelTrigger: 'performance',
            panelData: 'default',
        }
    }

    if (lower.includes('analy') || lower.includes('decision') || lower.includes('communication') || lower.includes('benchmark') || lower.includes('cheat') || lower.includes('detect') || lower.includes('score')) {
        return {
            content: `I've compiled the **candidate analysis suite**.\n\n**📊 Analysis breakdown:**\n\n1. **Decision Trace** — Alex Rivera's system design approach\n   • Overall: **82/100** — Excellent problem framing (90), strong trade-off articulation (85)\n   • ✅ Asked 4 clarifying questions before proposing\n   • ⚠️ Missed cold-start edge case for SDK\n\n2. **Communication Scoring** — 78/100\n   • 💎 Clarity: 85 | 🏗️ Structure: 80 | ✂️ Conciseness: 65 | 🔄 Adaptability: 82\n   • Tends to over-explain when nervous\n\n3. **Work Benchmarking** — P82 overall\n   • Code Quality: P88 | Test Coverage: P72 | Documentation: P90\n   • Recommendation: **Hire** (outperforms 3 of 3 previous hires)\n\n4. **Cheat Detection** — Jordan Lee flagged\n   • Risk level: **Suspicious** (45% AI probability)\n   • 🔴 Code produced in large complete blocks\n   • 🟡 Unusually consistent typing speed\n\nFull details in the panel. Want me to deep-dive on any candidate?`,
            panelTrigger: 'analysis',
            panelData: 'default',
        }
    }

    // Default / catch-all
    return {
        content: `I can help with that! Here are some things I can do:\n\n• **"Create a rubric for [role]"** — Generate structured hiring criteria\n• **"Tell me about our company"** — Load and review company context\n• **"Market data for [role]"** — Get salary bands and competition data\n• **"Run a bias audit"** — Check your evaluation for hidden biases\n• **"Hiring strategy for [role]"** — Get sourcing channel recommendations\n• **"Poach star players"** — Find vulnerable top talent at competitors\n• **"Interview package"** — Generate structured interview plans\n• **"Work simulations"** — Create coding challenges and design scenarios\n• **"Proof-based screening"** — Verify claims and set up candidate testing\n• **"Candidate analysis"** — Analyse performance and detect anomalies\n• **"Team performance"** — Rolling summaries, promotions, coaching & mobility\n\nWhich would you like to explore?`,
        panelTrigger: null,
        panelData: '',
    }
}

