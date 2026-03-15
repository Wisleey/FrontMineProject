import { cn } from "@/utils/cn"

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400",
        className
      )}
      {...props}
    />
  )
}
