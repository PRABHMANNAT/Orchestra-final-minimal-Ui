
export type BlueprintTask = {
    id: string
    type: "baseline" | "stretch" | "chaos"
    title: string
    description: string
    duration: string
    failureModes: string[]
}

export type InterviewBlueprint = {
    id: string
    role: string
    seniority: string
    summary: string
    constraints: {
        time: string
        mode: "Async" | "Live"
        tools: string[]
        focus: string
    }
    tasks: BlueprintTask[]
    rubric: {
        category: string
        weight: string
        criteria: string
    }[]
    redFlags: string[]
    proofDefinition: string
}

// -- Task Libraries --

const ENGINEERING_TASKS = [
    { title: "Latency Debugging", desc: "Investigate a slow API endpoint in a mock service. Identify N+1 query.", duration: "20 mins", fm: ["Micro-optimizing unrelated code", "Ignoring database logs"] },
    { title: "System Scaling", desc: "Propose a caching strategy (Redis) for 100x traffic spike.", duration: "15 mins", fm: ["Adding complexity without need", "Ignoring cache invalidation"] },
    { title: "Legacy Refactor", desc: "Refactor a 500-line monolithic function into modular services.", duration: "30 mins", fm: ["Breaking existing tests", "Over-abstraction"] },
    { title: "API Design", desc: "Design a RESTful API for a social feed with pagination.", duration: "25 mins", fm: ["Missing error handling", "Complex nested routes"] },
]

const PM_TASKS = [
    { title: "PRD Writing", desc: "Draft a PRD for a 'Dark Mode' feature. Define success metrics.", duration: "25 mins", fm: ["Vague requirements", "Ignoring edge cases"] },
    { title: "Metric Analysis", desc: "Analyze a drop in retention. Propose 3 hypotheses.", duration: "20 mins", fm: ["Assuming correlation is causation", "Ignoring segmentation"] },
    { title: "Stakeholder Email", desc: "Write an email to Engineering explaining why a launch is delayed.", duration: "15 mins", fm: ["Blaming the team", "Vague new timeline"] },
    { title: "Roadmap Prioritization", desc: "Prioritize 10 feature requests with limited engineering bandwidth.", duration: "20 mins", fm: ["Using only 'gut feel'", "Ignoring business value"] },
]

const DESIGN_TASKS = [
    { title: "App Critique", desc: "Critique the UX of a popular app (e.g. Spotify). Identify 3 friction points.", duration: "20 mins", fm: ["Focusing only on UI/visuals", "Vague 'it feels bad' comments"] },
    { title: "System UI", desc: "Design a consistent button component set (Primary, Secondary, Ghost).", duration: "30 mins", fm: ["Inconsistent padding", "Ignoring accessibility"] },
    { title: "Handoff Spec", desc: "Prepare a Figma file for engineering handoff. Annotate interactions.", duration: "25 mins", fm: ["Missing edge cases", "Assuming dev knowledge"] },
]

const SALES_TASKS = [
    { title: "Cold Outreach", desc: "Draft a 3-step email sequence for a skeptical Series A founder.", duration: "15 mins", fm: ["Generic templates", "Feature dumping"] },
    { title: "Discovery Call", desc: "Simulate a discovery call. Identify budget, authority, need, timing.", duration: "20 mins", fm: ["Talking more than listening", "Interrogating the prospect"] },
    { title: "Objection Handling", desc: "Handle 'Your price is too high' objection.", duration: "10 mins", fm: ["Defensive response", "Immediate discounting"] },
]

const CHAOS_EVENTS = [
    { title: "Requirement Change", desc: "Mid-task update: 'The client now needs mobile support.' Adapt your plan.", duration: "+5 mins", fm: ["Panic", "Refusal to adapt"] },
    { title: "Budget Cut", desc: "CFO slashes budget by 50%. Re-scope the project.", duration: "+5 mins", fm: ["Giving up", "Unrealistic cuts"] },
    { title: "Server Outage", desc: "Production is down during your demo. Handle the communication.", duration: "+5 mins", fm: ["Ignoring the issue", "Blaming ops"] },
    { title: "Angry Stakeholder", desc: "VP of Sales demands a feature you cut. Manage the conflict.", duration: "+10 mins", fm: ["Cave in immediately", "Rude refusal"] },
]

