# Дипломная работа: разработка интеллектуальной веб-платформы онлайн-репетиторства с ИИ-поддержкой

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## О проекте

Репозиторий содержит реализацию дипломной темы из `Plan_isprav.docx`: **интеллектуальная веб-платформа для онлайн-репетиторства** с ролевой моделью, live-уроком, интерактивными учебными модулями и ИИ-поддержкой учебного процесса.

Текущий этап разработки в этом репозитории: **функциональный frontend-прототип платформы** с полным UX-контуром по ролям и бизнес-сценариями, смоделированными на мок-данных и локальном состоянии.

## Тема, цель и задачи (по плану)

### Тема

Разработка интеллектуальной веб-платформы для онлайн-репетиторства с интеграцией ИИ-инструментов в учебный процесс.

### Цель

Создание прототипа платформы с модулями:
- видеосвязь и live-комната урока;
- совместная учебная работа (доска, тесты, задания);
- ИИ-поддержка (распознавание речи, конспект, объяснение, рекомендации);
- ролевые кабинеты ученика, преподавателя и администратора.

### Ключевые задачи

- анализ существующих образовательных платформ и их ограничений;
- проектирование архитектуры и модулей системы;
- реализация ролевой системы и пользовательских сценариев;
- реализация контуров расписания, бронирования, оплаты и учебной аналитики;
- подготовка тестового контура: unit, integration, e2e, UX и метрики качества ИИ.

## Демонстрация интерфейса

Ниже размещены заглушки скриншотов и GIF, распределенные по логике продукта. Они показывают, какие материалы должны быть заменены финальными медиа.

### 1) Публичный контур

![Landing overview placeholder](docs/readme-assets/01-landing-overview-placeholder.svg)

### 2) Контур ученика

![Student app placeholder](docs/readme-assets/02-student-app-placeholder.svg)

![Student flow GIF placeholder](docs/readme-assets/gif-student-flow-placeholder.svg)

### 3) Live-урок

![Live classroom placeholder](docs/readme-assets/03-live-classroom-placeholder.svg)

### 4) Контур преподавателя

![Teacher cabinet placeholder](docs/readme-assets/04-teacher-cabinet-placeholder.svg)

![Teacher flow GIF placeholder](docs/readme-assets/gif-teacher-flow-placeholder.svg)

### 5) Контур администратора

![Admin panel placeholder](docs/readme-assets/05-admin-panel-placeholder.svg)

![Admin flow GIF placeholder](docs/readme-assets/gif-admin-flow-placeholder.svg)

### 6) Архитектурная схема

![Architecture placeholder](docs/readme-assets/06-architecture-placeholder.svg)

## Функциональная карта платформы

### Публичный контур

- маркетинговый лендинг с продуктовой воронкой;
- предварительное тестирование уровня знаний;
- каталог преподавателей с фильтрами и сортировкой;
- профиль преподавателя с расписанием и бронированием;
- формы лидогенерации для ученика и преподавателя;
- отдельная страница для привлечения преподавателей;
- базовые юридические страницы.

### Контур ученика

- dashboard с KPI, календарем, текущими курсами, ближайшими уроками, домашними задачами, AI-инсайтами;
- каталог курсов с фильтрами и поиском;
- страница курса с программой, roadmap, треком прогресса, домашним планом и FAQ;
- просмотр unit-уроков по модульной структуре;
- каталог преподавателей внутри кабинета;
- профиль преподавателя внутри кабинета;
- модуль занятий с календарем, табами upcoming/completed, карточками уроков;
- сценарий заявок на урок: отправка, подтверждение, перенос, оплата, отклонение, отмена;
- детальная страница урока;
- live-комната с видео-панелью, доской, тестами, чатом и AI-артефактами;
- домашние задания с фильтрами и двумя режимами проверки (auto / ai+teacher);
- словарь с папками, тегами, избранным и режимом повторения;
- сообщения с преподавателями;
- отдельная аналитика обучения;
- платежи: карты, история транзакций, оплата подтвержденного слота;
- настройки профиля и уведомлений.

### Контур преподавателя

