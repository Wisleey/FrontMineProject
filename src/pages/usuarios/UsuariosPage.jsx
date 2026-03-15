import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Pencil, Plus, Trash2, UserCog } from "lucide-react"
import {
  atualizarUsuarioApi,
  criarUsuarioApi,
  listarUsuariosApi,
  removerUsuarioApi
} from "@/api/users-api"
import { EmptyState } from "@/components/feedback/EmptyState"
import { LoadingState } from "@/components/feedback/LoadingState"
import { FormField } from "@/components/forms/FormField"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { Table, TBody, TD, TH, THead } from "@/components/ui/table"
import { formatarData, traduzirRole } from "@/utils/formatadores"
import { toastErro, toastSucesso } from "@/utils/toast"
import { schemaAtualizacaoUsuario, schemaUsuario } from "@/validations/user"

const perfis = [
  { label: "Registro", value: "REGISTRO" },
  { label: "Autorizacao", value: "AUTORIZACAO" },
  { label: "Administracao", value: "ADMINISTRACAO" }
]

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [usuarioEdicao, setUsuarioEdicao] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)

  const criando = !usuarioEdicao

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: async (values) => {
      const schemaAtivo = usuarioEdicao ? schemaAtualizacaoUsuario : schemaUsuario
      const resultado = schemaAtivo.safeParse(values)

      if (resultado.success) {
        return {
          values: resultado.data,
          errors: {}
        }
      }

      const erros = resultado.error.issues.reduce((acc, issue) => {
        const campo = issue.path[0]

        acc[campo] = {
          type: issue.code,
          message: issue.message
        }

        return acc
      }, {})

      return {
        values: {},
        errors: erros
      }
    },
    defaultValues: {
      nome: "",
      login: "",
      senha: "",
      role: "REGISTRO"
    }
  })

  async function carregarUsuarios() {
    try {
      setCarregando(true)
      const resposta = await listarUsuariosApi()
      setUsuarios(resposta.dados || [])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  function abrirCriacao() {
    setUsuarioEdicao(null)
    reset({
      nome: "",
      login: "",
      senha: "",
      role: "REGISTRO"
    })
    setModalAberto(true)
  }

  function abrirEdicao(usuario) {
    setUsuarioEdicao(usuario)
    reset({
      nome: usuario.nome,
      login: usuario.login,
      senha: "",
      role: usuario.role
    })
    setModalAberto(true)
  }

  function fecharModal() {
    setUsuarioEdicao(null)
    setModalAberto(false)
    reset({
      nome: "",
      login: "",
      senha: "",
      role: "REGISTRO"
    })
  }

  async function onSubmit(dados) {
    try {
      setSalvando(true)

      if (usuarioEdicao) {
        const payload = {
          nome: dados.nome,
          login: dados.login,
          role: dados.role
        }

        if (dados.senha?.trim()) {
          payload.senha = dados.senha
        }

        await atualizarUsuarioApi(usuarioEdicao.id, payload)
        toastSucesso({
          title: "Usuario atualizado",
          description: "Os dados foram atualizados com sucesso."
        })
      } else {
        await criarUsuarioApi(dados)
        toastSucesso({
          title: "Usuario criado",
          description: "O novo usuario foi cadastrado com sucesso."
        })
      }

      fecharModal()
      await carregarUsuarios()
    } catch (erro) {
      toastErro({
        title: "Falha ao salvar usuario",
        description:
          erro.response?.data?.mensagem || "Nao foi possivel salvar o usuario."
      })
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(usuario) {
    const confirmar = window.confirm(
      `Deseja realmente remover o usuario ${usuario.nome}?`
    )

    if (!confirmar) {
      return
    }

    try {
      await removerUsuarioApi(usuario.id)
      toastSucesso({
        title: "Usuario removido",
        description: "O registro foi removido com sucesso."
      })
      await carregarUsuarios()
    } catch (erro) {
      toastErro({
        title: "Falha ao remover usuario",
        description:
          erro.response?.data?.mensagem || "Nao foi possivel remover o usuario."
      })
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Cadastro e gestao de usuarios"
        descricao="Crie usuarios, ajuste perfis e mantenha o controle administrativo."
        actions={
          <Button onClick={abrirCriacao}>
            <Plus size={16} />
            Novo usuario
          </Button>
        }
      />

      {carregando ? <LoadingState texto="Carregando usuarios..." /> : null}

      {!carregando && usuarios.length === 0 ? (
        <EmptyState
          titulo="Nenhum usuario encontrado"
          descricao="Cadastre usuarios administrativos, de registro ou autorizacao."
        />
      ) : null}

      {!carregando && usuarios.length > 0 ? (
        <Table>
          <THead>
            <tr>
              <TH>Nome</TH>
              <TH>Login</TH>
              <TH>Perfil</TH>
              <TH>Criado em</TH>
              <TH className="text-right">Acoes</TH>
            </tr>
          </THead>
          <TBody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-slate-900/60">
                <TD>{usuario.nome}</TD>
                <TD>{usuario.login}</TD>
                <TD>{traduzirRole(usuario.role)}</TD>
                <TD>{formatarData(usuario.createdAt)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variante="contorno"
                      tamanho="sm"
                      onClick={() => abrirEdicao(usuario)}
                    >
                      <Pencil size={14} />
                      Editar
                    </Button>
                    <Button
                      variante="perigo"
                      tamanho="sm"
                      onClick={() => handleRemover(usuario)}
                    >
                      <Trash2 size={14} />
                      Remover
                    </Button>
                  </div>
                </TD>
              </tr>
            ))}
          </TBody>
        </Table>
      ) : null}

      <Modal
        aberto={modalAberto}
        onClose={fecharModal}
        titulo={usuarioEdicao ? "Editar usuario" : "Novo usuario"}
        subtitulo="Preencha os dados abaixo para salvar o usuario."
        className="max-w-2xl"
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <Card className="border-slate-800/80 bg-slate-950/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                  <UserCog size={18} />
                </div>
                <div>
                  <p className="font-medium text-slate-100">Controle de acesso por perfil</p>
                  <p className="text-sm text-slate-500">
                    Defina o nivel de permissao conforme a responsabilidade do usuario.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <FormField label="Nome" obrigatorio erro={errors.nome?.message}>
            <Input placeholder="Nome completo" {...register("nome")} />
          </FormField>

          <FormField label="Login" obrigatorio erro={errors.login?.message}>
            <Input placeholder="Login de acesso" {...register("login")} />
          </FormField>

          <FormField
            label="Senha"
            obrigatorio={criando}
            erro={errors.senha?.message}
            descricao={criando ? undefined : "Preencha apenas se desejar alterar a senha."}
          >
            <Input type="password" placeholder="Senha do usuario" {...register("senha")} />
          </FormField>

          <FormField label="Nivel de permissao" obrigatorio erro={errors.role?.message}>
            <Select {...register("role")}>
              {perfis.map((perfil) => (
                <option key={perfil.value} value={perfil.value}>
                  {perfil.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variante="contorno" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar usuario"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
