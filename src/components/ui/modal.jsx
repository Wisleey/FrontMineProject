import { X } from "lucide-react"
import { cn } from "@/utils/cn"

export function Modal({ aberto, titulo, subtitulo, onClose, children, className }) {
  if (!aberto) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl",
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{titulo}</h3>
            {subtitulo ? (
              <p className="mt-1 text-sm text-slate-400">{subtitulo}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