- dashboard преподавателя с KPI, ближайшими уроками, планом задач и быстрыми действиями;
- блок онбординга и статуса верификации преподавателя;
- classroom-центр с календарем, учениками и операциями по заявкам на урок;
- обработка booking-заявок: confirm / propose reschedule / decline;
- управление курсами (поиск, статусы, прогресс, переход в редактор);
- редактор курса с модульной структурой и компонентным конструктором;
- предпросмотр страницы курса как у ученика;
- конструктор квизов с типами вопросов, вариантами, баллами и пояснениями;
- прохождение квиза и экран результатов;
- сообщения с учениками;
- аналитика преподавателя;
- выплаты и транзакции;
- настройки профиля преподавателя.

### Контур администратора

- операционный dashboard;
- верификация преподавателей и управление статусами заявок;
- контроль user-ролей и user-статусов;
- модуль инцидентов по занятиям;
- модуль возвратов и платежных споров;
- quality-раздел с тестовыми прогонами и AI/UX метриками;
- глобальные настройки платформенных фич.

## Сквозные сценарии

### Сценарий ученика

1. Пользователь проходит вход/регистрацию как ученик.
2. Выбирает курс или преподавателя.
3. Отправляет заявку на слот в разделе занятий или из диалога курса.
4. Преподаватель подтверждает или предлагает перенос.
5. После подтверждения пользователь оплачивает слот в разделе платежей.
6. Оплаченный слот появляется в расписании.
7. Пользователь проходит live-урок и выполняет домашние задания.
8. Прогресс и рекомендации отображаются в аналитике.

### Сценарий преподавателя

1. Преподаватель входит в кабинет.
2. Получает заявки на занятия в classroom-центре.
3. Подтверждает слот или предлагает перенос.
4. Управляет курсами и обновляет учебный контент.
5. Создает и редактирует квизы.
6. Ведет коммуникацию с учениками.
7. Отслеживает выручку, метрики и выплаты.

### Сценарий администратора

1. Администратор мониторит KPI и состояние платформы.
2. Модерирует заявки преподавателей.
3. Управляет статусами пользователей и доступом.
4. Разбирает инциденты по урокам.
5. Обрабатывает возвраты.
6. Контролирует quality-метрики и smoke-прогоны.

## Подробная карта маршрутов

| Зона | Маршрут | Назначение |
| --- | --- | --- |
| Public | `/` | Лендинг и продуктовая воронка |
| Public | `/assessment` | Предварительное тестирование знаний |
| Public | `/teachers` | Публичный каталог преподавателей |
| Public | `/teachers/[id]` | Публичный профиль преподавателя |
| Public | `/for-tutors` | Привлечение преподавателей |
| Public | `/lead` | Лид-форма для ученика/преподавателя |
| Public | `/contacts` | Контактная информация |
| Public | `/privacy` | Политика конфиденциальности (демо) |
| Public | `/terms` | Пользовательское соглашение (демо) |
| Auth | `/login` | Демо-вход с выбором роли |
| Auth | `/signup` | Демо-регистрация ученика/преподавателя |
| Student | `/app` | Редирект на `/app/dashboard` |
| Student | `/app/dashboard` | Dashboard ученика |
| Student | `/app/courses` | Каталог курсов |
| Student | `/app/courses/[id]` | Страница курса |
| Student | `/app/courses/[id]/units/[unitId]` | Просмотр unit-материала |
| Student | `/app/teachers` | Каталог преподавателей в кабинете |
| Student | `/app/teachers/[id]` | Профиль преподавателя в кабинете |
| Student | `/app/lessons` | Календарь и статусы заявок на занятия |
| Student | `/app/lessons/[id]` | Детали урока |
| Student | `/app/lessons/[id]?live=1` | Live-комната урока |
| Student | `/app/homework` | Список домашних заданий |
| Student | `/app/homework/[id]` | Детали и выполнение задания |
| Student | `/app/vocabulary` | Словарь и интервальное повторение |
| Student | `/app/messages` | Сообщения с преподавателями |
| Student | `/app/analytics` | Аналитика прогресса |
| Student | `/app/payments` | Платежи и оплата подтвержденных уроков |
| Student | `/app/settings` | Настройки профиля |
| Teacher | `/teacher` | Редирект на `/teacher/dashboard` |
| Teacher | `/teacher/dashboard` | Dashboard преподавателя |
| Teacher | `/teacher/classroom` | Classroom-центр и заявки на уроки |
| Teacher | `/teacher/courses` | Управление курсами |
| Teacher | `/teacher/courses/[id]` | Редактор курса |
| Teacher | `/teacher/courses/[id]/preview` | Предпросмотр курса |
| Teacher | `/teacher/quizzes/[id]/builder` | Конструктор квиза |
| Teacher | `/teacher/quizzes/[id]/pass` | Прохождение квиза |
| Teacher | `/teacher/quizzes/[id]/results` | Результаты квиза |
| Teacher | `/teacher/messages` | Сообщения преподавателя |
| Teacher | `/teacher/analytics` | Аналитика преподавателя |
| Teacher | `/teacher/payouts` | Выплаты и транзакции |
| Teacher | `/teacher/settings` | Настройки преподавателя |
| Admin | `/admin` | Редирект на `/admin/dashboard` |
| Admin | `/admin/dashboard` | Операционный обзор |
| Admin | `/admin/users` | Пользователи и роли |
| Admin | `/admin/lessons` | Инциденты по занятиям |
| Admin | `/admin/payments` | Возвраты и платежные споры |
| Admin | `/admin/quality` | Качество, тестовые прогоны, AI/UX метрики |
| Admin | `/admin/settings` | Глобальные фичи и настройки |

