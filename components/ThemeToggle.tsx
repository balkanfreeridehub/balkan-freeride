"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-orange-600 transition-all shadow-sm"
    >
      <span className="text-sm font-bold uppercase tracking-tighter">
        {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </span>
    </button>
  )
}