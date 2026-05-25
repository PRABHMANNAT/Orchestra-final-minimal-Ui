
export interface PolicyDoc {
    id: string
    title: string
    category: "Compliance" | "Benefits" | "Conduct" | "Termination" | "Compensation" | "Hiring"
    summary: string
    riskLevel: "Low" | "Medium" | "High"
    lastUpdated: string
    content: string
}

export const HR_POLICIES: PolicyDoc[] = [
    // ─── COMPLIANCE ──────────────────────────────────────────────────────────
    {
        id: "pol-001",
        title: "Remote Work & Jurisdiction Policy",
        category: "Compliance",
        summary: "Guidelines for employing staff across different tax jurisdictions.",
        riskLevel: "High",
        lastUpdated: "2024-01-15",
        content: `# Remote Work Jurisdiction\n\n**Approved Countries:** US, Canada, UK, Australia.\n**Risk:** Permanent Establishment (PE) risk if employees work > 6 months in non-entity countries.\n**Action:** Use Deel/Remote for all other locations.`
    },
    {
        id: "pol-004",
        title: "I-9 Verification Standards",
        category: "Compliance",
        summary: "Federal requirements for verifying employment eligibility.",
        riskLevel: "High",
        lastUpdated: "2023-10-01",
        content: `# I-9 Verification\n\n**Deadline:** Section 1 by Day 1. Section 2 by Day 3.\n**Remote Verification:** Authorized representative must physically inspect documents.\n**Fines:** $2500 per violation.`
    },
    {
        id: "pol-005",
        title: "Background Check Policy",
        category: "Hiring",
        summary: "Criminal and credit check requirements.",
        riskLevel: "Medium",
        lastUpdated: "2023-09-15",
        content: `# Background Checks\n\n**Scope:** Criminal (7 years), Education (Highest degree), Employment (Last 3 employers).\n**Adverse Action:** Must follow FCRA pre-adverse/adverse action steps if denying employment.`
    },

    // ─── CONDUCT ─────────────────────────────────────────────────────────────
    {
        id: "pol-003",
        title: "Anti-Harassment & Reporting",
        category: "Conduct",
        summary: "Zero tolerance policy for harassment and discrimination.",
        riskLevel: "High",
        lastUpdated: "2024-02-01",
        content: `# Anti-Harassment\n\n**Zero Tolerance:** Immediate investigation for all claims.\n**Reporting:** Anonymous hotline or direct to People Ops.\n**Non-Retaliation:** Strictly enforced.`
    },
    {
        id: "pol-006",
        title: "Code of Conduct",
        category: "Conduct",
        summary: "Ethical standards and professional behavior.",
        riskLevel: "Medium",
        lastUpdated: "2023-08-20",
        content: `# Code of Conduct\n\n**Principles:** Integrity, Respect, Accountability.\n**Conflicts of Interest:** Must disclose outside employment or investments in competitors.\n**Gifts:** Cap at $50 value.`
    },
    {
        id: "pol-007",
        title: "Social Media Policy",
        category: "Conduct",
        summary: "Guidelines for representing the company online.",
        riskLevel: "Low",
        lastUpdated: "2023-11-05",
        content: `# Social Media\n\n**Rule:** verify facts before posting.\n**Confidentiality:** Do not share roadmap or financial data.\n**Disclaimer:** "Opinions are my own" required for bio.`
    },

    // ─── TERMINATION ─────────────────────────────────────────────────────────
    {
        id: "pol-002",
        title: "Performance Improvement Plan (PIP)",
        category: "Termination",
        summary: "Structured process for managing underperformance.",
        riskLevel: "High",
        lastUpdated: "2023-11-20",
        content: `# PIP Protocol\n\n**Duration:** 30-60 days.\n**Requirements:** SMART goals, weekly check-ins.\n**Legal:** Review required for protected classes.`
    },
    {
        id: "pol-008",
        title: "Involuntary Termination Guide",
        category: "Termination",
        summary: "Steps for firing for cause or layoff.",
        riskLevel: "High",
        lastUpdated: "2023-12-01",
        content: `# Termination Guide\n\n**Documentation:** Must have prior warnings or PIP on file (unless gross misconduct).\n**Severance:** Standard is 2 weeks + 1 week per year served (in exchange for release).`
    },

    // ─── BENEFITS & COMPENSATION ─────────────────────────────────────────────
    {
        id: "pol-009",
        title: "Compensation Philosophy",
        category: "Compensation",
        summary: "How we set pay bands and determining raises.",
        riskLevel: "Medium",
        lastUpdated: "2024-01-10",
        content: `# Comp Philosophy\n\n**Target:** 75th percentile of SF market rates (regardless of location).\n**Equity:** High equity, lower cash options available.\n**Review:** Annual adjustments based on performance tiers.`
    },
    {
        id: "pol-010",
        title: "Expense & Travel Policy",
        category: "Benefits",
        summary: "Reimbursement rules for travel and meals.",
        riskLevel: "Medium",
        lastUpdated: "2023-10-25",
        content: `# Expenses\n\n**Meals:** $75/day while traveling.\n**Flights:** Economy for < 6 hours. Business for > 6 hours.\n**Approval:** Manager approval required for > $500.`
    },
    {
        id: "pol-011",
        title: "Parental Leave Policy",
        category: "Benefits",
        summary: "Maternity, Paternity, and Adoption leave.",
        riskLevel: "Low",
        lastUpdated: "2023-09-01",
        content: `# Parental Leave\n\n**Primary Caregiver:** 16 weeks fully paid.\n**Secondary Caregiver:** 8 weeks fully paid.\n**Return:** 4-week "ramp back" period at 50% hours.`
    },
    {
        id: "pol-012",
        title: "Sabbatical Policy",
        category: "Benefits",
        summary: "Extended leave for tenured employees.",
        riskLevel: "Low",
        lastUpdated: "2022-06-15",
        content: `# Sabbatical\n\n**Eligibility:** 5 years of continuous service.\n**Benefit:** 6 weeks paid leave + $5k travel stipend.\n**Condition:** Must return for at least 6 months.`
    }
]

