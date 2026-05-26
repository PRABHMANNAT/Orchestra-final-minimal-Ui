"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface IngenLogoProps {
    className?: string
    size?: number
}

export function IngenLogo({ className, size = 40 }: IngenLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className)}
        >
            <circle cx="253" cy="233" r="108" stroke="currentColor" strokeWidth="36" />
            <line x1="212" y1="68" x2="294" y2="430" stroke="currentColor" strokeWidth="36" strokeLinecap="square" />
            <line x1="155" y1="68" x2="261" y2="68" stroke="currentColor" strokeWidth="36" strokeLinecap="square" />
            <line x1="245" y1="430" x2="351" y2="430" stroke="currentColor" strokeWidth="36" strokeLinecap="square" />
        </svg>
    )
}
