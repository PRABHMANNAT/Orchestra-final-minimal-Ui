"use client"

import React from "react"

import InterviewPackagePanel from "@/app/pm/panels/InterviewPackagePanel"
import { useRouter } from "next/navigation"

export default function InterviewPage() {
    const router = useRouter()

    return (

        <main className="flex-1 overflow-hidden">
            <InterviewPackagePanel onClose={() => router.push("/job-brief")} />
        </main>
    )
}
