import { cn } from "@/utils/cn"

export function Table({ className, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <div className="overflow-x-auto">
        <table className={cn("min-w-full divide-y divide-slate-800", className)}>
          {children}
        </table>
      </div>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="bg-slate-900/90">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-slate-800 bg-slate-950/40">{children}</tbody>
}

export function TH({ children, className }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400",
        className
      )}
    >
      {children}
    </th>
  )
}

export function TD({ children, className }) {
  return (
    <td className={cn("px-4 py-4 text-sm text-slate-200", className)}>{children}</td>
  )
}
