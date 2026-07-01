import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/layout/brand-mark";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="luxury-shell flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
      <section className="w-full max-w-md panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="flex flex-col items-center" />
          <div className="my-6 metal-line w-full" />
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Painel interno
          </p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            Acesso Restrito
          </h1>
          <p className="mt-4 text-sm leading-7 text-foreground-soft">
            Entre com suas credenciais para acessar o ambiente administrativo com total
            discrição e segurança.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm next={params?.next} />
        </div>
      </section>
    </main>
  );
}
