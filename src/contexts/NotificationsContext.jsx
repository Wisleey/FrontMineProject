import { useEffect, useMemo, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_BASE_URL } from "@/api/cliente-http";
import {
  listarNotificacoesApi,
  marcarNotificacaoComoLidaApi,
  marcarTodasNotificacoesComoLidasApi,
} from "@/api/notifications-api";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsContext } from "@/contexts/notifications-context";
import { toastAviso } from "@/utils/toast";

export function NotificationsProvider({ children }) {
  const { autenticado, token, usuario } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [ultimaNotificacao, setUltimaNotificacao] = useState(null);

  useEffect(() => {
    if (!autenticado || !token || !usuario) {
      setNotificacoes([]);
      setNaoLidas(0);
      setConectado(false);
      setUltimaNotificacao(null);
      return undefined;
    }

    const abortController = new AbortController();

    async function inicializar() {
      try {
        setCarregando(true);
        const resposta = await listarNotificacoesApi({ limit: 10 });
        setNotificacoes(resposta.dados || []);
        setNaoLidas(resposta.meta?.naoLidas || 0);
      } catch {
        setNotificacoes([]);
        setNaoLidas(0);
      } finally {
        setCarregando(false);
      }

      await fetchEventSource(`${API_BASE_URL}/notifications/stream`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.signal,
        openWhenHidden: true,
        async onopen(response) {
          if (response.ok) {
            setConectado(true);
            return;
          }

          setConectado(false);
          throw new Error(
            "Nao foi possivel estabelecer a conexao de notificações.",
          );
        },
        onmessage(event) {
          if (event.event !== "notification" || !event.data) {
            return;
          }

          const notificacao = JSON.parse(event.data);
          setUltimaNotificacao(notificacao);
          setNotificacoes((valorAtual) => {
            const jaExiste = valorAtual.some(
              (item) => item.id === notificacao.id,
            );

            if (jaExiste) {
              return valorAtual;
            }

            setNaoLidas((contadorAtual) => contadorAtual + 1);
            return [notificacao, ...valorAtual].slice(0, 10);
          });

          if (notificacao.tipo === "PAGAMENTO_REJEITADO") {
            toastAviso({
              title: notificacao.titulo,
              description:
                notificacao.payload?.motivoRejeicao || notificacao.mensagem,
            });
          }
        },
        onclose() {
          setConectado(false);
          throw new Error("Canal de notificações encerrado.");
        },
        onerror(erro) {
          setConectado(false);

          if (abortController.signal.aborted) {
            return undefined;
          }

          if (erro?.message?.includes("401")) {
            throw erro;
          }

          return 3000;
        },
      });
    }

    inicializar().catch(() => {
      setConectado(false);
    });

    return () => {
      abortController.abort();
      setConectado(false);
    };
  }, [autenticado, token, usuario]);

  async function recarregarNotificacoes() {
    if (!autenticado) {
      return;
    }

    const resposta = await listarNotificacoesApi({ limit: 10 });
    setNotificacoes(resposta.dados || []);
    setNaoLidas(resposta.meta?.naoLidas || 0);
  }

  async function marcarComoLida(id) {
    const resposta = await marcarNotificacaoComoLidaApi(id);
    const notificacaoAtualizada = resposta.dados;
    let reduziuNaoLidas = false;

    setNotificacoes((valorAtual) =>
      valorAtual.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (!item.lidaEm) {
          reduziuNaoLidas = true;
        }

        return { ...item, lidaEm: notificacaoAtualizada.lidaEm };
      }),
    );

    if (reduziuNaoLidas) {
      setNaoLidas((valorAtual) => Math.max(0, valorAtual - 1));
    }
  }

  async function marcarTodasComoLidas() {
    const resposta = await marcarTodasNotificacoesComoLidasApi();

    setNotificacoes((valorAtual) =>
      valorAtual.map((item) => ({
        ...item,
        lidaEm: item.lidaEm || new Date().toISOString(),
      })),
    );
    setNaoLidas(resposta.meta?.naoLidas || 0);
  }

  const valor = useMemo(
    () => ({
      notificacoes,
      naoLidas,
      conectado,
      carregando,
      ultimaNotificacao,
      recarregarNotificacoes,
      marcarComoLida,
      marcarTodasComoLidas,
    }),
    [notificacoes, naoLidas, conectado, carregando, ultimaNotificacao],
  );

  return (
    <NotificationsContext.Provider value={valor}>
      {children}
    </NotificationsContext.Provider>
  );
}
