import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-semibold text-foreground">Пользовательское соглашение</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Это демонстрационная страница. Здесь могут быть размещены условия использования платформы для учеников и
          преподавателей.
        </p>
      </main>
      <Footer />
    </>
  );
}
