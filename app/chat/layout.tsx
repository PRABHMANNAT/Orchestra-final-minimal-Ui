import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Orchestra — Talent Search",
    description: "Search verified technical talent with Orchestra.",
}

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
