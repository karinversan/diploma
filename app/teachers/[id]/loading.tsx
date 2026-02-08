import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function TeacherProfileLoading() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="pb-16 pt-28 sm:pt-32">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-16 rounded-2xl bg-slate-100" />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
              <div className="space-y-6">
                <div className="h-72 rounded-3xl bg-slate-100" />
                <div className="h-96 rounded-3xl bg-slate-100" />
              </div>
              <div className="h-96 rounded-3xl bg-slate-100" />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
