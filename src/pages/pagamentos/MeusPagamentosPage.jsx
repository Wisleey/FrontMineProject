import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Clock3, Wallet2 } from "lucide-react";
import { listarMeusPagamentosApi } from "@/api/payments-api";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { PageHeader } from "@/components/PageHeader";
import { ResumoCard } from "@/components/ResumoCard";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import {
  formatarCnpj,
  formatarData,
  formatarMoeda,
} from "@/utils/formatadores";

export function MeusPagamentosPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { notificacoes, ultimaNotificacao } = useNotifications();

  async function carregarDados() {
    try {
      setCarregando(true);
      const resposta = await listarMeusPagamentosApi();
      setPagamentos(resposta.dados || []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (ultimaNotificacao?.tipo === "PAGAMENTO_REJEITADO") {
      carregarDados();
    }
  }, [ultimaNotificacao]);

  const resumo = useMemo(() => {
    const pendentes = pagamentos.filter(
      (item) => item.status === "PENDENTE",
    ).length;
    const rejeitados = pagamentos.filter(
      (item) => item.status === "REJEITADO",
    ).length;
    const total = pagamentos.reduce((acc, item) => acc + Number(item.valor), 0);

    return {
      pendentes,
      rejeitados,
      total,
    };
  }, [pagamentos]);

  const rejeicoesNaoLidas = useMemo(
    () =>
      notificacoes.filter(
        (item) => item.tipo === "PAGAMENTO_REJEITADO" && !item.lidaEm,
      ),
    [notificacoes],
  );

  return (
    <div>
      <PageHeader
        titulo="Meus registros"
        descricao="Acompanhe o andamento das suas solicitações de pagamento."
      />

      {rejeicoesNaoLidas.length > 0 ? (
        <Card className="mb-6 border-red-500/30 bg-red-500/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-200">
                Voce possui {rejeicoesNaoLidas.length} pagamento(s) rejeitado(s)
                aguardando revisao.
              </p>
              <p className="mt-2 break-words text-sm text-red-100/90">
                Ultima rejeicao por{" "}
                {rejeicoesNaoLidas[0]?.payload?.autorizadorNome || "-"}:{" "}
                {rejeicoesNaoLidas[0]?.payload?.motivoRejeicao || "-"}
              </p>
            </div>
            <p className="text-xs leading-6 text-red-200/80">
              Consulte os cards abaixo para visualizar os detalhes de cada
              rejeicao.
            </p>
          </div>
        </Card>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <ResumoCard
          titulo="Pagamentos pendentes"
          valor={resumo.pendentes}
          descricao="Aguardando decisao de autorização"
          icone={Clock3}
        />
        <ResumoCard
          titulo="Pagamentos rejeitados"
          valor={resumo.rejeitados}
          descricao="Demandam revisao ou novo envio"
          icone={CircleAlert}
        />
        <ResumoCard
          titulo="Valor total solicitado"
          valor={formatarMoeda(resumo.total)}
          descricao="Somatorio dos registros listados"
          icone={Wallet2}
        />
      </div>

      {carregando ? (
        <LoadingState texto="Carregando seus pagamentos..." />
      ) : null}

      {!carregando && pagamentos.length === 0 ? (
        <EmptyState
          titulo="Nenhum pagamento encontrado"
          descricao="Assim que voce registrar pagamentos, eles serao exibidos aqui."
        />
      ) : null}

      {!carregando && pagamentos.length > 0 ? (
        <div className="grid gap-4">
          {pagamentos.map((pagamento) => (
            <Card
              key={pagamento.id}
              className={
                pagamento.status === "REJEITADO"
                  ? "border-red-500/40 bg-red-500/5"
                  : undefined
              }
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {pagamento.razaoSocial}
                    </h3>
                    <StatusBadge status={pagamento.status} />
                  </div>

                  <div className="grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                    <p>CNPJ: {formatarCnpj(pagamento.cnpjFavorecido)}</p>
                    <p>
                      Data do registro: {formatarData(pagamento.dataRegistro)}
                    </p>
                    <p>Valor: {formatarMoeda(pagamento.valor)}</p>
                    <p>Solicitante: {pagamento.solicitante?.nome || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Descricao do servico
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">
                      {pagamento.descricaoServico}
                    </p>
                  </div>
                </div>

                {pagamento.status === "REJEITADO" ? (
                  <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-4 lg:max-w-sm">
                    <p className="text-sm font-semibold text-red-200">
                      Pagamento rejeitado
                    </p>
                    <p className="mt-2 text-sm text-red-100/90">
                      Autorizador: {pagamento.autorizador?.nome || "-"}
                    </p>
                    <p className="mt-2 text-sm text-red-100/90">
                      Motivo: {pagamento.motivoRejeicao || "-"}
                    </p>
                    <p className="mt-2 text-xs text-red-200/80">
                      Decisao em {formatarData(pagamento.dataDecisao)}
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
