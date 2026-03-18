import { cva } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variante: {
        primaria: "bg-sky-500 text-slate-950 hover:bg-sky-400",
        secundaria: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        contorno: "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/60",
        perigo: "bg-red-500 text-white hover:bg-red-400"
      },
      tamanho: {
        md: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5"
      }
    },
    defaultVariants: {
      variante: "primaria",
      tamanho: "md"
    }
  }
)

export function Button({
  className,
  variante,
  tamanho,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variante, tamanho }), className)}
      {...props}
    />
  )
}
