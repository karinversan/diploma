import { MessagesPageClient } from "@/components/app/MessagesPageClient";
import { messageThreads } from "@/data/messages";

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
  const threadFromTeacher = teacherFromQuery
    ? messageThreads.find((thread) => thread.teacherId === teacherFromQuery)?.id
    : undefined;

  return <MessagesPageClient preselectedThreadId={threadFromQuery ?? threadFromTeacher} initialDraft={draftFromQuery} />;
}
