import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-semibold text-foreground">Политика конфиденциальности</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Это демонстрационная страница. Здесь может быть размещена юридическая информация о сборе, хранении и обработке
          персональных данных пользователей платформы.
        </p>
      </main>
      <Footer />
    </>
  );
}
