"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AIFeaturesSection } from "@/components/AIFeaturesSection";
import { AfterLessonSection } from "@/components/AfterLessonSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ClassroomSection } from "@/components/ClassroomSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorksTabs } from "@/components/HowItWorksTabs";
import { MetricsRow } from "@/components/MetricsRow";
import { PricingTabs } from "@/components/PricingTabs";
import { StudentFunnelSection } from "@/components/StudentFunnelSection";
import { TeachersShowcase } from "@/components/TeachersShowcase";
import { TrustSection } from "@/components/TrustSection";
import { TutorRecruitSection } from "@/components/TutorRecruitSection";

export function LandingPage() {
  const [showBottomCta, setShowBottomCta] = useState(false);

  useEffect(() => {
    const heroSection = document.getElementById("hero");

    if (!heroSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBottomCta(!entry.isIntersecting);
      },
      {
        threshold: 0.2
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header showSectionLinks />

      <main className="relative overflow-x-hidden pb-20 md:pb-0">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(116,76,255,0.11),transparent_36%),radial-gradient(circle_at_85%_15%,rgba(185,250,119,0.2),transparent_35%),linear-gradient(to_bottom,#fcfcff,white_34%,#fbfbfd)]" />

        <Hero />
        <MetricsRow />
        <StudentFunnelSection />
        <HowItWorksTabs />
        <ClassroomSection />
        <AIFeaturesSection />
        <CategoriesSection />
        <TeachersShowcase />
        <AfterLessonSection />
        <PricingTabs />
        <TutorRecruitSection />
        <TrustSection />
        <FAQAccordion />
        <FinalCTA />
      </main>

      <Footer />

      {showBottomCta ? (
        <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border bg-white p-2 shadow-soft md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Пройти тест
            </Link>
            <Link
              href="/lead?role=tutor"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-foreground"
            >
              Стать преподавателем
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