## Архитектура

### Целевая архитектура по дипломному плану

- клиентская часть (web-интерфейс, ролевые кабинеты, live-комната);
- backend API и доменная логика;
- realtime-слой (WebRTC, WebSocket/Socket.io);
- AI-слой (ASR, конспект, объяснения, рекомендации, словарь);
- слой данных (PostgreSQL, доменная модель сущностей);
- QA-контур (unit/integration/e2e, UX и эффективность).

### Текущая реализация в репозитории

- frontend на Next.js App Router;
- мок-доменные данные в `data/*`;
- локальное состояние и сценарии через `localStorage`;
- UI-репрезентация realtime и AI-модулей на уровне прототипа;
- ролевые shell-структуры и навигация.

## Подробная структура проекта

```text
app/
  layout.tsx                     корневой layout
  page.tsx                       лендинг
  assessment/page.tsx            тестирование
  teachers/page.tsx              публичный каталог
  teachers/[id]/page.tsx         публичный профиль преподавателя
  for-tutors/page.tsx            страница для преподавателей
  lead/page.tsx                  лид-форма
  login/page.tsx                 вход
  signup/page.tsx                регистрация
  contacts/page.tsx              контакты
  privacy/page.tsx               privacy (демо)
  terms/page.tsx                 terms (демо)
  app/                           контур ученика
  teacher/                       контур преподавателя
  admin/                         контур администратора

components/
  LandingPage + секции лендинга
  AssessmentQuiz                 логика тестирования
  TeachersDirectory              публичный каталог преподавателей
  teacher/*                      публичный профиль преподавателя
  app/*                          shell и topbar/sidebars ученика
  app-teachers/*                 каталог преподавателей в кабинете ученика
  courses/*                      курс, unit-контент, диалог бронирования
  lessons/*                      календарь, карточки уроков, live-room
  homework/*                     auto/manual режимы выполнения ДЗ
  teacher-cabinet/*              клиентские модули кабинета преподавателя
  admin/*                        shell/admin-navigation
  shared/*                       переиспользуемые UI-компоненты
  ui/*                           базовые контролы фильтров/чипов

data/
  assessment.ts                  вопросы тестирования
  teachers.ts                    модели и каталог преподавателей
  courses.ts                     модели курсов, syllabus, roadmap
  lessons.ts                     уроки ученика
  homework.ts                    ДЗ и режимы проверки
  vocabulary.ts                  словарь и интервальное повторение
  messages.ts                    диалоги ученика
  analytics.ts                   метрики и AI-инсайты ученика
  payments.ts                    карты и транзакции ученика
  student.ts                     профиль ученика
  teacher-cabinet.ts             данные кабинета преподавателя
  admin.ts                       данные админ-панели
  pricing.ts, metrics.ts         данные лендинга

lib/
  demo-role.ts                   демо-роль и маршрутизация по роли
  lesson-bookings.ts             доменная логика заявок/статусов занятий
  tutor-applications.ts          заявки преподавателей и модерация
  utils.ts                       helper-функции

hooks/
  useCourseFilters.ts            фильтры каталога курсов
  useLessonCalendar.ts           календарная логика расписания

docs/readme-assets/
  svg/gif placeholders           заглушки для README-медиа

Plan_isprav.docx                 план дипломной работы
```

