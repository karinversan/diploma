import { TeacherClassroomClient } from "@/components/teacher-cabinet/TeacherClassroomClient";

type TeacherClassroomPageProps = {
  searchParams?: {
    status?: string;
    view?: string;
    q?: string;
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

export default function TeacherClassroomPage({ searchParams }: TeacherClassroomPageProps) {
  return (
    <TeacherClassroomClient
      initialStatusFilter={safeDecode(searchParams?.status)}
      initialViewMode={safeDecode(searchParams?.view)}
      initialSearchQuery={safeDecode(searchParams?.q)}
    />
  );
}
