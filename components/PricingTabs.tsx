"use client";

import Link from "next/link";
import { useState } from "react";

import { studentPricingPlans, tutorPricingPlans } from "@/data/pricing";

import { Container } from "@/components/Container";

export function PricingTabs() {
  const [tab, setTab] = useState<"student" | "tutor">("student");
  const plans = tab === "student" ? studentPricingPlans : tutorPricingPlans;

  return (
    <section id="pricing" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Цены</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Прозрачные тарифы для обучения и преподавания</h2>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-2 rounded-full border border-border bg-white p-1.5 shadow-card">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "student"}
            onClick={() => setTab("student")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              tab === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Для учеников
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "tutor"}
            onClick={() => setTab("tutor")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              tab === "tutor" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Для преподавателей
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-3xl border p-6 shadow-card ${
                plan.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-white"
              }`}
            >
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-3xl font-semibold text-foreground">{plan.price}</p>
                <p className="pb-1 text-sm text-muted-foreground">{plan.period}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tab === "student" ? "/lead?role=student" : "/lead?role=tutor"}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