## Модульные подсистемы и данные

### Слой данных `data/*`

- типизированные доменные модели для всех ролей;
- мок-наборы данных для демонстрации реальных продуктовых сценариев;
- селекторы и helper-функции (`getTeacherById`, `getCourseById`, `getHomeworkById`, etc.).

### Бизнес-утилиты `lib/*`

- `lib/demo-role.ts`: хранение роли демо-пользователя и выбор целевого маршрута;
- `lib/lesson-bookings.ts`: жизненный цикл заявок на урок и миграция legacy-key;
- `lib/tutor-applications.ts`: создание и модерация заявок преподавателей.

### React hooks `hooks/*`

- `useCourseFilters`: фильтрация каталога курсов;
- `useLessonCalendar`: вычисление дней с занятиями, выбор даты, фильтрация по дню.

## Локальное состояние и ключи localStorage

- `skillzone-demo-role` — активная роль в демо-входе;
- `lesson-booking-requests-v2` — заявки на занятия;
- `student-bookings-v1` — legacy-ключ заявок (миграция);
- `tutor-applications-v1` — заявки преподавателей.

## Статус реализации

### Реализовано в текущем репозитории

- полный UI-контур по ролям;
- ролевая навигация и shell-архитектура;
- учебные сценарии ученика;
- рабочие сценарии преподавателя;
- операционные сценарии администратора;
- локальная доменная логика по заявкам и заявкам преподавателей.

### В разработке

- backend API и постоянное хранилище;
- production-аутентификация и RBAC;
- реальный realtime слой (WebRTC/WebSocket);
- интеграция внешних AI-сервисов;
- CI/CD и полноформатный тестовый контур.

## Технологии

### Используется сейчас

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-select`)
- Lucide Icons

### Предусмотрено целевой архитектурой

- Node.js / NestJS
- PostgreSQL
- WebRTC / Socket.io / WebSocket
- FastAPI/Python-модули для AI-пайплайнов
- OpenAI API / Whisper

## Как запустить проект

### Требования

- Node.js 18+
- npm 9+

### Установка

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

Открыть в браузере: `http://localhost:3000`

### Production build

```bash
npm run build
npm run start
```

### Линтер

```bash
npm run lint
```

## Проверка демо-сценариев

### Ученик

1. Открыть `http://localhost:3000/login?role=student`.
2. Войти как ученик.
3. Пройти путь: `/app/dashboard` -> `/app/courses` -> `/app/lessons` -> `/app/payments`.

### Преподаватель

1. Открыть `http://localhost:3000/login?role=teacher`.
2. Войти как преподаватель.
3. Пройти путь: `/teacher/dashboard` -> `/teacher/classroom` -> `/teacher/courses` -> `/teacher/quizzes/[id]/builder`.

### Администратор

1. Открыть `http://localhost:3000/login?role=admin`.
2. Войти как администратор.
3. Пройти путь: `/admin/dashboard` -> `/admin/users` -> `/admin/payments` -> `/admin/quality`.

## Замена заглушек медиа на реальные материалы

1. Записать реальные скриншоты и GIF по каждому сценарию.
2. Заменить файлы в `docs/readme-assets/`.
3. Сохранить существующую структуру блоков в разделе «Демонстрация интерфейса».

Список текущих заглушек:
- `docs/readme-assets/01-landing-overview-placeholder.svg`
- `docs/readme-assets/02-student-app-placeholder.svg`
- `docs/readme-assets/03-live-classroom-placeholder.svg`
- `docs/readme-assets/04-teacher-cabinet-placeholder.svg`
- `docs/readme-assets/05-admin-panel-placeholder.svg`
- `docs/readme-assets/06-architecture-placeholder.svg`
- `docs/readme-assets/gif-student-flow-placeholder.svg`
- `docs/readme-assets/gif-teacher-flow-placeholder.svg`
- `docs/readme-assets/gif-admin-flow-placeholder.svg`

## Ограничения текущего этапа

- данные и сценарии работают на моках;
- нет server-side бизнес-логики;
- нет реальной аутентификации/авторизации;
- realtime и AI-модули представлены как интерфейсный прототип;
- часть quality-метрик и тест-ранов демонстрационная.
