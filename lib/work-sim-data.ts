
export const SIMULATION_TEMPLATES = [
    {
        id: "sim-react-l5",
        role: "Senior Frontend Engineer",
        title: "Optimize Large Data Table",
        difficulty: "Hard",
        duration: "45 mins",
        skills: ["React Performance", "Virtualization", "Memoization"],
        description: "Candidate must refactor a slow data table component to handle 10k rows without lag."
    },
    {
        id: "sim-system-design",
        role: "Backend Lead",
        title: "Design a Rate Limiter",
        difficulty: "Expert",
        duration: "60 mins",
        skills: ["Distributed Systems", "Redis", "Leaky Bucket"],
        description: "Design a distributed rate limiter for a high-traffic API."
    },
    {
        id: "sim-pm-pr",
        role: "Product Manager",
        title: "Prioritize Q3 Roadmap",
        difficulty: "Medium",
        duration: "30 mins",
        skills: ["Strategic Thinking", "Data Analysis", "Communication"],
        description: "Given a list of 10 feature requests and limited engineering resources, prioritize the top 3."
    }
]

export const RUBRIC_CRITERIA = [
    { category: "Correctness", weight: "40%", description: "Does the solution actually solve the problem?" },
    { category: "Code Quality", weight: "30%", description: "Is the code readable, modular, and typed?" },
    { category: "Performance", weight: "30%", description: "Does it scale to large inputs?" }
]
