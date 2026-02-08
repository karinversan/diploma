import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function ContactsPage() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-semibold text-foreground">Контакты</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Электронная почта: support@umnyklass.demo
          <br />
          Телефон: +7 (900) 000-00-00
          <br />
          Время работы: ежедневно с 09:00 до 21:00
        </p>
      </main>
      <Footer />
    </>
  );
}
