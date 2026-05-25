// TALENT RADAR - AI-Discovered Passive Candidates for Poaching
// Terminology:
// - UNICORN (99%+ match) - Perfect fit, extremely rare
// - RISING STAR (90-98% match) - High potential, proven track record
// - HIDDEN GEM (85-89% match) - Underrated talent, great value
// - SLEEPER (80-84% match) - Solid fit, may need convincing

export type TalentTier = "unicorn" | "rising_star" | "hidden_gem" | "sleeper"

export type DiscoverySource = "linkedin" | "github" | "twitter" | "conference" | "blog" | "referral" | "job_board"

export type PoachStatus =
  | "discovered"
  | "researching"
  | "outreach_sent"
  | "responded"
  | "interviewing"
  | "offer_sent"
  | "closed"

export interface PreviousRole {
  company: string
  role: string
  duration: string
  highlights: string[]
}

export interface AIInsight {
  category: "opportunity" | "risk" | "timing" | "approach"
  insight: string
  confidence: number // 0-100
}

export interface PassiveCandidate {
  id: string
  name: string
  headline: string
  currentCompany: string
  currentRole: string
  location: string
  yearsExperience: number
  avatarUrl?: string

  // Scoring
  matchScore: number // 0-100
  tier: TalentTier
  skillsOverlap: { skill: string; strength: number }[]
  missingSkills: string[]

  // Discovery
  discoverySource: DiscoverySource
  discoveredAt: string
  profileUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  blogUrl?: string

  // Why they're special
  highlights: string[]
  notableAchievements: string[]

  // Career history
  previousRoles: PreviousRole[]
  tenure: string // e.g., "2.5 years at current role"
  careerTrajectory: "rapid_growth" | "steady" | "lateral" | "recent_change"

  // Contribution potential
  whatTheyBring: string[]
  uniqueStrengths: string[]
  potentialImpact: string
  rampUpTime: string // e.g., "2-3 weeks"

  // Why reach out
  whyReachOut: string[]
  timingSignals: string[]
  openToOpportunities: "likely" | "possible" | "unknown" | "unlikely"

  // AI-powered insights
  aiSuggestions: AIInsight[]
  outreachAngle: string
  pitchPoints: string[]
  potentialObjections: { objection: string; counter: string }[]

  // Compensation intel
  estimatedSalary?: { min: number; max: number; currency: string }
  salarySource?: string
  equityExpectation?: string
  totalCompEstimate?: string

  // Poaching status
  status: PoachStatus
  outreachDraft?: string
  offerDraft?: string
  notes?: string
  lastContactedAt?: string
}

export function getTierFromScore(score: number): TalentTier {
  if (score >= 99) return "unicorn"
  if (score >= 90) return "rising_star"
  if (score >= 85) return "hidden_gem"
  return "sleeper"
}

export function getTierConfig(tier: TalentTier) {
  const configs = {
    unicorn: {
      label: "Unicorn",
      shortLabel: "U",
      color: "bg-violet-500/20",
      borderColor: "border-violet-500/30",
      textColor: "text-violet-400",
      description: "Perfect match. Extremely rare.",
      priority: "CRITICAL",
    },
    rising_star: {
      label: "Rising Star",
      shortLabel: "RS",
      color: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      description: "Proven track record. High potential.",
      priority: "HIGH",
    },
    hidden_gem: {
      label: "Hidden Gem",
      shortLabel: "HG",
      color: "bg-cyan-500/20",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
      description: "Underrated talent. Great value.",
      priority: "MEDIUM",
    },
    sleeper: {
      label: "Sleeper",
      shortLabel: "S",
      color: "bg-slate-500/20",
      borderColor: "border-slate-500/30",
      textColor: "text-slate-400",
      description: "Solid fit. May need convincing.",
      priority: "NORMAL",
    },
  }
  return configs[tier]
}

export function getSourceIcon(source: DiscoverySource): string {
  const icons = {
    linkedin: "Linkedin",
    github: "Github",
    twitter: "Twitter",
    conference: "Mic",
    blog: "FileText",
    referral: "Users",
    job_board: "Briefcase",
  }
  return icons[source]
}

