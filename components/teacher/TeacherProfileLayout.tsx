"use client";

import { useState } from "react";

import { Teacher } from "@/data/teachers";

import { SelectedScheduleSlot } from "@/components/teacher/SchedulePicker";
import { TeacherHeaderCard } from "@/components/teacher/TeacherHeaderCard";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { TeacherTabs } from "@/components/teacher/TeacherTabs";

type TeacherProfileLayoutProps = {
  teacher: Teacher;
};

export function TeacherProfileLayout({ teacher }: TeacherProfileLayoutProps) {
  const [selectedSlot, setSelectedSlot] = useState<SelectedScheduleSlot | null>(null);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
      <div className="space-y-6">
        <TeacherHeaderCard teacher={teacher} />
        <TeacherTabs teacher={teacher} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
      </div>

      <TeacherSidebar teacher={teacher} selectedSlot={selectedSlot} />
    </section>
  );
}
