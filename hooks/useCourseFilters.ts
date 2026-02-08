"use client";

import { useMemo, useState } from "react";

import { CourseAccessType, CourseFormat, CourseLevel, StudentCourse } from "@/data/courses";

export type CourseFilters = {
  levels: CourseLevel[];
  formats: CourseFormat[];
  maxDuration: number;
  accessTypes: CourseAccessType[];
  certificateOnly: boolean;
};

function createDefaultFilters(): CourseFilters {
  return {
    levels: [],
    formats: [],
    maxDuration: 60,
    accessTypes: [],
    certificateOnly: false
  };
}

export function useCourseFilters(courses: StudentCourse[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [draftFilters, setDraftFilters] = useState<CourseFilters>(() => createDefaultFilters());
  const [appliedFilters, setAppliedFilters] = useState<CourseFilters>(() => createDefaultFilters());

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (selectedCategory !== "Все" && course.category !== selectedCategory) {
        return false;
      }

      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matches =
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.teacherName.toLowerCase().includes(query);

        if (!matches) {
          return false;
        }
      }

      if (appliedFilters.levels.length > 0 && !appliedFilters.levels.includes(course.level)) {
        return false;
      }

      if (appliedFilters.formats.length > 0 && !appliedFilters.formats.includes(course.format)) {
        return false;
      }

      if (course.durationHours > appliedFilters.maxDuration) {
        return false;
      }

      if (appliedFilters.accessTypes.length > 0 && !appliedFilters.accessTypes.includes(course.accessType)) {
        return false;
      }

      if (appliedFilters.certificateOnly && !course.certificateAvailable) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, courses, searchQuery, selectedCategory]);

  const toggleLevel = (level: CourseLevel) => {
    setDraftFilters((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((item) => item !== level) : [...prev.levels, level]
    }));
  };

  const toggleFormat = (format: CourseFormat) => {
    setDraftFilters((prev) => ({
      ...prev,
      formats: prev.formats.includes(format) ? prev.formats.filter((item) => item !== format) : [...prev.formats, format]
    }));
  };

  const toggleAccessType = (accessType: CourseAccessType) => {
    setDraftFilters((prev) => ({
      ...prev,
      accessTypes: prev.accessTypes.includes(accessType)
        ? prev.accessTypes.filter((item) => item !== accessType)
        : [...prev.accessTypes, accessType]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setDraftFilters(createDefaultFilters());
    setAppliedFilters(createDefaultFilters());
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    draftFilters,
    setDraftFilters,
    filteredCourses,
    toggleLevel,
    toggleFormat,
    toggleAccessType,
    applyFilters,
    resetFilters
  };
}
