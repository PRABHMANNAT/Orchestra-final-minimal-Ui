
export const TEAM_SKILLS_GAP = [
    { skill: "React / Frontend", current: 90, target: 85, status: "Surplus" },
    { skill: "Backend / Node", current: 75, target: 80, status: "Gap (Low)" },
    { skill: "AI / LLMs", current: 40, target: 90, status: "Gap (Critical)" },
    { skill: "DevOps / CI", current: 60, target: 75, status: "Gap (Medium)" },
    { skill: "Product Design", current: 85, target: 85, status: "Balanced" },
]

export const MARKET_PULSE = [
    { role: "Senior AI Engineer", salary: "$220k - $350k", trend: "+12%", supply: "Scarce", demand: "Very High" },
    { role: "Staff Frontend", salary: "$180k - $240k", trend: "+2%", supply: "Moderate", demand: "High" },
    { role: "Product Manager (L5)", salary: "$190k - $260k", trend: "+5%", supply: "High", demand: "Moderate" },
]

export const HIRING_FORECAST = {
    timeToFill: 42, // days
    pipelineVelocity: "1.5x Industry Avg",
    projectedHires: [
        { month: "Mar", count: 2 },
        { month: "Apr", count: 4 },
        { month: "May", count: 3 },
    ],
    costPerHire: "$12,500",
    savingsVsAgency: "$180,000"
}
