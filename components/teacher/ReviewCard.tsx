import Image from "next/image";
import { Star } from "lucide-react";

import { TeacherReview } from "@/data/teachers";

type ReviewCardProps = {
  review: TeacherReview;
};

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <Image
          src={review.studentAvatarUrl ?? "/avatars/avatar-1.svg"}
          alt={`Аватар ученика ${review.studentName}`}
          width={44}
          height={44}
          className="h-11 w-11 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{review.studentName}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
          </div>

          <p className="mt-1 inline-flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={`${review.id}-${index}`}
                className={`h-4 w-4 ${index < Math.round(review.rating) ? "fill-amber-400 text-amber-500" : "text-slate-300"}`}
                aria-hidden="true"
              />
            ))}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
        </div>
      </div>
    </article>
  );
}
