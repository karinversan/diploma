# Diploma Project
## Intelligent Online Tutoring Platform with AI Support

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Table of Contents

- [Project Overview](#project-overview)
- [Problem and Objective](#problem-and-objective)
- [Core Advantages](#core-advantages)
- [Platform Roles](#platform-roles)
- [Student Experience](#student-experience)
- [Teacher Experience](#teacher-experience)
- [Admin Experience](#admin-experience)
- [Live Lesson and AI Layer](#live-lesson-and-ai-layer)
- [End-to-End Workflows](#end-to-end-workflows)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Implementation Status and Roadmap](#implementation-status-and-roadmap)
- [How to Run](#how-to-run)
- [Demo Routes](#demo-routes)
- [Media Checklist for Final Defense](#media-checklist-for-final-defense)

## Project Overview

This repository contains the implementation of a diploma thesis focused on building an **intelligent web platform for online tutoring** with AI-assisted learning workflows.

The platform is designed as a unified environment for:

- lesson discovery and booking;
- lesson delivery and live interaction;
- post-lesson learning support;
- operational moderation and quality control.

It already includes complete role-based product flows for:

- student;
- teacher;
- administrator.

![Product overview screenshot - TODO](docs/media/overview/platform-overview.png)
_What should be here: a high-level screenshot of the landing page plus role entry points to show the full product scope._

## Problem and Objective

### Problem

Most online education products cover only one part of the process (video calls, teacher marketplace, quizzes, or homework). This causes fragmented user journeys and extra manual work for teachers.

### Diploma Objective

Build a prototype platform that combines:

- scheduling, booking, and payment flows;
- live lessons with interactive collaboration;
- structured learning support between lessons;
- AI-powered assistance (speech processing, explanations, recommendations, lesson summary generation).

![Problem-to-solution flow GIF - TODO](docs/media/overview/problem-solution-flow.gif)
_What should be here: a short GIF that shows the fragmented legacy flow vs the unified platform flow._

## Core Advantages

1. **Unified learning lifecycle** from tutor selection to lesson, payment, homework, and analytics.
2. **Role-centered product design** with separate operational environments for student, teacher, and admin.
3. **AI-ready architecture** that supports future integration of ASR, lesson summary, answer checking, and recommendations.
4. **Clear domain workflows** for lesson booking moderation and tutor application moderation.
5. **Scalable modular codebase** structured for transition from prototype state to full production backend.

![Core value proposition screenshot - TODO](docs/media/overview/core-advantages.png)
_What should be here: one visual slide/card showing key differentiators and platform benefits._

## Platform Roles

| Role | Primary Value | Key Responsibilities |
| --- | --- | --- |
| Student | Personal learning trajectory management | Courses, booking, live classes, homework, vocabulary, payments, analytics |
| Teacher | Teaching operations and content control | Requests moderation, calendar, course editing, quizzes, communication, payouts |
| Administrator | Platform quality and operational governance | Tutor verification, user moderation, incidents, payment disputes, quality metrics |

![Role model diagram - TODO](docs/media/roles/role-model-diagram.png)
_What should be here: a simple diagram showing responsibilities and touchpoints for all three roles._

## Student Experience

The student workspace includes:

- dashboard with KPIs, tasks, calendar, and insights;
- course catalog and detailed course pages;
- unit-level learning pages;
- lessons module with request statuses and schedule visibility;
- homework workflows;
- vocabulary module and spaced-repetition logic;
- messaging and analytics;
- payment flow for confirmed lesson slots.

![Student dashboard screenshot - TODO](docs/media/student/student-dashboard.png)
_What should be here: the main student dashboard showing KPI cards, upcoming lessons, and current learning state._

![Student booking-to-payment GIF - TODO](docs/media/student/student-booking-payment-flow.gif)
_What should be here: a GIF of booking request creation, teacher confirmation, and payment completion._

![Student homework and vocabulary screenshot - TODO](docs/media/student/student-homework-vocabulary.png)
_What should be here: homework status and vocabulary tools in one combined visual._

## Teacher Experience

The teacher workspace provides:

- operational dashboard with pending actions and metrics;
- onboarding/verification status visibility;
- classroom center with lesson request handling;
- actions for `confirm`, `reschedule`, `decline`, `cancel`;
- course management and course editor;
- quiz builder and result review;
- messaging, analytics, and payouts sections.

![Teacher dashboard screenshot - TODO](docs/media/teacher/teacher-dashboard.png)
_What should be here: teacher dashboard with pending lesson requests and teaching KPIs._

![Teacher classroom moderation GIF - TODO](docs/media/teacher/teacher-classroom-moderation.gif)
_What should be here: a GIF that demonstrates request moderation and schedule updates._

![Teacher course editor screenshot - TODO](docs/media/teacher/teacher-course-editor.png)
_What should be here: course editor UI with module/lesson content structure._

## Admin Experience

The admin panel is designed for platform operations:

- platform health and operations dashboard;
- tutor application moderation;
- user role/status control;
- lesson incident tracking;
- payment dispute/refund operations;
- quality monitoring view.

![Admin dashboard screenshot - TODO](docs/media/admin/admin-dashboard.png)
_What should be here: admin dashboard with moderation queue and operational KPIs._

![Admin moderation workflow GIF - TODO](docs/media/admin/admin-moderation-workflow.gif)
_What should be here: a GIF showing tutor application status transitions and admin actions._

![Admin quality panel screenshot - TODO](docs/media/admin/admin-quality-panel.png)
_What should be here: quality metrics view with testing and monitoring indicators._

## Live Lesson and AI Layer

The live lesson layer is planned as a synchronized teaching environment with:

- video communication;
- shared interactive board;
- collaborative tasks and quick checks;
- contextual AI support during and after the lesson.

Current repository state already models this layer at the UI/UX and workflow level.

![Live classroom screenshot - TODO](docs/media/live/live-classroom.png)
_What should be here: full classroom interface with lesson controls, board area, and communication panel._

![Live collaboration GIF - TODO](docs/media/live/live-collaboration.gif)
_What should be here: a GIF of real-time interactions during a lesson._

![AI support panel screenshot - TODO](docs/media/live/ai-support-panel.png)
_What should be here: AI-generated notes/explanations/recommendations panel tied to lesson context._

## End-to-End Workflows

### Student Workflow

1. Select a teacher or course.
2. Send a lesson booking request.
3. Receive confirmation or reschedule proposal.
4. Pay for a confirmed slot.
5. Attend the lesson and continue post-lesson activities.

### Teacher Workflow

1. Receive incoming booking request.
2. Confirm, reschedule, or decline.
3. Track paid lessons in schedule.
4. Deliver lesson and update learning content.

### Admin Workflow

1. Review tutor applications.
2. Moderate users and platform operations.
3. Resolve incidents and payment disputes.

![Cross-role journey map - TODO](docs/media/workflows/cross-role-journey-map.png)
_What should be here: a combined journey map across student, teacher, and admin workflows._

## Architecture

### Current Implementation

- Next.js App Router as the frontend platform shell;
- role-based route segmentation (`/app`, `/teacher`, `/admin`);
- domain mock datasets in `data/*`;
- domain client logic in `lib/*`;
- local persistent state via `localStorage` for prototype scenarios.

### Target Architecture (from diploma plan)

- frontend web client;
- backend API and business domain services;
- realtime transport for collaborative sessions;
- AI service layer for tutoring intelligence;
- persistent storage for users, lessons, results, and knowledge artifacts;
- QA pipeline with unit/integration/e2e and quality metrics.

![Architecture diagram - TODO](docs/media/architecture/solution-architecture.png)
_What should be here: final architecture diagram with frontend, backend, realtime, AI, and data layers._

![Data model diagram - TODO](docs/media/architecture/data-model-erd.png)
_What should be here: ER diagram for users, lessons, assessments, notes, and recommendations._

## Project Structure

```text
app/                  route tree and role-specific pages
components/           UI modules by product domain
data/                 typed mock domain data
lib/                  domain logic and state helpers
hooks/                reusable application hooks
public/               static assets
Plan_isprav.docx      diploma plan document
```

Key domain files:

- `lib/lesson-bookings.ts` for booking lifecycle logic;
- `lib/tutor-applications.ts` for tutor onboarding moderation;
- `lib/demo-role.ts` for demo role routing.

## Technology Stack

Current prototype stack:

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons

Target production stack:

- Node.js / NestJS backend
- PostgreSQL
- WebRTC + WebSocket for realtime collaboration
- Python/FastAPI + AI APIs for intelligence modules

## Implementation Status and Roadmap

Implemented now:

- complete multi-role frontend prototype;
- core student/teacher/admin operational flows;
- booking and tutor-application status lifecycles;
- coherent route and state architecture for product demonstration.

In progress:

- backend APIs and persistent database integration;
- production authentication and RBAC;
- full realtime lesson engine;
- production AI service integrations;
- automated testing pipeline and CI/CD.

![Roadmap timeline - TODO](docs/media/roadmap/implementation-roadmap.png)
_What should be here: timeline of delivered and planned milestones for the diploma project._

## How to Run

Requirements:

- Node.js 18+
- npm 9+

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open: `http://localhost:3000`

Build for production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Demo Routes

- Student: `/login?role=student` -> `/app/dashboard`
- Teacher: `/login?role=teacher` -> `/teacher/dashboard`
- Admin: `/login?role=admin` -> `/admin/dashboard`

![Demo routes quick map - TODO](docs/media/demo/demo-routes-map.png)
_What should be here: compact route map for rapid navigation during project demo._

