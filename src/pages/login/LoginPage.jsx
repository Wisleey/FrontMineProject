import { KeyRound, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { useAuth } from "@/hooks/use-auth";
import { schemaLogin } from "@/validations/auth";

function obterDestinoPorPerfil(role) {
  if (role === "REGISTRO") {
    return "/pagamentos/meus";
  }

  return "/pagamentos/novo";
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar, carregandoAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  async function onSubmit(dados) {
    const usuario = await entrar(dados);
    const destino =
      location.state?.from?.pathname || obterDestinoPorPerfil(usuario.role);
    navigate(destino, { replace: true });
  }

  return (
    <div className="grade-fundo flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-10 lg:block">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
              <ShieldCheck size={16} />
              Controle interno
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-50">
              Plataforma interna para registro e autorização de pagamentos.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Acompanhe solicitacoes, aprove pendencias e mantenha historico
              centralizado com seguranca, rastreabilidade e controle por perfil.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                "Fluxos por perfil",
                "Autenticacao com token",
                "Historico centralizado",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="mx-auto flex w-full max-w-xl flex-col justify-center p-5 sm:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
              <KeyRound size={22} />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Entrar no sistema
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Use seu login corporativo para acessar o ambiente autenticado.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Login" obrigatorio erro={errors.login?.message}>
              <Input placeholder="Digite seu login" {...register("login")} />
            </FormField>

            <FormField label="Senha" obrigatorio erro={errors.senha?.message}>
              <Input
                type="password"
                placeholder="Digite sua senha"
                {...register("senha")}
              />
            </FormField>

            <Button type="submit" className="w-full" disabled={carregandoAuth}>
              {carregandoAuth ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
