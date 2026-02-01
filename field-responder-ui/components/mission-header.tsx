"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function MissionHeader({ status }: { status: string }) {
  const [isOnDuty, setIsOnDuty] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="sticky top-0 z-40 px-4 py-3 border-b backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="font-semibold text-base text-foreground">Responder ID: FR-2847</h1>
          <p className="text-xs text-muted-foreground">Officer James Mitchell</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full glass-strong border border-border/50 flex items-center justify-center transition-apple hover:scale-110 ios-press"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>
          )}

          {/* Urgency indicator pill */}
          <div className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent">High Priority</span>
          </div>
        </div>
      </div>

      {/* On Duty toggle */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Status</span>
        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOnDuty(!isOnDuty)}>
          <span className={`font-medium transition-colors ${isOnDuty ? "text-success" : "text-muted-foreground"}`}>
            {isOnDuty ? "On Duty" : "Off Duty"}
          </span>
          <div
            className={`w-10 h-6 rounded-full relative shadow-sm transition-all duration-300 ${isOnDuty ? "bg-success" : "bg-muted"
              }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isOnDuty ? "right-1" : "left-1"
                }`}
            />
          </div>
        </label>
      </div>
    </div>
  )
}
