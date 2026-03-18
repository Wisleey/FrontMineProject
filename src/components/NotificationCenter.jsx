import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Radio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { formatarData } from "@/utils/formatadores";

export function NotificationCenter() {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);
  const {
    notificacoes,
    naoLidas,
    conectado,
    carregando,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotifications();

  const existeNaoLida = useMemo(
    () => notificacoes.some((item) => !item.lidaEm),
    [notificacoes],
  );

  useEffect(() => {
    function handleClickFora(event) {
      if (!containerRef.current?.contains(event.target)) {
        setAberto(false);
      }
    }

    function handleTeclaEscape(event) {
      if (event.key === "Escape") {
        setAberto(false);
      }
    }

    if (!aberto) {
      return undefined;
    }

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleTeclaEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleTeclaEscape);
    };
  }, [aberto]);

  return (
    <div ref={containerRef} className="relative z-[120]">
      <Button
        variante="contorno"
        className="relative w-full min-w-0 sm:w-auto"
        onClick={() => setAberto((valorAtual) => !valorAtual)}
      >
        <Bell size={16} />
        <span className="truncate">Notificações</span>
        {naoLidas > 0 ? (
          <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {naoLidas}
          </span>
        ) : null}
      </Button>

      {aberto ? (
        <>
          <button
            type="button"
            aria-label="Fechar notificações"
            className="fixed inset-0 z-[110] bg-slate-950/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-0"
            onClick={() => setAberto(false)}
          />

          <Card className="fixed left-0 top-0 z-[120] h-[100dvh] w-screen overflow-hidden rounded-none border-0 border-slate-700 bg-slate-950 p-0 shadow-2xl md:absolute md:right-0 md:left-auto md:top-[calc(100%+0.75rem)] md:h-auto md:w-[420px] md:max-w-[calc(100vw-4rem)] md:rounded-2xl md:border md:bg-slate-950/95">
            <div className="flex h-[100dvh] w-full flex-col md:h-auto">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-100">
                    Central de notificações
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Radio
                      size={12}
                      className={
                        conectado ? "text-emerald-300" : "text-slate-500"
                      }
                    />
                    <span className="break-words">
                      {conectado
                        ? "Tempo real ativo"
                        : "Reconectando canal em tempo real"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:bg-slate-900 hover:text-white md:hidden"
                  onClick={() => setAberto(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="border-b border-slate-800 px-4 py-3">
                <Button
                  variante="contorno"
                  tamanho="sm"
                  className="w-full"
                  onClick={marcarTodasComoLidas}
                  disabled={!existeNaoLida}
                >
                  <CheckCheck size={14} />
                  Marcar todas
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:max-h-[420px] md:flex-none md:px-3 md:py-3">
                {carregando ? (
                  <p className="p-4 text-sm text-slate-400">
                    Carregando notificações...
                  </p>
                ) : null}

                {!carregando && notificacoes.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    Nenhuma notificação encontrada.
                  </p>
                ) : null}

                {!carregando && notificacoes.length > 0 ? (
                  <div className="space-y-3">
                    {notificacoes.map((notificacao) => (
                      <button
                        key={notificacao.id}
                        type="button"
                        onClick={() => marcarComoLida(notificacao.id)}
                        className={[
                          "w-full overflow-hidden rounded-2xl border p-4 text-left transition",
                          notificacao.lidaEm
                            ? "border-slate-800 bg-slate-900/50"
                            : "border-red-500/30 bg-red-500/10",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-base font-medium text-slate-100">
                              {notificacao.titulo}
                            </p>
                            <p className="mt-2 whitespace-normal break-words text-sm leading-7 text-slate-300">
                              {notificacao.mensagem}
                            </p>

                            {notificacao.payload?.motivoRejeicao ? (
                              <p className="mt-2 whitespace-normal break-words text-xs leading-6 text-red-200/90">
                                Motivo: {notificacao.payload.motivoRejeicao}
                              </p>
                            ) : null}

                            {notificacao.payload?.autorizadorNome ? (
                              <p className="mt-1 whitespace-normal break-words text-xs leading-6 text-slate-400">
                                Autorizador:{" "}
                                {notificacao.payload.autorizadorNome}
                              </p>
                            ) : null}

                            <p className="mt-3 text-xs text-slate-500">
                              {formatarData(notificacao.createdAt)}
                            </p>
                          </div>

                          {!notificacao.lidaEm ? (
                            <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
