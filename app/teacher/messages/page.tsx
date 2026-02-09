import { TeacherMessagesClient } from "@/components/teacher-cabinet/TeacherMessagesClient";

type TeacherMessagesPageProps = {
  searchParams?: {
    thread?: string;
    student?: string;
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

export default function TeacherMessagesPage({ searchParams }: TeacherMessagesPageProps) {
  return (
    <TeacherMessagesClient
      preselectedThreadId={safeDecode(searchParams?.thread)}
      preselectedStudentId={safeDecode(searchParams?.student)}
    />
  );
}
