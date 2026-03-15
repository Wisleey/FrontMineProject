import { cn } from "@/utils/cn"

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-card backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  )
}
