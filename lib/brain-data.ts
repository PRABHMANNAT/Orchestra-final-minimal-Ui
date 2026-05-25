export type BrainDoc = {
    id: string
    title: string
    category: 'core' | 'role' | 'tech' | 'policy' | 'decision'
    snippet: string
    content: string
    lastUpdated: string
    author: string
    confidence: number
}

export const BRAIN_DOCS: BrainDoc[] = [
    // ─── CORE CONTEXT (10 Docs) ──────────────────────────────────────────────
    {
        id: "core-mission",
        title: "Forge Mission & Vision 2026",
        category: "core",
        snippet: "Our mission is to replace the resume with proof-of-work hiring.",
        content: `# Mission 2026: The Death of the Resume\n\n**Mission:** To create a world where talent allows you to rise, regardless of background.\n\n**Vision:** A global "Proof Engine" that validates skills through simulation, not pedigree.\n\n**Strategy:**\n1. **Capture the Truth:** Build the most realistic work simulations (WorkSims).\n2. **Kill the Noise:** Filter candidates purely on output quality.\n3. **Scale Trust:** Standardize "Proof" as a currency better than a degree.\n\n**North Star Metric:** "Hires made without a CV review."`,
        lastUpdated: "2 weeks ago",
        author: "Adhiraj Dogra (CEO)",
        confidence: 0.99
    },
    {
        id: "core-culture-code",
        title: "The Forge Culture Code",
        category: "core",
        snippet: "Our operating principles: Truth, Speed, and Ownership.",
        content: `# The Forge Culture Code\n\n**1. Truth over Harmony:** We prefer uncomfortable truths to comfortable lies. Radical candor is expected.\n2. **Speed is a Feature:** Decisions should be reversible. If it's reversible, decide fast.\n3. **Ownership:** You break it, you fix it. You see it, you own it.\n4. **Frugality:** Spend money like it's your own. Invest in tools, starve bureaucracy.`,
        lastUpdated: "1 month ago",
        author: "Founders",
        confidence: 0.98
    },
    {
        id: "core-org-structure",
        title: "Organizational Design 2024",
        category: "core",
        snippet: "Matrix structure with Guilds and Squads.",
        content: `# Org Structure\n\nWe operate on the **Spotify Model**:\n- **Squads:** Cross-functional teams (PM, Eng, Design) focused on a mission (e.g. "Acquisition", "Core Product").\n- **Guilds:** Functional groups (Frontend, Backend, AI) for sharing best practices.\n- **Chapters:** Reporting lines within Guilds.\n\n**Current Squads:**\n1. **Alpha Squad:** Core Hiring Engine.\n2. **Beta Squad:** AI R&D (The Brain).\n3. **Growth Squad:** Enterprise Acquisition.`,
        lastUpdated: "3 weeks ago",
        author: "COO",
        confidence: 0.95
    },
    {
        id: "core-annual-goals",
        title: "FY2025 Company Goals (OKRs)",
        category: "core",
        snippet: "Objectives and Key Results for the fiscal year.",
        content: `# FY2025 OKRs\n\n**Objective 1: Win the Enterprise.**\n- KR1: Close 10 Fortune 500 logos.\n- KR2: Achieve SOC2 Type II compliance.\n- KR3: Reduce Enterprise Churn to < 1%.\n\n**Objective 2: Scale the AI Brain.**\n- KR1: Process 1M candidates via "Proof Engine".\n- KR2: Achieve 90% accuracy in automated grading.\n\n**Objective 3: Operational Excellence.**\n- KR1: Maintain 80% Gross Margin.\n- KR2: eNPS > 40.`,
        lastUpdated: "1 month ago",
        author: "Strategies Team",
        confidence: 0.92
    },
    {
        id: "core-brand-guidelines",
        title: "Brand Voice & Visual Identity",
        category: "core",
        snippet: "Guidelines for tone, logo usage, and color palette.",
        content: `# Brand Guidelines\n\n**Voice:**\n- **Confident:** We are experts.\n- **Direct:** We don't use fluff.\n- **Human:** We are dealing with people's careers.\n\n**Visuals:**\n- **Primary:** Emerald (#10b981) for success/growth.\n- **Dark Mode:** Our platform is dark-first for developer ergonomics.\n- **Fonts:** Inter (UI), Geist Mono (Code).`,
        lastUpdated: "6 months ago",
        author: "Head of Design",
        confidence: 0.9
    },
    {
        id: "core-remote-handbook",
        title: "Remote First Handbook",
        category: "core",
        snippet: "How to work effectively in a distributed team.",
        content: `# Remote Handbook\n\n**The Golden Rule:** "If it's not written down, it doesn't exist."\n\n**Practices:**\n1. **Async Demos:** Record Loom videos for standups and demos.\n2. **Written Decisions:** Use RFCs for all major technical decisions.\n3. **Documentation:** Update the wiki continuously.\n4. **Hours:** Overlap 4 hours with EST.`,
        lastUpdated: "2 months ago",
        author: "People Ops",
        confidence: 0.95
    },
    {
        id: "core-security-policy",
        title: "Information Security Policy",
        category: "core",
        snippet: "Data handling, access controls, and device security.",
        content: `# InfoSec Policy\n\n**Data Classification:**\n- **Public:** Marketing site.\n- **Internal:** Slack, Wiki.\n- **Confidential:** Candidate PII, Salaries.\n- **Restricted:** Production DB credentials.\n\n**Access Control:**\n- Least Privilege Principle.\n- MFA enforced on all accounts.\n- 1Password for all shared secrets.`,
        lastUpdated: "3 months ago",
        author: "CISO",
        confidence: 1.0
    },

    // ─── ROLE KNOWLEDGE (10 Docs) ──────────────────────────────────────────────
    {
        id: "role-senior-backend",
        title: "Rubric: Senior Backend Engineer (L5)",
        category: "role",
        snippet: "Competency matrix for L5. System Design, DB optimization.",
        content: `# Senior Backend Engineer (L5) Rubric\n\n**Core Competencies:**\n\n1. **System Design (30%):**\n   - **L5:** Can design distributed systems handling 10k RPS. Discusses tradeoffs (Consistency vs Availability).\n2. **Database Optimization (25%):**\n   - **L5:** Understands indexing, query planning, sharding strategies.\n3. **Code Quality (20%):**\n   - Writes testable, modular code. Enforces strict typing.\n4. **Mentorship (15%):**\n   - Actively reviews PRs and mentors L3s.`,
        lastUpdated: "1 week ago",
        author: "Eng Lead",
        confidence: 0.9
    },
    {
        id: "role-staff-engineer",
        title: "Rubric: Staff Engineer (L6)",
        category: "role",
        snippet: "Setting technical strategy and solving cross-team problems.",
        content: `# Staff Engineer (L6)\n\n**Focus:** "What should we build?" vs "How do we build it?"\n\n**Expectations:**\n- **Architecture:** Defines the long-term technical vision.\n- **Glue:** Solves problems that span multiple teams.\n- **Sponsorship:** Advocates for engineering excellence and tech debt paydown.\n\n**Archetypes:**\n1. **The Architect:** Deep technical expertise in specific domain.\n2. **The Solver:** Fixes the hardest bugs and fires.\n3. **The Right Hand:** Extension of the CTO.`,
        lastUpdated: "2 months ago",
        author: "CTO",
        confidence: 0.88
    },
    {
        id: "role-pm-l4",
        title: "Role Profile: Product Manager (L4)",
        category: "role",
        snippet: "Mid-level PM expectations: Execution, data literacy.",
        content: `# Product Manager (L4)\n\n**Summary:** Owns a feature end-to-end.\n\n**Must Haves:**\n- **SQL Proficiency:** Can write own queries.\n- **Spec Writing:** Produces clear PRDs.\n- **Tradeoff Management:** Can say "No".\n\n**Success Metrics:**\n- Feature adoption rate.\n- Velocity of the squad.`,
        lastUpdated: "1 month ago",
        author: "Head of Product",
        confidence: 0.85
    },
    {
        id: "role-designer-l3",
        title: "Rubric: Product Designer (L3)",
        category: "role",
        snippet: "UI/UX fundamentals and system design usage.",
        content: `# Product Designer (L3)\n\n**Competencies:**\n1. **Visual Design:** pixel-perfect execution using Figma.\n2. **UX Research:** Can conduct basic user interviews.\n3. **System Thinking:** Uses and contributes to the Design System.\n4. **Prototyping:** Builds interactive prototypes for user testing.`,
        lastUpdated: "3 months ago",
        author: "Head of Design",
        confidence: 0.9
    },
    {
        id: "role-em-l5",
        title: "Role: Engineering Manager (L5)",
        category: "role",
        snippet: "People management, hiring, and delivery.",
        content: `# Engineering Manager (L5)\n\n**Responsibilities:**\n1. **People:** 1:1s, career growth, performance reviews.\n2. **Hiring:** Building the team, closing candidates.\n3. **Delivery:** Unblocking the team, ensuring sprint goals are met.\n\n**Not Responsible For:**\n- Writing code (critical path).\n- Making all technical decisions.`,
        lastUpdated: "4 months ago",
        author: "VP Engineering",
        confidence: 0.92
    },
    {
        id: "role-sdr-l2",
        title: "Role: Sales Development Rep (L2)",
        category: "role",
        snippet: "Outbound prospecting and pipeline generation.",
        content: `# SDR (L2)\n\n**KPIs:**\n- 50 Calls/day.\n- 10 Qualified Opportunities/month.\n\n**Skills:**\n- Cold calling resilience.\n- Email copywriting.\n- CRM hygiene (Salesforce).`,
        lastUpdated: "5 months ago",
        author: "VP Sales",
        confidence: 0.95
    },

    // ─── TECH KNOWLEDGE (10 Docs) ──────────────────────────────────────────────
    {
        id: "tech-stack-frontend",
        title: "Frontend Architecture Standards",
        category: "tech",
        snippet: "Next.js App Router, Tailwind, Shadcn.",
        content: `# Frontend Standards\n\n**Stack:** Next.js 14, React, Tailwind CSS, Shadcn UI.\n\n**Rules:**\n- Use Server Components by default.\n- Colocate components with routes where possible.\n- Use Zod for all form validation.\n- Mobile-first responsive design.`,
        lastUpdated: "1 week ago",
        author: "Frontend Guild",
        confidence: 0.98
    },
    {
        id: "tech-stack-backend",
        title: "Backend Services & Microservices",
        category: "tech",
        snippet: "Go, Node.js, gRPC, PostgreSQL.",
        content: `# Backend Architecture\n\n**Core Services:**\n1. **Identity:** Node.js + OAuth2.\n2. **Proof Engine:** Go (for performance/concurrency).\n3. **Billing:** Stripe integration.\n\n**Communication:**\n- Internal: gRPC / Protobuf.\n- External: REST / GraphQL.\n\n**Database:**\n- Primary: PostgreSQL (Supabase).\n- Cache: Redis.\n- Search: Meilisearch.`,
        lastUpdated: "2 weeks ago",
        author: "Backend Guild",
        confidence: 0.95
    },
    {
        id: "tech-ai-pipeline",
        title: "AI Analysis Pipeline (RAG)",
        category: "tech",
        snippet: "Vector DB, Embeddings, LLM orchestration.",
        content: `# AI Pipeline Architecture\n\n**Ingestion:**\n- PDFs parsed via OCR.\n- Text chunks embedded using OpenAI Ada-002.\n- Stored in Pinecone.\n\n**Retrieval:**\n- Hybrid search (Keyword + Semantic).\n- Re-ranking using Cohere.\n\n**Generation:**\n- GPT-4 Turbo for reasoning.\n- Anthropic Claude 3 for long-context analysis.`,
        lastUpdated: "3 days ago",
        author: "AI Team",
        confidence: 0.9
    },
    {
        id: "tech-ci-cd",
        title: "CI/CD & Deployment Strategy",
        category: "tech",
        snippet: "GitHub Actions, Vercel, Docker registry.",
        content: `# CI/CD Pipeline\n\n**Triggers:**\n- Push to main -> Staging Deploy.\n- Tag release -> Production Deploy.\n\n**Checks:**\n- Lint (ESLint).\n- Type Check (TSC).\n- Unit Tests (Jest/Vitest).\n- E2E Tests (Playwright).\n\n**Infrastructure:**\n- Frontend: Vercel.\n- Backend: AWS ECS (Fargate).`,
        lastUpdated: "1 month ago",
        author: "DevOps",
        confidence: 0.96
    },
    {
        id: "tech-monitoring",
        title: "Observability & Monitoring",
        category: "tech",
        snippet: "Datadog, Sentry, OpenTelemetry.",
        content: `# Observability\n\n**Logs:** Centralized in Datadog.\n**Metrics:** Prometheus / Grafana for infrastructure stats.\n**Tracing:** OpenTelemetry for distributed traces.\n**Errors:** Sentry for exception tracking.\n\n**SLOs:**\n- API Latency < 200ms (p95).\n- Availability > 99.9%.`,
        lastUpdated: "2 months ago",
        author: "SRE Team",
        confidence: 0.94
    },
    {
        id: "tech-security-app",
        title: "Application Security Standards",
        category: "tech",
        snippet: "OWASP Top 10, sanitization, encryption.",
        content: `# App Security\n\n**Guidelines:**\n1. **Input Validation:** Never trust user input. Validate everything.\n2. **Authentication:** Never roll your own crypto. Use libraries.\n3. **Secrets:** Never commit API keys. Use ENV vars.\n4. **Dependencies:** Run 'npm audit' weekly.`,
        lastUpdated: "3 months ago",
        author: "Security Team",
        confidence: 1.0
    },

    // ─── POLICIES (Merged into Brain for search) ─────────────────────────────
    {
        id: "policy-remote",
        title: "Remote Work & Jurisdiction",
        category: "policy",
        snippet: "Rules for working from permitted countries.",
        content: `# Remote Work Policy\n\n**Approved Countries:** US, Canada, UK, Australia.\n**Visa Support:** We sponsor H1B transfers for US roles.\n**Nomad Policy:** You may work from a non-approved country for up to 30 days per year (Tourist Visa).`,
        lastUpdated: "1 week ago",
        author: "People Ops",
        confidence: 1.0
    },
    {
        id: "policy-pto",
        title: "Unlimited PTO & Holidays",
        category: "policy",
        snippet: "Minimums, maximums, and approval flows.",
        content: `# PTO Policy\n\n**Structure:** "Flexible PTO" (Unlimited).\n**Requirement:** We *require* a minimum of 3 weeks off per year to prevent burnout.\n**Approval:** < 3 days needs no approval. > 3 days requires manager notice 2 weeks in advance.`,
        lastUpdated: "2 months ago",
        author: "People Ops",
        confidence: 1.0
    },
    {
        id: "policy-benefits",
        title: "Global Benefits Package 2024",
        category: "policy",
        snippet: "Health, Dental, Vision, 401k.",
        content: `# Benefits Overview\n\n**US Employees:**\n- 100% covered Medical/Dental/Vision (Blue Cross).\n- 401k match up to 4%.\n- $100/mo wellness stipend.\n\n**International:**\n- Private health insurance.\n- Pension contribution matching (statutory + 2%).`,
        lastUpdated: "1 month ago",
        author: "People Ops",
        confidence: 1.0
    },
    {
        id: "policy-equity",
        title: "Employee Stock Option Plan (ESOP)",
        category: "policy",
        snippet: "Vesting schedules, cliffs, and exercise windows.",
        content: `# ESOP Guide\n\n**Vesting:** 4-year vest, 1-year cliff.\n**Type:** ISOs (US), NSOs (Intl).\n**Exercise Window:** 10 years (we are employee friendly).\n**Refreshers:** Annual grants based on performance.`,
        lastUpdated: "6 months ago",
        author: "Finance",
        confidence: 1.0
    },

    // ─── DECISIONS (Strategic Log) ───────────────────────────────────────────
    {
        id: "decision-nextjs",
        title: "Decision: Standardizing on Next.js",
        category: "decision",
        snippet: "Architecture decision record for frontend framework.",
        content: `# Decision: Next.js\n\n**Context:** React ecosystem fragmentation.\n**Choice:** Next.js App Router.\n**Why:** Server Components, Vercel Infra, SEO.\n**Alternatives:** Remix (good but niche), Create React App (deprecated).`,
        lastUpdated: "1 year ago",
        author: "Frontend Guild",
        confidence: 0.95
    },
    {
        id: "decision-titan",
        title: "Project Titan: Enterprise Shift",
        category: "decision",
        snippet: "Strategic pivot from SMB to Enterprise.",
        content: `# Project Titan\n\n**Pivot:** Move upmarket.\n**Reasoning:** SMB LTV:CAC ratio was < 1. Enterprise is > 5.\n**Changes:** Sales-led growth instead of PLG. SOC2 compliance imperative.`,
        lastUpdated: "8 months ago",
        author: "CEO",
        confidence: 0.98
    },
    {
        id: "decision-no-mobile",
        title: "Decision: No Native Mobile App",
        category: "decision",
        snippet: "Why we are PWA only for now.",
        content: `# Decision: No Mobile App\n\n**Context:** Should we build iOS/Android apps?\n**Decision:** NO.\n**Reasoning:** Hiring Managers use desktops. Candidates apply on desktops (mostly). PWA is sufficient for simple status checks.\n**Savings:** $500k/year in engineering salaries.`,
        lastUpdated: "1 year ago",
        author: "Product",
        confidence: 0.9
    },
    {
        id: "decision-office-closure",
        title: "Decision: Closing SF Office",
        category: "decision",
        snippet: "Moving to fully remote.",
        content: `# Office Closure\n\n**Date:** June 2023\n**Decision:** Close the 500 Howard St office.\n**Reasoning:** utilization was < 10%. Rent was $40k/mo. Better deployed into R&D.\n**Mitigation:** WeWork All Access passes for everyone.`,
        lastUpdated: "1.5 years ago",
        author: "Ops",
        confidence: 1.0
    }
]