export function getStatusConfig(status: PoachStatus) {
  const configs = {
    discovered: { label: "New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    researching: { label: "Researching", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
    outreach_sent: { label: "Contacted", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    responded: { label: "Responded", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    interviewing: { label: "Interviewing", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    offer_sent: { label: "Offer Sent", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
    closed: { label: "Closed", color: "bg-success/20 text-success border-success/30" },
  }
  return configs[status]
}

export const PASSIVE_CANDIDATES_SEED: PassiveCandidate[] = [
  {
    id: "passive-1",
    name: "Sophia Zhang",
    headline: "Staff Engineer @ Vercel | Next.js Core Team",
    currentCompany: "Vercel",
    currentRole: "Staff Engineer",
    location: "San Francisco, CA",
    yearsExperience: 8,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 99,
    tier: "unicorn",
    skillsOverlap: [
      { skill: "React", strength: 1.0 },
      { skill: "TypeScript", strength: 1.0 },
      { skill: "Next.js", strength: 1.0 },
      { skill: "Performance", strength: 0.95 },
      { skill: "Design Systems", strength: 0.9 },
    ],
    missingSkills: [],
    discoverySource: "github",
    discoveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    githubUrl: "https://github.com/sophiazhang",
    linkedinUrl: "https://linkedin.com/in/sophiazhang",
    twitterUrl: "https://twitter.com/sophiazhang",
    highlights: [
      "Core contributor to Next.js App Router",
      "Built Vercel's edge runtime from scratch",
      "Speaker at React Conf 2024",
    ],
    notableAchievements: [
      "50k+ GitHub stars across projects",
      "Authored RFC for React Server Components",
      "Ex-Google, Ex-Meta",
    ],
    // Career history
    previousRoles: [
      {
        company: "Meta",
        role: "Senior Engineer",
        duration: "2019-2022 (3 years)",
        highlights: ["Led React Native performance team", "Shipped features to 2B+ users", "Promoted twice in 3 years"],
      },
      {
        company: "Google",
        role: "Software Engineer",
        duration: "2016-2019 (3 years)",
        highlights: ["Angular core team", "Built internal design system", "20% project led to new product"],
      },
    ],
    tenure: "2 years at Vercel",
    careerTrajectory: "rapid_growth",
    // Contribution potential
    whatTheyBring: [
      "Deep Next.js internals knowledge - can debug and optimize at framework level",
      "Production experience at massive scale (Meta: 2B users)",
      "Strong technical writing - can document and evangelize internally",
      "Proven mentorship track record - elevated 10+ engineers to senior",
    ],
    uniqueStrengths: [
      "One of ~20 people who deeply understand React Server Components",
      "Built edge computing systems from scratch",
      "Can bridge product and engineering effectively",
    ],
    potentialImpact:
      "Could 10x your frontend architecture. Would immediately become technical leader for any React initiative.",
    rampUpTime: "1-2 weeks - already knows your stack intimately",
    // Why reach out
    whyReachOut: [
      "Her recent tweets suggest frustration with Vercel's enterprise focus",
      "Just passed 2-year cliff on equity - standard time to explore",
      "Former colleague mentioned she's fielding offers",
      "She's been more active on LinkedIn recently (updating profile, engaging with posts)",
    ],
    timingSignals: [
      "2-year equity cliff just passed",
      "Recent leadership changes at Vercel",
      "Increased LinkedIn activity in past 30 days",
    ],
    openToOpportunities: "likely",
    // AI suggestions
    aiSuggestions: [
      {
        category: "opportunity",
        insight:
          "She's mentioned wanting to work on 'developer tools that matter' - position your role around impact and developer experience",
        confidence: 85,
      },
      {
        category: "approach",
        insight:
          "Don't lead with money - she's already well-compensated. Lead with technical challenges and team quality",
        confidence: 90,
      },
      {
        category: "timing",
        insight: "Best to reach out within 2 weeks - she's likely in active conversations with other companies",
        confidence: 75,
      },
      {
        category: "risk",
        insight: "May have strong retention counter-offer. Be prepared to move fast if she's interested",
        confidence: 80,
      },
    ],
    outreachAngle:
      "Focus on the unique technical challenges and the chance to build something from scratch. Mention specific technical problems that would interest someone at her level.",
    pitchPoints: [
      "Greenfield architecture decisions - she'd have real ownership",
      "Smaller team = higher impact per engineer",
      "Path to engineering leadership if interested",
      "Equity upside vs. late-stage Vercel stock",
    ],
    potentialObjections: [
      {
        objection: "I'm on the Next.js core team - hard to leave that impact",
        counter:
          "You'd be building the core product here, not a framework. Direct user impact, not abstracted through other devs.",
      },
      {
        objection: "Vercel is growing fast, lots of opportunity",
        counter: "Growth also means more process, less autonomy. Here you'd shape the culture, not adapt to it.",
      },
    ],
    estimatedSalary: { min: 280000, max: 350000, currency: "USD" },
    salarySource: "Levels.fyi + insider intel",
    equityExpectation: "0.5-1% at Series A, 0.1-0.3% at Series B+",
    totalCompEstimate: "$400-500k total comp (base + equity)",
    status: "discovered",
  },
  {
    id: "passive-2",
    name: "Marcus Chen",
    headline: "Principal Frontend @ Stripe | Design Systems Lead",
    currentCompany: "Stripe",
    currentRole: "Principal Engineer",
    location: "Seattle, WA",
    yearsExperience: 10,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 96,
    tier: "rising_star",
    skillsOverlap: [
      { skill: "React", strength: 1.0 },
      { skill: "TypeScript", strength: 1.0 },
      { skill: "Design Systems", strength: 1.0 },
      { skill: "Accessibility", strength: 0.95 },
      { skill: "Testing", strength: 0.85 },
    ],
    missingSkills: ["GraphQL"],
    discoverySource: "conference",
    discoveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/marcuschen",
    githubUrl: "https://github.com/marcuschen",
    highlights: [
      "Built Stripe's entire design system (used by 500+ engineers)",
      "Reduced Stripe Dashboard bundle size by 60%",
      "Led accessibility initiative achieving WCAG AAA",
    ],
    notableAchievements: [
      "Design systems book author",
      "200+ internal tools shipped",
      "Mentored 30+ engineers to senior+",
    ],
    previousRoles: [
      {
        company: "Airbnb",
        role: "Staff Engineer",
        duration: "2017-2020 (3 years)",
        highlights: [
          "Built Airbnb's first design system",
          "Led frontend platform team",
          "Reduced design-dev handoff time by 70%",
        ],
      },
      {
        company: "Facebook",
        role: "Senior Engineer",
        duration: "2014-2017 (3 years)",
        highlights: ["React Native early adopter", "Built shared component library", "Featured in F8 talk"],
      },
    ],
    tenure: "4 years at Stripe",
    careerTrajectory: "steady",
    whatTheyBring: [
      "World-class design system expertise - literally wrote the book",
      "Deep understanding of scaling frontend orgs (500+ engineers)",
      "Accessibility expertise that keeps you compliant and inclusive",
      "Performance optimization at fintech scale",
    ],
    uniqueStrengths: [
      "Has built design systems at 3 major companies - knows what works",
      "Rare combination of technical depth + design sensibility",
      "Published author with strong personal brand",
    ],
    potentialImpact:
      "Would immediately level up your entire frontend org. His design system work could save 6+ months of effort.",
    rampUpTime: "3-4 weeks to understand domain, immediate impact on architecture",
    whyReachOut: [
      "His book just launched - he's in 'what's next' mode",
      "Stripe's recent layoffs affected his team's roadmap",
      "He's been speaking more at conferences (building external brand)",
      "Seattle-based but Stripe is pushing SF - he may want remote-first",
    ],
    timingSignals: [
      "Recent book launch = career reflection point",
      "Stripe layoffs impacted team scope",
      "4 years = typical tenure ceiling",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight:
          "Reference his book specifically - shows you've done homework. Ask a genuine question about a concept.",
        confidence: 92,
      },
      {
        category: "opportunity",
        insight: "He cares about mentorship - highlight your team growth trajectory and learning culture",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "Principal at Stripe is prestigious. Title and scope must be comparable or he won't engage.",
        confidence: 88,
      },
    ],
    outreachAngle:
      "Reference his book and ask a genuine question. Position the role as a chance to build a design system from first principles with full autonomy.",
    pitchPoints: [
      "Clean slate - design system built right from day 1",
      "Direct CEO/founder access for design decisions",
      "Opportunity to mentor and build a team",
      "Remote-friendly if Seattle is a must",
    ],
    potentialObjections: [
      {
        objection: "Stripe is the gold standard - why leave?",
        counter:
          "Gold standard means the interesting problems are solved. Here's where the next gold standard gets built.",
      },
      {
        objection: "I have a team of 12 here",
        counter: "You'd be building that team from scratch - hire exactly who you want, no inherited tech debt.",
      },
    ],
    estimatedSalary: { min: 320000, max: 400000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.3-0.5% at Series A",
    totalCompEstimate: "$450-550k total comp",
    status: "researching",
  },
  {
    id: "passive-3",
    name: "Emma Thompson",
    headline: "Senior Engineer @ Linear | Keyboard-first UX Expert",
    currentCompany: "Linear",
    currentRole: "Senior Engineer",
    location: "Remote (NYC)",
    yearsExperience: 6,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 94,
    tier: "rising_star",
    skillsOverlap: [
      { skill: "React", strength: 1.0 },
      { skill: "TypeScript", strength: 0.95 },
      { skill: "Performance", strength: 1.0 },
      { skill: "Next.js", strength: 0.85 },
    ],
    missingSkills: ["CI/CD", "GraphQL"],
    discoverySource: "twitter",
    discoveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    twitterUrl: "https://twitter.com/emmathompson",
    githubUrl: "https://github.com/emmathompson",
    highlights: [
      "Built Linear's real-time sync engine",
      "Created the keyboard shortcut system (most loved feature)",
      "Open source maintainer of popular animation lib (15k stars)",
    ],
    notableAchievements: [
      "Featured in Smashing Magazine",
      "CSS-Tricks contributor",
      "500+ Twitter threads on React performance",
    ],
    previousRoles: [
      {
        company: "Figma",
        role: "Software Engineer",
        duration: "2020-2022 (2 years)",
        highlights: ["Built multiplayer cursor system", "Optimized canvas rendering", "Part of 10x growth phase"],
      },
      {
        company: "Notion",
        role: "Junior Engineer",
        duration: "2018-2020 (2 years)",
        highlights: ["First frontend hire in NYC", "Built table view", "Promoted to mid-level in 18 months"],
      },
    ],
    tenure: "2 years at Linear",
    careerTrajectory: "rapid_growth",
    whatTheyBring: [
      "Best-in-class real-time sync experience (Linear is the benchmark)",
      "Performance obsession - she's why Linear feels instant",
      "Strong open source presence - great for employer brand",
      "Content creation skills - threads, articles, talks",
    ],
    uniqueStrengths: [
      "Keyboard-first UX design is her specialty - rare skill",
      "Built real-time systems at 2 top-tier companies",
      "Strong Twitter presence (10k+ followers) - attracts talent",
    ],
    potentialImpact:
      "Would transform your app's perceived performance. Her real-time sync expertise is immediately applicable.",
    rampUpTime: "2-3 weeks - very adaptable based on career history",
    whyReachOut: [
      "Linear is small team - limited growth headroom",
      "She's been tweeting about 'wanting to build something from 0 to 1 again'",
      "Recently passed 2-year mark at Linear",
      "Her open source work suggests she values ownership and autonomy",
    ],
    timingSignals: [
      "Recent tweets about 'building from scratch'",
      "2-year mark at Linear",
      "Open source activity increasing (side project focus)",
    ],
    openToOpportunities: "likely",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Engage with her Twitter content first - she values authentic connection. Don't cold pitch.",
        confidence: 90,
      },
      {
        category: "opportunity",
        insight: "She wants 0-to-1 building. Emphasize greenfield work and early-stage ownership.",
        confidence: 88,
      },
      {
        category: "timing",
        insight: "Her recent tweets suggest active reflection. Reach out within 1 week.",
        confidence: 82,
      },
    ],
    outreachAngle:
      "Engage with her Twitter content genuinely first. Then pitch the 0-to-1 opportunity with real technical challenges.",
    pitchPoints: [
      "0-to-1 building - exactly what she's been tweeting about",
      "Real-time collaboration problems to solve",
      "Open source friendly - time for contributions",
      "NYC-based team if she wants in-person energy",
    ],
    potentialObjections: [
      {
        objection: "Linear is incredible - best product I've worked on",
        counter:
          "Imagine being there when it was 5 people. That's us now. You'd help define what 'incredible' means here.",
      },
    ],
    estimatedSalary: { min: 200000, max: 260000, currency: "USD" },
    salarySource: "LinkedIn estimate",
    equityExpectation: "0.2-0.4% at Series A",
    totalCompEstimate: "$280-350k total comp",
    status: "outreach_sent",
    lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "passive-4",
    name: "James Wilson",
    headline: "Tech Lead @ Shopify | Checkout Platform",
    currentCompany: "Shopify",
    currentRole: "Tech Lead",
    location: "Toronto, Canada",
    yearsExperience: 7,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 92,
    tier: "rising_star",
    skillsOverlap: [
      { skill: "React", strength: 0.95 },
      { skill: "TypeScript", strength: 1.0 },
      { skill: "Testing", strength: 1.0 },
      { skill: "CI/CD", strength: 0.9 },
    ],
    missingSkills: ["Design Systems"],
    discoverySource: "linkedin",
    discoveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/jameswilson",
    highlights: [
      "Led Shopify Checkout rebuild (handles $200B+ GMV)",
      "Reduced checkout abandonment by 15%",
      "Built internal testing framework (used by 1000+ devs)",
    ],
    notableAchievements: ["Shopify Eng blog author", "Speaker at JSConf", "Ex-Amazon"],
    previousRoles: [
      {
        company: "Amazon",
        role: "SDE II",
        duration: "2017-2020 (3 years)",
        highlights: ["Prime checkout team", "Scaled to 200M+ customers", "Promoted in 2 years"],
      },
      {
        company: "IBM",
        role: "Software Developer",
        duration: "2015-2017 (2 years)",
        highlights: ["Cloud platform team", "Enterprise React adoption", "Internal tools"],
      },
    ],
    tenure: "4 years at Shopify",
    careerTrajectory: "steady",
    whatTheyBring: [
      "Battle-tested at insane scale ($200B+ GMV through his code)",
      "E-commerce domain expertise - checkout is the hardest problem",
      "Testing philosophy that would transform your quality culture",
      "Canada-based - potential cost savings vs. SF talent",
    ],
    uniqueStrengths: [
      "Checkout/payments expertise at massive scale",
      "Built testing infrastructure used by 1000+ devs",
      "Consistent career progression - Amazon to Shopify",
    ],
    potentialImpact:
      "If you have any e-commerce or payments work, he's a force multiplier. His testing frameworks alone would save months.",
    rampUpTime: "3-4 weeks - thorough but fast learner",
    whyReachOut: [
      "Shopify has had multiple rounds of layoffs - uncertainty",
      "Toronto market is less competitive than SF - easier close",
      "He's posted about wanting 'more ownership' recently",
      "4 years at Shopify - typical time to look around",
    ],
    timingSignals: [
      "Shopify layoffs creating uncertainty",
      "Recent LinkedIn posts about 'ownership'",
      "4-year tenure mark",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Toronto talent is relationship-driven. Offer a casual coffee chat, not a hard pitch.",
        confidence: 85,
      },
      {
        category: "opportunity",
        insight: "He values impact metrics - lead with the business problems you're solving.",
        confidence: 88,
      },
      {
        category: "risk",
        insight: "Shopify has strong retention. May need 6-12 month timeline to close.",
        confidence: 75,
      },
    ],
    outreachAngle:
      "Casual approach - coffee chat about checkout challenges. He's relationship-driven. Lead with interesting problems, not job pitch.",
    pitchPoints: [
      "More ownership than big company politics allow",
      "Direct impact on revenue metrics",
      "Smaller team = faster shipping",
      "CAD salary can be competitive with USD equity upside",
    ],
    potentialObjections: [
      {
        objection: "Shopify checkout is the biggest in the world - hard to match",
        counter:
          "Biggest means slow. We're shipping checkout improvements weekly. When's the last time you shipped to prod?",
      },
    ],
    estimatedSalary: { min: 180000, max: 230000, currency: "CAD" },
    salarySource: "Glassdoor",
    equityExpectation: "0.15-0.3% at Series A",
    totalCompEstimate: "$220-280k CAD total comp",
    status: "discovered",
  },
  {
    id: "passive-5",
    name: "Aisha Patel",
    headline: "Frontend Architect @ Figma | WebGL/Canvas Expert",
    currentCompany: "Figma",
    currentRole: "Frontend Architect",
    location: "San Francisco, CA",
    yearsExperience: 9,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 91,
    tier: "rising_star",
    skillsOverlap: [
      { skill: "TypeScript", strength: 1.0 },
      { skill: "Performance", strength: 1.0 },
      { skill: "React", strength: 0.85 },
    ],
    missingSkills: ["Next.js", "GraphQL"],
    discoverySource: "blog",
    discoveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    blogUrl: "https://aishapatel.dev/blog",
    githubUrl: "https://github.com/aishapatel",
    highlights: [
      "Built Figma's rendering engine optimizations",
      "Reduced canvas paint time by 40%",
      "WebGL expert with 3D visualization experience",
    ],
    notableAchievements: [
      "Figma Eng blog series on performance",
      "Created popular WebGL tutorial (1M views)",
      "UC Berkeley CS lecturer",
    ],
    previousRoles: [
      {
        company: "Adobe",
        role: "Staff Engineer",
        duration: "2018-2021 (3 years)",
        highlights: ["Photoshop web app lead", "Canvas rendering team", "Patents on image processing"],
      },
      {
        company: "Google",
        role: "Software Engineer",
        duration: "2015-2018 (3 years)",
        highlights: ["Google Maps WebGL team", "3D terrain rendering", "Published research paper"],
      },
    ],
    tenure: "3 years at Figma",
    careerTrajectory: "steady",
    whatTheyBring: [
      "World-class canvas/WebGL performance expertise",
      "Published researcher - brings rigor to technical decisions",
      "Teaching experience - can level up your whole team",
      "Adobe + Google + Figma pedigree is rare",
    ],
    uniqueStrengths: [
      "One of few people who can optimize WebGL at Figma's scale",
      "Academic rigor + shipping mentality combination",
      "Her tutorials have trained thousands of engineers",
    ],
    potentialImpact:
      "If you have any visualization, canvas, or performance-critical work, she's the best hire you could make.",
    rampUpTime: "4-5 weeks - deep domain expertise transfer needed",
    whyReachOut: [
      "Adobe acquisition of Figma fell through - future uncertain",
      "She's been teaching more - might want different challenges",
      "Her blog posts suggest interest in early-stage work",
      "Figma post-acquisition limbo is frustrating top talent",
    ],
    timingSignals: [
      "Adobe deal collapse created uncertainty",
      "Increased teaching/content creation",
      "Blog posts about 'startup energy'",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "She's technical-first. Lead with a specific hard problem you're facing. Ask for her opinion.",
        confidence: 92,
      },
      {
        category: "opportunity",
        insight: "Teaching is important to her. Offer to support her course work or speaking.",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "Figma pays extremely well. Need strong equity story to compete.",
        confidence: 88,
      },
    ],
    outreachAngle:
      "Technical approach - share a specific performance challenge and ask her opinion. She loves solving hard problems.",
    pitchPoints: [
      "Hard technical problems that need her expertise",
      "Support for teaching/content creation",
      "Path to principal/fellow level",
      "Equity story for early-stage upside",
    ],
    potentialObjections: [
      {
        objection: "Figma's canvas is the most sophisticated in the world",
        counter: "And you've solved those problems. What's the next frontier for you? We have unsolved ones.",
      },
    ],
    estimatedSalary: { min: 300000, max: 380000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.3-0.6% at Series A",
    totalCompEstimate: "$450-550k total comp",
    status: "responded",
    lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "passive-6",
    name: "Daniel Kim",
    headline: "Senior SWE @ Netflix | Video Player Team",
    currentCompany: "Netflix",
    currentRole: "Senior Software Engineer",
    location: "Los Angeles, CA",
    yearsExperience: 5,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 88,
    tier: "hidden_gem",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 0.95 },
      { skill: "Performance", strength: 1.0 },
      { skill: "Testing", strength: 0.8 },
    ],
    missingSkills: ["Next.js", "Design Systems"],
    discoverySource: "github",
    discoveredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    githubUrl: "https://github.com/danielkim",
    highlights: [
      "Built Netflix's adaptive bitrate switching UI",
      "Optimized video player for 200M+ devices",
      "Created internal React hooks library",
    ],
    notableAchievements: [
      "Netflix Tech Blog contributor",
      "Created video.js plugin (5k stars)",
      "UCLA CS teaching assistant",
    ],
    previousRoles: [
      {
        company: "YouTube",
        role: "Software Engineer",
        duration: "2019-2022 (3 years)",
        highlights: ["Video player team", "Reduced buffering by 20%", "Cross-platform player work"],
      },
    ],
    tenure: "2 years at Netflix",
    careerTrajectory: "rapid_growth",
    whatTheyBring: [
      "Video player expertise at YouTube AND Netflix scale",
      "Performance optimization for 200M+ devices",
      "Open source contributor - gives back to community",
      "LA-based - less competition than SF",
    ],
    uniqueStrengths: [
      "Media playback expertise at two biggest platforms",
      "Young but rapidly advancing career",
      "Strong open source presence",
    ],
    potentialImpact:
      "If you have any media, streaming, or complex state management, he's already solved your problems at scale.",
    rampUpTime: "2-3 weeks - fast learner, young and hungry",
    whyReachOut: [
      "Netflix is known for 'keeper test' pressure - high stress",
      "LA talent pool is smaller - less competitive offers",
      "His GitHub activity suggests side project itch",
      "5 years experience = ready for tech lead but Netflix is flat",
    ],
    timingSignals: [
      "Netflix 'keeper test' culture creates burnout",
      "Ready for leadership but Netflix is flat org",
      "Active on GitHub = wants to build",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "He's got open source cred - contribute to one of his projects first, then reach out.",
        confidence: 82,
      },
      {
        category: "opportunity",
        insight: "He's ready for tech lead. Netflix doesn't really have that path. Offer it.",
        confidence: 88,
      },
      {
        category: "timing",
        insight: "LA engineers often feel disconnected from Bay Area HQs. Play up remote-first or LA presence.",
        confidence: 78,
      },
    ],
    outreachAngle:
      "Contribute to his open source project first, then reach out. Offer tech lead path that Netflix doesn't provide.",
    pitchPoints: [
      "Tech lead track - own a team",
      "LA-friendly (or remote)",
      "Open source time encouraged",
      "Less 'keeper test' pressure",
    ],
    potentialObjections: [
      {
        objection: "Netflix brand is hard to beat",
        counter: "Brand is great, but you're senior. What's your growth path there? Here you'd be leading in 6 months.",
      },
    ],
    estimatedSalary: { min: 220000, max: 280000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.15-0.25% at Series A",
    totalCompEstimate: "$300-380k total comp",
    status: "discovered",
  },
  {
    id: "passive-7",
    name: "Sarah O'Brien",
    headline: "Staff Engineer @ Airbnb | Experimentation Platform",
    currentCompany: "Airbnb",
    currentRole: "Staff Engineer",
    location: "San Francisco, CA",
    yearsExperience: 8,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 87,
    tier: "hidden_gem",
    skillsOverlap: [
      { skill: "React", strength: 0.95 },
      { skill: "TypeScript", strength: 0.9 },
      { skill: "Testing", strength: 1.0 },
      { skill: "CI/CD", strength: 0.95 },
    ],
    missingSkills: ["GraphQL", "Design Systems"],
    discoverySource: "referral",
    discoveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/sarahobrien",
    highlights: [
      "Built Airbnb's A/B testing platform (runs 1000+ experiments/month)",
      "Created feature flag system used company-wide",
      "Led frontend reliability initiative (99.99% uptime)",
    ],
    notableAchievements: ["Internal innovation award winner", "Mentored 15+ engineers", "Ex-Uber"],
    previousRoles: [
      {
        company: "Uber",
        role: "Senior Engineer",
        duration: "2018-2020 (2 years)",
        highlights: ["Experimentation platform", "Rider app A/B testing", "Rapid promotion"],
      },
      {
        company: "Twitter",
        role: "Software Engineer",
        duration: "2016-2018 (2 years)",
        highlights: ["Timeline experiments", "Feature flags system", "Growth team"],
      },
    ],
    tenure: "4 years at Airbnb",
    careerTrajectory: "steady",
    whatTheyBring: [
      "A/B testing and experimentation infrastructure expertise",
      "Feature flag systems at scale (1000+ experiments/month)",
      "Reliability engineering mindset - 99.99% uptime track record",
      "Three top-tier companies = broad perspective",
    ],
    uniqueStrengths: [
      "Experimentation platform expertise at 3 major companies",
      "Rare combination of platform + product thinking",
      "Strong mentorship - 15+ engineers developed",
    ],
    potentialImpact:
      "Would transform your experimentation and reliability culture. Her A/B testing infrastructure could accelerate product iteration 10x.",
    rampUpTime: "3-4 weeks - platform work transfers well",
    whyReachOut: [
      "Internal referral says she's 'looking for something new'",
      "Airbnb travel downturn = less exciting problems",
      "She's been more active on LinkedIn lately",
      "4 years = equity cliff + natural reflection point",
    ],
    timingSignals: ["Referral confirms she's open", "Airbnb travel slowdown", "4-year equity cliff"],
    openToOpportunities: "likely",
    aiSuggestions: [
      {
        category: "approach",
        insight: "You have a warm referral - use it. Have the mutual connection make the intro.",
        confidence: 95,
      },
      {
        category: "opportunity",
        insight: "She values mentorship. Highlight team building and growing engineers.",
        confidence: 88,
      },
      {
        category: "timing",
        insight: "Referral says she's actively looking. Move fast - 1-2 week decision window.",
        confidence: 90,
      },
    ],
    outreachAngle: "Warm intro via referral. She's actively looking per insider. Move fast with strong offer.",
    pitchPoints: [
      "Build experimentation from scratch",
      "Team building opportunity",
      "Active product - more experiments to run",
      "Equity upside vs. late-stage Airbnb",
    ],
    potentialObjections: [
      {
        objection: "Airbnb experimentation is industry-leading",
        counter: "You built it. Now it runs itself. Don't you miss the building phase?",
      },
    ],
    estimatedSalary: { min: 270000, max: 340000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.2-0.4% at Series A",
    totalCompEstimate: "$380-450k total comp",
    status: "interviewing",
    lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "passive-8",
    name: "Alex Rivera",
    headline: "Lead Engineer @ Discord | Real-time Systems",
    currentCompany: "Discord",
    currentRole: "Lead Engineer",
    location: "Remote (Austin, TX)",
    yearsExperience: 6,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 86,
    tier: "hidden_gem",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 1.0 },
      { skill: "Performance", strength: 0.95 },
    ],
    missingSkills: ["Next.js", "Accessibility"],
    discoverySource: "twitter",
    discoveredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    twitterUrl: "https://twitter.com/alexrivera",
    githubUrl: "https://github.com/alexrivera",
    highlights: [
      "Built Discord's voice channel UI",
      "Optimized real-time message rendering",
      "Created WebSocket abstraction layer used company-wide",
    ],
    notableAchievements: [
      "Discord Nitro Eng blog author",
      "Created popular state management lib (8k stars)",
      "Twitch partner (coding streams)",
    ],
    previousRoles: [
      {
        company: "Slack",
        role: "Software Engineer",
        duration: "2018-2021 (3 years)",
        highlights: ["Message composer team", "Real-time sync", "Promoted to senior"],
      },
    ],
    tenure: "3 years at Discord",
    careerTrajectory: "rapid_growth",
    whatTheyBring: [
      "Real-time systems expertise at two chat leaders (Slack + Discord)",
      "WebSocket and state management library author",
      "Content creation skills - Twitch + blog",
      "Austin-based - cost-effective market",
    ],
    uniqueStrengths: [
      "Built real-time UX at both Slack and Discord",
      "Open source library author (8k stars)",
      "Twitch presence = strong communication skills",
    ],
    potentialImpact:
      "Any real-time features would benefit from his expertise. His WebSocket abstraction alone could save months of work.",
    rampUpTime: "2-3 weeks - fast, adaptable",
    whyReachOut: [
      "Discord is fully remote - he might want hybrid/office culture",
      "His Twitch streams suggest he wants more visibility",
      "Austin is growing but still less competitive than SF",
      "His library is popular but Discord doesn't let him promote it",
    ],
    timingSignals: [
      "Wants more public visibility (Twitch streams)",
      "Austin talent is less saturated",
      "Open source work suggests entrepreneurial itch",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Watch his Twitch stream and engage genuinely. He values authentic connection.",
        confidence: 85,
      },
      {
        category: "opportunity",
        insight: "Let him keep streaming and even promote it. Discord probably restricts this.",
        confidence: 82,
      },
      {
        category: "risk",
        insight: "Discord pays well and is remote. Need strong differentiator beyond money.",
        confidence: 78,
      },
    ],
    outreachAngle:
      "Engage on Twitch first. Offer to let him keep streaming and even support it - Discord probably has restrictions.",
    pitchPoints: [
      "Support for content creation/streaming",
      "Austin presence if he wants office time",
      "His library could become official company OSS",
      "More ownership than big company allows",
    ],
    potentialObjections: [
      {
        objection: "Discord's real-time is unmatched",
        counter: "And you've mastered it. What's the next challenge? We've got problems you haven't solved yet.",
      },
    ],
    estimatedSalary: { min: 200000, max: 260000, currency: "USD" },
    salarySource: "LinkedIn estimate",
    equityExpectation: "0.15-0.3% at Series A",
    totalCompEstimate: "$280-350k total comp",
    status: "discovered",
  },
  {
    id: "passive-9",
    name: "Priya Sharma",
    headline: "Senior Frontend @ Notion | Database Views",
    currentCompany: "Notion",
    currentRole: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    yearsExperience: 5,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 85,
    tier: "hidden_gem",
    skillsOverlap: [
      { skill: "React", strength: 1.0 },
      { skill: "TypeScript", strength: 0.9 },
      { skill: "Accessibility", strength: 0.85 },
    ],
    missingSkills: ["Next.js", "CI/CD", "GraphQL"],
    discoverySource: "linkedin",
    discoveredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    highlights: [
      "Built Notion's table view from scratch",
      "Created formula editor with autocomplete",
      "Led mobile web initiative (50% faster load)",
    ],
    notableAchievements: [
      "IIT Delhi CS graduate",
      "Open source contributor to ProseMirror",
      "Technical writer for Notion blog",
    ],
    previousRoles: [
      {
        company: "Atlassian",
        role: "Software Engineer",
        duration: "2019-2022 (3 years)",
        highlights: ["Confluence editor team", "Rich text editing", "Mobile web performance"],
      },
    ],
    tenure: "2 years at Notion",
    careerTrajectory: "rapid_growth",
    whatTheyBring: [
      "Complex editor/table view expertise (Notion + Confluence)",
      "Rich text and formula editing experience",
      "Mobile web optimization skills",
      "Strong educational background (IIT Delhi)",
    ],
    uniqueStrengths: [
      "Built complex data views at two productivity leaders",
      "ProseMirror contributor - deep editor knowledge",
      "IIT Delhi = top 0.1% of Indian engineers",
    ],
    potentialImpact:
      "Any complex data display, tables, or editor work would benefit enormously from her specific expertise.",
    rampUpTime: "3-4 weeks - needs domain context",
    whyReachOut: [
      "Notion's growth has slowed - less exciting phase",
      "She's been contributing more to open source (side project energy)",
      "Her blog posts suggest she wants more technical depth",
      "2 years = natural reflection point",
    ],
    timingSignals: ["Notion growth slowdown", "Increased OSS activity", "Blog posts about 'deep technical work'"],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Reference her ProseMirror contributions - shows you've done research.",
        confidence: 88,
      },
      {
        category: "opportunity",
        insight: "She wants technical depth. Position role as architecturally complex.",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "May need visa sponsorship. Confirm early in process.",
        confidence: 70,
      },
    ],
    outreachAngle:
      "Reference her ProseMirror work specifically. Pitch deep technical challenges that Notion's scale doesn't allow her to focus on.",
    pitchPoints: [
      "Deep technical work - not just feature shipping",
      "Editor/table challenges if relevant",
      "Visa sponsorship if needed",
      "Path to staff engineer",
    ],
    potentialObjections: [
      {
        objection: "Notion tables are world-class",
        counter: "You built them. Now you're maintaining them. What's next for your growth?",
      },
    ],
    estimatedSalary: { min: 190000, max: 250000, currency: "USD" },
    salarySource: "Glassdoor",
    equityExpectation: "0.15-0.25% at Series A",
    totalCompEstimate: "$260-330k total comp",
    status: "discovered",
  },
  {
    id: "passive-10",
    name: "Michael Torres",
    headline: "Frontend Team Lead @ Datadog | Dashboards",
    currentCompany: "Datadog",
    currentRole: "Team Lead",
    location: "New York, NY",
    yearsExperience: 7,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 84,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 0.95 },
      { skill: "Performance", strength: 0.9 },
      { skill: "Testing", strength: 0.85 },
    ],
    missingSkills: ["Next.js", "Design Systems"],
    discoverySource: "conference",
    discoveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/michaeltorres",
    highlights: ["Built Datadog's dashboard builder", "Created real-time charting library", "Led team of 8 engineers"],
    notableAchievements: ["Datadog Eng blog contributor", "NYU adjunct professor", "Ex-Bloomberg"],
    previousRoles: [
      {
        company: "Bloomberg",
        role: "Senior Engineer",
        duration: "2017-2020 (3 years)",
        highlights: ["Terminal dashboard team", "Real-time financial charts", "Performance optimization"],
      },
      {
        company: "Palantir",
        role: "Software Engineer",
        duration: "2015-2017 (2 years)",
        highlights: ["Data visualization", "Foundry platform", "Government contracts"],
      },
    ],
    tenure: "4 years at Datadog",
    careerTrajectory: "steady",
    whatTheyBring: [
      "Dashboard and charting expertise at scale",
      "Team leadership experience (8 engineers)",
      "Teaching ability (NYU adjunct)",
      "NYC-based - strong local network",
    ],
    uniqueStrengths: [
      "Data visualization at Bloomberg, Palantir, and Datadog",
      "Rare teaching + engineering combination",
      "NYC network is valuable for hiring",
    ],
    potentialImpact:
      "Any analytics, dashboards, or data visualization work would benefit from his specialized expertise.",
    rampUpTime: "4-5 weeks - needs to understand product domain",
    whyReachOut: [
      "Datadog is public and mature - less exciting growth phase",
      "He teaches on the side - might want more impact",
      "NYC talent pool values work-life balance",
      "4 years = typical time to look around",
    ],
    timingSignals: [
      "Datadog post-IPO = mature company",
      "Teaching suggests desire for broader impact",
      "4-year tenure mark",
    ],
    openToOpportunities: "unknown",
    aiSuggestions: [
      {
        category: "approach",
        insight: "He's an educator. Ask if he'd do a lunch and learn with your team - low pressure way in.",
        confidence: 80,
      },
      {
        category: "opportunity",
        insight: "Highlight mentorship and team building - aligns with his teaching interests.",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "NYC talent is expensive and has options. Need competitive package.",
        confidence: 75,
      },
    ],
    outreachAngle:
      "Invite him to do a guest talk/lunch and learn. Low pressure, lets him evaluate your team. Then pivot to opportunity.",
    pitchPoints: [
      "Build a team from scratch",
      "Teaching/mentorship encouraged",
      "NYC office or hybrid",
      "Dashboard/visualization challenges",
    ],
    potentialObjections: [
      {
        objection: "Datadog dashboards are best-in-class",
        counter:
          "For observability, yes. But there's a whole world of dashboards to build. And you'd own the vision here.",
      },
    ],
    estimatedSalary: { min: 230000, max: 290000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.15-0.3% at Series A",
    totalCompEstimate: "$320-400k total comp",
    status: "discovered",
  },
  {
    id: "passive-11",
    name: "Jennifer Lee",
    headline: "Senior SWE @ Coinbase | Trading Platform",
    currentCompany: "Coinbase",
    currentRole: "Senior Software Engineer",
    location: "Remote (Denver, CO)",
    yearsExperience: 5,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 83,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.95 },
      { skill: "TypeScript", strength: 0.9 },
      { skill: "Testing", strength: 0.9 },
    ],
    missingSkills: ["Next.js", "Performance", "Design Systems"],
    discoverySource: "github",
    discoveredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    githubUrl: "https://github.com/jenniferlee",
    highlights: [
      "Built Coinbase Pro trading interface",
      "Created real-time price chart components",
      "Led security-focused frontend initiative",
    ],
    notableAchievements: [
      "Web3 frontend expert",
      "Created popular React hooks collection (3k stars)",
      "Stanford CS graduate",
    ],
    previousRoles: [
      {
        company: "Robinhood",
        role: "Software Engineer",
        duration: "2019-2022 (3 years)",
        highlights: ["Stock trading UI", "Real-time charts", "High-frequency updates"],
      },
    ],
    tenure: "2 years at Coinbase",
    careerTrajectory: "steady",
    whatTheyBring: [
      "Trading platform expertise (Robinhood + Coinbase)",
      "Real-time financial UI experience",
      "Security-first mindset for sensitive data",
      "Web3 knowledge if relevant",
    ],
    uniqueStrengths: [
      "Trading UI at two major fintech companies",
      "Security + compliance experience",
      "Stanford pedigree",
    ],
    potentialImpact:
      "If you have any financial, real-time data, or security-sensitive features, she has directly applicable experience.",
    rampUpTime: "2-3 weeks - adaptable",
    whyReachOut: [
      "Crypto winter has made Coinbase less exciting",
      "Denver = less competitive market",
      "Her GitHub activity suggests side projects (wants to build)",
      "Stanford network is always looking for startup opportunities",
    ],
    timingSignals: [
      "Crypto winter at Coinbase",
      "Active on GitHub = building energy",
      "Denver market less competitive",
    ],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Reference her React hooks library. She's proud of her OSS work.",
        confidence: 85,
      },
      {
        category: "opportunity",
        insight: "Crypto uncertainty makes stable equity more attractive. Highlight your business model.",
        confidence: 82,
      },
      {
        category: "timing",
        insight: "Coinbase layoffs created uncertainty. Good time to reach out.",
        confidence: 80,
      },
    ],
    outreachAngle: "Reference her hooks library. Highlight stability vs. crypto volatility. Denver-friendly.",
    pitchPoints: [
      "Stable business vs. crypto volatility",
      "Real-time challenges without compliance overhead",
      "Denver/remote friendly",
      "OSS contributions encouraged",
    ],
    potentialObjections: [
      {
        objection: "Coinbase Pro is high-stakes, high-scale",
        counter: "High-stakes is stressful. What if you could build something exciting without the regulatory weight?",
      },
    ],
    estimatedSalary: { min: 200000, max: 260000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.1-0.2% at Series A",
    totalCompEstimate: "$280-350k total comp",
    status: "discovered",
  },
  {
    id: "passive-12",
    name: "Chris Anderson",
    headline: "Staff Engineer @ Slack | Messaging UI",
    currentCompany: "Slack",
    currentRole: "Staff Engineer",
    location: "San Francisco, CA",
    yearsExperience: 9,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 82,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 0.85 },
      { skill: "Accessibility", strength: 1.0 },
      { skill: "Performance", strength: 0.8 },
    ],
    missingSkills: ["Next.js", "GraphQL"],
    discoverySource: "linkedin",
    discoveredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/chrisanderson",
    highlights: [
      "Built Slack's message composer",
      "Led accessibility compliance initiative (WCAG AAA)",
      "Created virtualized list rendering for channels",
    ],
    notableAchievements: ["Slack Eng blog author", "A11y advocate and speaker", "Ex-Microsoft"],
    previousRoles: [
      {
        company: "Microsoft",
        role: "Senior Engineer",
        duration: "2015-2019 (4 years)",
        highlights: ["Office Online team", "Accessibility lead", "Cross-platform components"],
      },
      {
        company: "Adobe",
        role: "Software Engineer",
        duration: "2012-2015 (3 years)",
        highlights: ["Creative Cloud web apps", "Performance optimization", "First frontend hire"],
      },
    ],
    tenure: "5 years at Slack (now Salesforce)",
    careerTrajectory: "steady",
    whatTheyBring: [
      "World-class accessibility expertise (WCAG AAA)",
      "Messaging/composer UI at scale",
      "Virtualization for performance",
      "15+ years of experience",
    ],
    uniqueStrengths: [
      "A11y expertise is rare and increasingly required",
      "Microsoft + Slack = enterprise-grade thinking",
      "Virtualization knowledge for performance",
    ],
    potentialImpact:
      "If you care about accessibility (you should), he's the best hire. Also excellent for messaging/real-time features.",
    rampUpTime: "4-5 weeks - senior hire needs context",
    whyReachOut: [
      "Slack is now Salesforce - corporate culture shift",
      "5 years = definitely time to look around",
      "A11y advocates often feel undervalued at big companies",
      "His speaking suggests he wants broader influence",
    ],
    timingSignals: ["Salesforce acquisition = culture change", "5-year tenure is long", "A11y work often undervalued"],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Lead with accessibility mission. He cares deeply - show you do too.",
        confidence: 92,
      },
      {
        category: "opportunity",
        insight: "He might be frustrated with Salesforce bureaucracy. Highlight startup speed.",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "Very senior - might have golden handcuffs. Need strong equity story.",
        confidence: 80,
      },
    ],
    outreachAngle:
      "Lead with your accessibility commitment. He's a true believer - show you are too. Contrast startup speed vs. Salesforce bureaucracy.",
    pitchPoints: [
      "Accessibility-first culture",
      "Escape Salesforce bureaucracy",
      "Build messaging/composer if relevant",
      "Influence company direction",
    ],
    potentialObjections: [
      {
        objection: "Slack's composer is iconic",
        counter: "And now it's Salesforce's composer. When's the last time you shipped something you were proud of?",
      },
    ],
    estimatedSalary: { min: 280000, max: 350000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.2-0.4% at Series A",
    totalCompEstimate: "$400-500k total comp",
    status: "discovered",
  },
  {
    id: "passive-13",
    name: "Rachel Green",
    headline: "Senior Frontend @ Spotify | Now Playing",
    currentCompany: "Spotify",
    currentRole: "Senior Frontend Engineer",
    location: "Stockholm, Sweden",
    yearsExperience: 6,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 81,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 0.9 },
      { skill: "Performance", strength: 0.85 },
    ],
    missingSkills: ["Next.js", "Testing", "CI/CD"],
    discoverySource: "blog",
    discoveredAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    blogUrl: "https://rachelgreen.dev",
    githubUrl: "https://github.com/rachelgreen",
    highlights: [
      "Built Spotify's Now Playing experience",
      "Created cross-platform component library",
      "Led dark mode implementation (loved by users)",
    ],
    notableAchievements: ["Spotify Design blog contributor", "Speaker at Nordic.js", "KTH Royal Institute graduate"],
    previousRoles: [
      {
        company: "Klarna",
        role: "Software Engineer",
        duration: "2018-2021 (3 years)",
        highlights: ["Checkout UI team", "Payment flows", "Nordic fintech experience"],
      },
    ],
    tenure: "3 years at Spotify",
    careerTrajectory: "steady",
    whatTheyBring: [
      "Consumer product polish (Now Playing is beloved)",
      "Cross-platform component library experience",
      "European work culture perspective",
      "Fintech + consumer experience",
    ],
    uniqueStrengths: [
      "Built one of the most-used music UIs in the world",
      "Dark mode expertise (increasingly important)",
      "European = potentially cost-effective",
    ],
    potentialImpact:
      "If you care about product polish and user delight, she has the Spotify playbook. Cross-platform expertise is bonus.",
    rampUpTime: "3-4 weeks - needs US context if relocating",
    whyReachOut: [
      "Stockholm is small market - might want US exposure",
      "Spotify's growth has plateaued",
      "Her blog suggests she wants new challenges",
      "European engineers are often undervalued by US companies",
    ],
    timingSignals: ["Stockholm market is limited", "Spotify plateau phase", "Blog posts about 'new challenges'"],
    openToOpportunities: "unknown",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Reference her blog posts specifically. She puts effort into writing - appreciate it.",
        confidence: 85,
      },
      {
        category: "opportunity",
        insight: "US exposure might be appealing. Offer visa sponsorship upfront.",
        confidence: 78,
      },
      {
        category: "risk",
        insight: "Relocation is hard. Consider remote-first or EU entity as option.",
        confidence: 82,
      },
    ],
    outreachAngle:
      "Reference her blog. Offer US exposure with visa sponsorship, or remote-first if she prefers Stockholm.",
    pitchPoints: [
      "US market exposure",
      "Visa sponsorship available",
      "Remote-first if preferred",
      "Consumer product polish valued",
    ],
    potentialObjections: [
      {
        objection: "Spotify is a dream company",
        counter: "Dream companies plateau. What's your growth path there? Here you'd define the product.",
      },
    ],
    estimatedSalary: { min: 90000, max: 120000, currency: "EUR" },
    salarySource: "Glassdoor",
    equityExpectation: "0.1-0.2% at Series A (adjust for EU)",
    totalCompEstimate: "$140-180k USD equivalent total comp",
    status: "discovered",
  },
  {
    id: "passive-14",
    name: "Kevin Nguyen",
    headline: "Frontend Lead @ Uber | Driver App",
    currentCompany: "Uber",
    currentRole: "Frontend Lead",
    location: "San Francisco, CA",
    yearsExperience: 7,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 80,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.85 },
      { skill: "TypeScript", strength: 0.9 },
      { skill: "Performance", strength: 0.95 },
    ],
    missingSkills: ["Next.js", "Design Systems", "Accessibility"],
    discoverySource: "referral",
    discoveredAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    linkedinUrl: "https://linkedin.com/in/kevinnguyen",
    highlights: [
      "Led Uber Driver app frontend rebuild",
      "Reduced app crash rate by 70%",
      "Created offline-first architecture",
    ],
    notableAchievements: ["Uber Eng blog author", "React Native expert", "Ex-Lyft"],
    previousRoles: [
      {
        company: "Lyft",
        role: "Senior Engineer",
        duration: "2017-2020 (3 years)",
        highlights: ["Driver app team", "Real-time location UI", "Performance lead"],
      },
      {
        company: "Square",
        role: "Software Engineer",
        duration: "2015-2017 (2 years)",
        highlights: ["Point of sale UI", "Offline-first payments", "React Native early adopter"],
      },
    ],
    tenure: "4 years at Uber",
    careerTrajectory: "steady",
    whatTheyBring: [
      "Offline-first architecture expertise",
      "React Native mastery (if mobile is relevant)",
      "Reliability engineering (70% crash reduction)",
      "Rideshare domain at both major companies",
    ],
    uniqueStrengths: [
      "Worked on driver apps at both Uber and Lyft",
      "Offline-first is hard and rare expertise",
      "Reliability track record is impressive",
    ],
    potentialImpact:
      "If you need offline capabilities, mobile excellence, or reliability improvements, he's directly qualified.",
    rampUpTime: "3-4 weeks",
    whyReachOut: [
      "Warm referral available",
      "Uber's culture is notoriously intense - might want change",
      "4 years = typical transition time",
      "Lyft to Uber shows he's willing to move for right opportunity",
    ],
    timingSignals: ["Referral confirms openness", "Uber culture burnout is common", "4-year tenure mark"],
    openToOpportunities: "likely",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Use the warm referral. He responds better to trusted introductions.",
        confidence: 90,
      },
      {
        category: "opportunity",
        insight: "Uber is intense. Highlight work-life balance and sustainable pace.",
        confidence: 85,
      },
      {
        category: "timing",
        insight: "Referral says he's actively exploring. Move within 2 weeks.",
        confidence: 88,
      },
    ],
    outreachAngle:
      "Warm intro via referral. Highlight sustainable pace vs. Uber grind. Offline-first challenges if relevant.",
    pitchPoints: [
      "Sustainable pace vs. Uber intensity",
      "Offline-first challenges if relevant",
      "Team building opportunity",
      "SF-based office",
    ],
    potentialObjections: [
      {
        objection: "Uber scale is hard to match",
        counter: "Scale also means politics and slow shipping. When's the last time your code went to prod in a day?",
      },
    ],
    estimatedSalary: { min: 250000, max: 320000, currency: "USD" },
    salarySource: "Levels.fyi",
    equityExpectation: "0.15-0.3% at Series A",
    totalCompEstimate: "$350-420k total comp",
    status: "discovered",
  },
  {
    id: "passive-15",
    name: "Isabella Martinez",
    headline: "Senior Engineer @ TikTok | Creator Tools",
    currentCompany: "TikTok",
    currentRole: "Senior Software Engineer",
    location: "Los Angeles, CA",
    yearsExperience: 4,
    avatarUrl: "/placeholder.svg?height=80&width=80",
    matchScore: 80,
    tier: "sleeper",
    skillsOverlap: [
      { skill: "React", strength: 0.9 },
      { skill: "TypeScript", strength: 0.85 },
      { skill: "Performance", strength: 0.8 },
    ],
    missingSkills: ["Next.js", "Testing", "Design Systems"],
    discoverySource: "twitter",
    discoveredAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    twitterUrl: "https://twitter.com/isabellamartinez",
    githubUrl: "https://github.com/isabellamartinez",
    highlights: [
      "Built TikTok's video editor UI",
      "Created effects preview system",
      "Led creator monetization dashboard",
    ],
    notableAchievements: [
      "USC CS graduate",
      "TikTok Creator Fund launch team",
      "Popular tech TikToker (50k followers)",
    ],
    previousRoles: [
      {
        company: "Snap",
        role: "Software Engineer",
        duration: "2020-2022 (2 years)",
        highlights: ["Lens Studio team", "AR effects UI", "Creator tools"],
      },
    ],
    tenure: "2 years at TikTok",
    careerTrajectory: "rapid_growth",
    whatTheyBring: [
      "Creator tools expertise (TikTok + Snap)",
      "Video editor UI experience",
      "Content creation skills (50k TikTok followers)",
      "Young, high-energy, fast learner",
    ],
    uniqueStrengths: [
      "Creator economy insider - understands both sides",
      "AR/video expertise at two major platforms",
      "Own audience = employer brand value",
    ],
    potentialImpact:
      "If you have any creator tools, video editing, or need someone who understands creators, she's ideal.",
    rampUpTime: "2-3 weeks - fast, eager",
    whyReachOut: [
      "TikTok's US future is uncertain (potential ban)",
      "LA talent pool is less competitive",
      "She's a creator herself - might want to build for creators",
      "Young career = hungry for growth opportunities",
    ],
    timingSignals: ["TikTok US uncertainty", "Creator herself = passion alignment", "LA market less competitive"],
    openToOpportunities: "possible",
    aiSuggestions: [
      {
        category: "approach",
        insight: "Engage with her TikTok content first. She's a creator - authenticity matters.",
        confidence: 88,
      },
      {
        category: "opportunity",
        insight: "TikTok ban uncertainty is real. Highlight US-based stability.",
        confidence: 85,
      },
      {
        category: "risk",
        insight: "Young and might have FOMO. Make the opportunity feel exciting and urgent.",
        confidence: 75,
      },
    ],
    outreachAngle:
      "Engage with her TikTok first. Highlight US stability vs. TikTok uncertainty. Creator tools focus if relevant.",
    pitchPoints: [
      "US-based stability vs. TikTok uncertainty",
      "Creator tools focus",
      "LA office/remote",
      "Content creation encouraged",
    ],
    potentialObjections: [
      {
        objection: "TikTok is the hottest company right now",
        counter: "Hottest until Congress says otherwise. We're not worried about getting banned.",
      },
    ],
    estimatedSalary: { min: 180000, max: 240000, currency: "USD" },
    salarySource: "Glassdoor",
    equityExpectation: "0.1-0.2% at Series A",
    totalCompEstimate: "$250-320k total comp",
    status: "discovered",
  },
]
