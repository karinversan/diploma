import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TeachersDirectory } from "@/components/TeachersDirectory";

type TeachersPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default function TeachersPage({ searchParams }: TeachersPageProps) {
  return (
    <>
      <Header showSectionLinks={false} />
      <TeachersDirectory initialCategory={searchParams?.category} />
      <Footer />
    </>
  );
}
