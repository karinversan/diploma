import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";

type LoginPageProps = {
  searchParams?: {
    role?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialRole = searchParams?.role === "teacher" || searchParams?.role === "admin" ? searchParams.role : "student";

  return (
    <>
      <Header showSectionLinks={false} />
      <main className="relative min-h-screen overflow-hidden pb-16 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(116,76,255,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(185,250,119,0.22),transparent_32%),linear-gradient(to_bottom,#fcfcff,white)]" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <LoginForm initialRole={initialRole} />
        </div>
      </main>
      <Footer />
    </>
  );
}
