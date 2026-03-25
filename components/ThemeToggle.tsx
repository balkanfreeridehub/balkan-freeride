"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-7 flex items-center bg-slate-200 dark:bg-white/10 rounded-full p-1 transition-all duration-300 shadow-inner"
    >
      <div 
        className={`absolute w-5 h-5 bg-white dark:bg-blue-500 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {isDark ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-amber-500" />}
      </div>
    </button>
  )
}