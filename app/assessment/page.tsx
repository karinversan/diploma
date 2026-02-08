import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AssessmentQuiz } from "@/components/AssessmentQuiz";

type AssessmentPageProps = {
  searchParams?: {
    subject?: string;
  };
};

export default function AssessmentPage({ searchParams }: AssessmentPageProps) {
  return (
    <>
      <Header
        showSectionLinks={false}
        navItems={[
          { href: "/", label: "Главная" },
          { href: "/teachers", label: "Преподаватели" },
          { href: "/lead?role=student", label: "Оставить заявку" },
          { href: "/for-tutors", label: "Для преподавателей" }
        ]}
        navLabel="Навигация тестирования"
        secondaryAction={{ label: "Оставить заявку", href: "/lead?role=student" }}
        primaryAction={{ label: "Регистрация", href: "/signup?role=student" }}
      />
      <AssessmentQuiz initialSubject={searchParams?.subject} />
      <Footer />
    </>
  );
}
