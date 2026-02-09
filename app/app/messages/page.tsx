import { MessagesPageClient } from "@/components/app/MessagesPageClient";

type MessagesPageProps = {
  searchParams?: {
    thread?: string;
    teacher?: string;
    draft?: string;
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

export default function MessagesPage({ searchParams }: MessagesPageProps) {
  const threadFromQuery = safeDecode(searchParams?.thread);
  const teacherFromQuery = safeDecode(searchParams?.teacher);
  const draftFromQuery = safeDecode(searchParams?.draft);

  return (
    <MessagesPageClient
      preselectedThreadId={threadFromQuery}
      preselectedTeacherId={teacherFromQuery}
      initialDraft={draftFromQuery}
    />
  );
}
