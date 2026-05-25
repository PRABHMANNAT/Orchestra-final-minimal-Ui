export const themeClasses = {
  light: {
    app: "bg-[#FAF8F5] text-[#1A1612]",
    canvas: "bg-[#FAF8F5] text-[#1A1612]",
    grid:
      "bg-[linear-gradient(to_right,#78716C33_1px,transparent_1px),linear-gradient(to_bottom,#78716C33_1px,transparent_1px)]",
    gridOpacity: "opacity-35",
    sidebar: "bg-[#FFFFFF]/90 border-[#78716C]",
    card: "border-[#78716C] bg-[#FFFFFF] shadow-[0_18px_50px_rgba(26, 22, 18,0.06)]",
    cardMuted: "bg-[#FAF8F5]",
    row: "bg-[#FFFFFF]",
    text: "text-[#1A1612]",
    muted: "text-[#78716C]",
    faint: "text-[#78716C]",
    border: "border-[#78716C]",
    input: "bg-[#FFFFFF] border-[#78716C] text-[#1A1612] placeholder:text-[#78716C]",
  },
  dark: {
    app: "bg-[#050505] text-white",
    canvas: "bg-[#050505] text-white",
    grid:
      "bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)]",
    gridOpacity: "opacity-55",
    sidebar: "bg-[#101010]/92 border-[#242424]",
    card: "border-[#242424] bg-[#101010] shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    cardMuted: "bg-[#1C1C1C]",
    row: "bg-[#171717]",
    text: "text-white",
    muted: "text-[#A0A0A0]",
    faint: "text-[#777]",
    border: "border-[#242424]",
    input: "bg-[#171717] border-[#242424] text-white placeholder:text-[#666]",
  },
} as const

export type AppTheme = keyof typeof themeClasses
