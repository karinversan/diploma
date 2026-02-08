import { LessonsPageClient } from "@/components/lessons/LessonsPageClient";

type LessonsPageProps = {
  searchParams?: {
    course?: string;
    teacher?: string;
    slot?: string;
    subject?: string;
    booking?: string;
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

export default function LessonsPage({ searchParams }: LessonsPageProps) {
  return (
    <LessonsPageClient
      selectedCourse={safeDecode(searchParams?.course)}
      selectedTeacher={safeDecode(searchParams?.teacher)}
      selectedSlot={safeDecode(searchParams?.slot)}
      selectedSubject={safeDecode(searchParams?.subject)}
      selectedBookingId={safeDecode(searchParams?.booking)}
    />
  );
}
