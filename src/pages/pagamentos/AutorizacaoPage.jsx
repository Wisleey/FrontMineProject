import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleDashed, Eye, XCircle } from "lucide-react";
import {
  autorizarPagamentoApi,
  listarPagamentosPendentesApi,
  rejeitarPagamentoApi,
} from "@/api/payments-api";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { FormField } from "@/components/forms/FormField";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  formatarCnpj,
  formatarData,
  formatarMoeda,
} from "@/utils/formatadores";
import { toastAviso, toastErro, toastSucesso } from "@/utils/toast";
import { schemaRejeicao } from "@/validations/payment";

export function AutorizacaoPage() {
  const [pagamentos, setPagamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalRejeicaoAberto, setModalRejeicaoAberto] = useState(false);
  const [processandoId, setProcessandoId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaRejeicao),
    defaultValues: {
      motivoRejeicao: "",
    },
  });

  async function carregarPendentes() {
    try {
      setCarregando(true);
      const resposta = await listarPagamentosPendentesApi();
      setPagamentos(resposta.dados || []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPendentes();
  }, []);

  function abrirDetalhes(pagamento) {
    setPagamentoSelecionado(pagamento);
    setModalDetalhesAberto(true);
  }

  function abrirRejeicao(pagamento) {
    setPagamentoSelecionado(pagamento);
    setModalRejeicaoAberto(true);
  }

  function fecharRejeicao() {
    setModalRejeicaoAberto(false);
    setPagamentoSelecionado(null);
    reset();
  }

  async function handleAutorizar(pagamento) {
    try {
      setProcessandoId(pagamento.id);
      await autorizarPagamentoApi(pagamento.id);
      toastSucesso({
        title: "Pagamento autorizado",
        description: `A solicitacao de ${pagamento.razaoSocial} foi autorizada.`,
      });
      await carregarPendentes();
    } catch (erro) {
      toastErro({
        title: "Falha na autorização",
        description:
          erro.response?.data?.mensagem ||
          "Nao foi possivel autorizar o pagamento.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  async function onSubmitRejeicao(dados) {
    if (!pagamentoSelecionado) {
      return;
    }

    try {
      setProcessandoId(pagamentoSelecionado.id);
      await rejeitarPagamentoApi(pagamentoSelecionado.id, dados);
      toastAviso({
        title: "Pagamento rejeitado",
        description: "A rejeicao foi registrada com sucesso.",
      });
      fecharRejeicao();
      await carregarPendentes();
    } catch (erro) {
      toastErro({
        title: "Falha na rejeicao",
        description:
          erro.response?.data?.mensagem ||
          "Nao foi possivel rejeitar o pagamento.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Autorização de pagamentos"
        descricao="Analise pagamentos pendentes e registre a decisao com seguranca."
      />

      {carregando ? (
        <LoadingState texto="Carregando pagamentos pendentes..." />
      ) : null}

      {!carregando && pagamentos.length === 0 ? (
        <EmptyState
          titulo="Nenhum pagamento pendente"
          descricao="Assim que houver novas solicitacoes, elas serao listadas aqui."
        />
      ) : null}

      {!carregando && pagamentos.length > 0 ? (
        <div className="grid gap-4">
          {pagamentos.map((pagamento) => (
            <Card key={pagamento.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CircleDashed size={18} className="text-amber-300" />
                    <h3 className="text-lg font-semibold text-slate-100">
                      {pagamento.razaoSocial}
                    </h3>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                    <p>CNPJ: {formatarCnpj(pagamento.cnpjFavorecido)}</p>
                    <p>Valor: {formatarMoeda(pagamento.valor)}</p>
                    <p>Solicitante: {pagamento.solicitante?.nome}</p>
                    <p>
                      Data do registro: {formatarData(pagamento.dataRegistro)}
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                  <Button
                    variante="contorno"
                    className="w-full sm:w-auto"
                    onClick={() => abrirDetalhes(pagamento)}
                  >
                    <Eye size={16} />
                    Detalhes
                  </Button>
                  <Button
                    variante="secundaria"
                    className="w-full sm:w-auto"
                    onClick={() => abrirRejeicao(pagamento)}
                    disabled={processandoId === pagamento.id}
                  >
                    <XCircle size={16} />
                    Rejeitar
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleAutorizar(pagamento)}
                    disabled={processandoId === pagamento.id}
                  >
                    <CheckCircle2 size={16} />
                    {processandoId === pagamento.id
                      ? "Processando..."
                      : "Autorizar"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <Modal
        aberto={modalDetalhesAberto}
        onClose={() => {
          setModalDetalhesAberto(false);
          setPagamentoSelecionado(null);
        }}
        titulo="Detalhes do pagamento"
        subtitulo="Visualize as informacoes completas da solicitacao."
      >
        {pagamentoSelecionado ? (
          <div className="grid gap-4 text-sm text-slate-300">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Favorecido
                </p>
                <p className="mt-2 font-semibold text-slate-100">
                  {pagamentoSelecionado.razaoSocial}
                </p>
                <p className="mt-1 text-slate-400">
                  {formatarCnpj(pagamentoSelecionado.cnpjFavorecido)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Valor
                </p>
                <p className="mt-2 font-semibold text-slate-100">
                  {formatarMoeda(pagamentoSelecionado.valor)}
                </p>
                <p className="mt-1 text-slate-400">
                  Registrado em{" "}
                  {formatarData(pagamentoSelecionado.dataRegistro)}
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Descricao do servico
              </p>
              <p className="mt-2 leading-7 text-slate-200">
                {pagamentoSelecionado.descricaoServico}
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Solicitante
              </p>
              <p className="mt-2 text-slate-100">
                {pagamentoSelecionado.solicitante?.nome} (
                {pagamentoSelecionado.solicitante?.login})
              </p>
            </Card>
          </div>
        ) : null}
      </Modal>

      <Modal
        aberto={modalRejeicaoAberto}
        onClose={fecharRejeicao}
        titulo="Rejeitar pagamento"
        subtitulo="Informe o motivo obrigatorio da rejeicao."
        className="max-w-xl"
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmitRejeicao)}>
          <FormField
            label="Motivo da rejeicao"
            obrigatorio
            erro={errors.motivoRejeicao?.message}
          >
            <Textarea
              placeholder="Descreva o motivo da rejeicao"
              {...register("motivoRejeicao")}
            />
          </FormField>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variante="contorno"
              className="w-full sm:w-auto"
              onClick={fecharRejeicao}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variante="perigo"
              className="w-full sm:w-auto"
            >
              Confirmar rejeicao
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
