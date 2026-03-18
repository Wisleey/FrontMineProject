import { X } from "lucide-react"
import { cn } from "@/utils/cn"

export function Modal({ aberto, titulo, subtitulo, onClose, children, className }) {
  if (!aberto) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={cn(
          "max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6",
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-semibold text-slate-100">{titulo}</h3>
            {subtitulo ? (
              <p className="mt-1 break-words text-sm leading-6 text-slate-400">{subtitulo}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