export const COMPLIANCE_RISKS = [
    // ─── CRITICAL ────────────────────────────────────────────────────────────
    {
        id: "risk-001",
        severity: "Critical",
        category: "Hiring",
        description: "Candidate rejected despite higher score than hired applicant (Potential Bias).",
        timestamp: "2 hours ago",
        status: "Open"
    },
    {
        id: "risk-004",
        severity: "Critical",
        category: "Hiring",
        description: "Offer extended to candidate without passing background check.",
        timestamp: "10 mins ago",
        status: "Open"
    },
    {
        id: "risk-005",
        severity: "Critical",
        category: "Data Privacy",
        description: "Ex-employee still has access to GitHub repo.",
        timestamp: "1 hour ago",
        status: "Flagged"
    },

    // ─── HIGH ────────────────────────────────────────────────────────────────
    {
        id: "risk-002",
        severity: "High",
        category: "Compensation",
        description: "Offer for Senior Engineer exceeds band by 15% without VP approval.",
        timestamp: "5 hours ago",
        status: "Flagged"
    },
    {
        id: "risk-006",
        severity: "High",
        category: "Compliance",
        description: "Employee moved to Texas without notifying payroll (Tax Nexus).",
        timestamp: "Yesterday",
        status: "Open"
    },
    {
        id: "risk-007",
        severity: "High",
        category: "Termination",
        description: "PIP documentation missing for employee slated for termination.",
        timestamp: "Yesterday",
        status: "Investigating"
    },

    // ─── MEDIUM ──────────────────────────────────────────────────────────────
    {
        id: "risk-003",
        severity: "Medium",
        category: "Onboarding",
        description: "I-9 Verification pending for employee starting in 2 days.",
        timestamp: "1 day ago",
        status: "Resolved"
    },
    {
        id: "risk-008",
        severity: "Medium",
        category: "Benefits",
        description: "Enrollment window missed for new hire (401k).",
        timestamp: "2 days ago",
        status: "Resolved"
    },
    {
        id: "risk-009",
        severity: "Medium",
        category: "Training",
        description: "Anti-Harassment training overdue for 3 managers.",
        timestamp: "3 days ago",
        status: "Open"
    },
    {
        id: "risk-010",
        severity: "Medium",
        category: "Access",
        description: "Too many admins on AWS account (Least Privilege violation).",
        timestamp: "1 week ago",
        status: "Flagged"
    }
]
