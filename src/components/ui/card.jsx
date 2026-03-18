import { cn } from "@/utils/cn"

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-card backdrop-blur-sm sm:p-6",
        className
      )}
    >
      {children}
    </div>
  )
}
