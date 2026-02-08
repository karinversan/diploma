import { TeachersDirectoryClient } from "@/components/app-teachers/TeachersDirectoryClient";

type SortOption = "popular" | "rating" | "price-asc" | "price-desc";

type AppTeachersPageProps = {
  searchParams?: {
    q?: string;
    sort?: string;
    subject?: string;
    category?: string;
    available?: string;
  };
};

function safeDecode(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSort(value?: string): SortOption {
  if (value === "rating" || value === "price-asc" || value === "price-desc") {
    return value;
  }

  return "popular";
}

export default function AppTeachersPage({ searchParams }: AppTeachersPageProps) {
  const query = safeDecode(searchParams?.q);
  const subject = safeDecode(searchParams?.subject);
  const category = safeDecode(searchParams?.category);
  const sort = normalizeSort(searchParams?.sort);
  const availableOnly = searchParams?.available === "1";

  return (
    <TeachersDirectoryClient
      initialQuery={query}
      initialSort={sort}
      initialSubject={subject}
      initialCategory={category}
      initialAvailableOnly={availableOnly}
    />
  );
}