// -- Generator --

export function generateArchitectBlueprint(prompt: string): InterviewBlueprint {
    const lower = prompt.toLowerCase()

    // 1. Detect Role
    let role = "Generalist"
    let tasksSrc = PM_TASKS // Default
    let focus = "Problem Solving"

    if (lower.includes("engineer") || lower.includes("backend") || lower.includes("frontend") || lower.includes("dev")) {
        role = "Software Engineer"
        tasksSrc = ENGINEERING_TASKS
        focus = "Code Quality & Tradeoffs"
    } else if (lower.includes("design") || lower.includes("ux") || lower.includes("ui")) {
        role = "Product Designer"
        tasksSrc = DESIGN_TASKS
        focus = "User Empathy & System Thinking"
    } else if (lower.includes("sales") || lower.includes("sdr") || lower.includes("ae")) {
        role = "Sales Representative"
        tasksSrc = SALES_TASKS
        focus = "Active Listening & Persuasion"
    } else if (lower.includes("pm") || lower.includes("product") || lower.includes("manager")) {
        role = "Product Manager"
        tasksSrc = PM_TASKS
        focus = "Prioritization & Clarity"
    }

    // 2. Detect Seniority
    let seniority = "Mid-Level"
    if (lower.includes("senior") || lower.includes("lead") || lower.includes("staff")) seniority = "Senior / Lead"
    if (lower.includes("junior") || lower.includes("entry") || lower.includes("intern")) seniority = "Junior"

    // 3. Assemble Tasks
    // Pick 1 Baseline, 1 Stretch (random), 1 Chaos (if senior or requested)
    const baseline = tasksSrc[0]
    const stretch = tasksSrc[Math.floor(Math.random() * (tasksSrc.length - 1)) + 1]

    const tasks: BlueprintTask[] = [
        { id: "t-1", type: "baseline", title: baseline.title, description: baseline.desc, duration: baseline.duration, failureModes: baseline.fm },
        { id: "t-2", type: "stretch", title: stretch.title, description: stretch.desc, duration: stretch.duration, failureModes: stretch.fm },
    ]

    // Add Chaos if prompted or Senior
    if (lower.includes("chaos") || lower.includes("hard") || seniority.includes("Senior")) {
        const chaos = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]
        tasks.push({
            id: "t-3", type: "chaos", title: chaos.title,
            description: chaos.desc,
            duration: chaos.duration,
            failureModes: chaos.fm
        })
    }

    // 4. Constraints
    const constraints = {
        time: lower.includes("30") ? "30 mins" : "60 mins",
        mode: lower.includes("async") ? "Async" : "Live" as "Async" | "Live",
        tools: ["Internet Allowed", "Internal Wiki"],
        focus: focus
    }

    return {
        id: `bp-${Date.now()}`,
        role: role,
        seniority: seniority,
        summary: `A ${constraints.mode.toLowerCase()} simulation testing ${role} skills. Focuses on ${focus.toLowerCase()} under realistic constraints.`,
        constraints,
        tasks,
        rubric: [
            { category: "Core Skill", weight: "40%", criteria: "Demonstrates fundamental competence in task." },
            { category: "Communication", weight: "30%", criteria: "Explains reasoning clearly." },
            { category: "Adaptability", weight: "30%", criteria: "Handles unexpected changes well." }
        ],
        redFlags: ["Giving up easily", "Blaming external factors", "Ignoring constraints"],
        proofDefinition: "Tangible artifact (code, design, doc) + Explanation of tradeoffs."
    }
}

// Keep old constant for backward compatibility if needed, or just export empty
export const ARCHITECT_SCENARIOS: Record<string, InterviewBlueprint> = {}
