"use client";

import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  FolderPlus,
  Heart,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  Trash2
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PillBadge } from "@/components/shared/PillBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { vocabularyFolders, VocabularyReviewGrade, vocabularyWords } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

type ViewMode = "library" | "review";
type LibraryScope = "all" | "favorites" | "due";

const gradeConfig: Record<VocabularyReviewGrade, { label: string; intervalDays: number; badge: string }> = {
  again: { label: "Снова", intervalDays: 0, badge: "Повторить сегодня" },
  hard: { label: "Трудно", intervalDays: 1, badge: "+1 день" },
  good: { label: "Хорошо", intervalDays: 3, badge: "+3 дня" },
  easy: { label: "Легко", intervalDays: 7, badge: "+7 дней" }
};

const folderColorFallbacks = [
  "bg-primary/10 text-primary border-primary/30",
  "bg-accent/35 text-slate-900 border-accent/80",
  "bg-slate-100 text-slate-700 border-slate-300",
  "bg-indigo-100 text-indigo-700 border-indigo-300"
];

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(new Date(dateValue));
}

function formatDateTime(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

function toIsoDateAfter(days: number) {
  const now = new Date();
  const next = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

export default function VocabularyPage() {
  const [words, setWords] = useState(vocabularyWords);
  const [folders, setFolders] = useState(vocabularyFolders);

  const [viewMode, setViewMode] = useState<ViewMode>("library");
  const [libraryScope, setLibraryScope] = useState<LibraryScope>("all");
  const [reviewDueOnly, setReviewDueOnly] = useState(true);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Все");
  const [activeFolder, setActiveFolder] = useState("all");

  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [newFolderGoal, setNewFolderGoal] = useState("12");

  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [sessionStats, setSessionStats] = useState({ total: 0, processed: 0, again: 0, hard: 0, good: 0, easy: 0 });

  const tags = useMemo(
    () => ["Все", ...Array.from(new Set(words.flatMap((word) => word.tags))).sort((a, b) => a.localeCompare(b, "ru"))],
    [words]
  );

  const dueWordsAll = useMemo(() => {
    const nowTs = Date.now();
    return words.filter((word) => new Date(word.review.nextReviewAt).getTime() <= nowTs);
  }, [words]);

  const dueWordsInActiveFolder = useMemo(() => {
    const nowTs = Date.now();

    return words
      .filter((word) => (activeFolder === "all" ? true : word.folderId === activeFolder))
      .filter((word) => new Date(word.review.nextReviewAt).getTime() <= nowTs)
      .sort((a, b) => new Date(a.review.nextReviewAt).getTime() - new Date(b.review.nextReviewAt).getTime());
  }, [activeFolder, words]);

  const folderStats = useMemo(() => {
    const nowTs = Date.now();

    return folders.map((folder) => {
      const folderWords = words.filter((word) => word.folderId === folder.id);
      const dueCount = folderWords.filter((word) => new Date(word.review.nextReviewAt).getTime() <= nowTs).length;

      return {
        ...folder,
        wordsCount: folderWords.length,
        dueCount
      };
    });
  }, [folders, words]);

  const activeFolderLabel =
    activeFolder === "all" ? "Все папки" : folderStats.find((folder) => folder.id === activeFolder)?.title ?? "Выбранная папка";

  const filteredWords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return words
      .filter((word) => {
        const matchesQuery =
          normalized.length === 0 ||
          word.word.toLowerCase().includes(normalized) ||
          word.translation.toLowerCase().includes(normalized) ||
          word.context.toLowerCase().includes(normalized);

        const matchesTag = activeTag === "Все" || word.tags.includes(activeTag);
        const matchesFolder = activeFolder === "all" || word.folderId === activeFolder;

        const matchesScope =
          libraryScope === "all"
            ? true
            : libraryScope === "favorites"
              ? word.isFavorite
              : new Date(word.review.nextReviewAt).getTime() <= Date.now();

        return matchesQuery && matchesTag && matchesFolder && matchesScope;
      })
      .sort((a, b) => {
        if (libraryScope === "due") {
          return new Date(a.review.nextReviewAt).getTime() - new Date(b.review.nextReviewAt).getTime();
        }

        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
  }, [activeFolder, activeTag, libraryScope, query, words]);

  const reviewCandidates = useMemo(() => {
    const base = words.filter((word) => (activeFolder === "all" ? true : word.folderId === activeFolder));

    if (!reviewDueOnly) {
      return [...base].sort((a, b) => new Date(a.review.nextReviewAt).getTime() - new Date(b.review.nextReviewAt).getTime());
    }

    const nowTs = Date.now();
    return base
      .filter((word) => new Date(word.review.nextReviewAt).getTime() <= nowTs)
      .sort((a, b) => new Date(a.review.nextReviewAt).getTime() - new Date(b.review.nextReviewAt).getTime());
  }, [activeFolder, reviewDueOnly, words]);

  const currentReviewWord = useMemo(() => {
    const currentId = reviewQueue[reviewIndex];
    if (!currentId) {
      return undefined;
    }

    return words.find((word) => word.id === currentId);
  }, [reviewIndex, reviewQueue, words]);

  const reviewCompleted = reviewQueue.length > 0 && reviewIndex >= reviewQueue.length;

  const queueProgress = reviewQueue.length > 0 ? (reviewIndex / reviewQueue.length) * 100 : 0;

  const queuePreviewWords = useMemo(() => {
    const ids = reviewQueue.slice(reviewIndex + 1, reviewIndex + 5);
    return ids
      .map((id) => words.find((word) => word.id === id))
      .filter((word): word is (typeof words)[number] => Boolean(word));
  }, [reviewIndex, reviewQueue, words]);

  const favoriteWordsCount = words.filter((word) => word.isFavorite).length;

  const startReviewSession = (customIds?: string[]) => {
    const sourceIds = customIds ?? reviewCandidates.map((word) => word.id);

    if (sourceIds.length === 0) {
      setReviewQueue([]);
      setReviewIndex(0);
      setIsAnswerVisible(false);
      setSessionStats({ total: 0, processed: 0, again: 0, hard: 0, good: 0, easy: 0 });
      return;
    }

    setReviewQueue(sourceIds);
    setReviewIndex(0);
    setIsAnswerVisible(false);
    setSessionStats({ total: sourceIds.length, processed: 0, again: 0, hard: 0, good: 0, easy: 0 });
    setViewMode("review");
  };

  const resetReviewSession = () => {
    setReviewQueue([]);
    setReviewIndex(0);
    setIsAnswerVisible(false);
    setSessionStats({ total: 0, processed: 0, again: 0, hard: 0, good: 0, easy: 0 });
  };

  const handleReviewGrade = (grade: VocabularyReviewGrade) => {
    if (!currentReviewWord) {
      return;
    }

    const config = gradeConfig[grade];

    setWords((prev) =>
      prev.map((word) => {
        if (word.id !== currentReviewWord.id) {
          return word;
        }

        const successGrade = grade === "good" || grade === "easy";
        const nextStage = successGrade ? word.review.stage + 1 : Math.max(0, word.review.stage - 1);
        const nextStreak = successGrade ? word.review.successStreak + 1 : 0;
        const nextLapses = successGrade ? word.review.lapses : word.review.lapses + 1;

        return {
          ...word,
          review: {
            ...word.review,
            stage: nextStage,
            successStreak: nextStreak,
            lapses: nextLapses,
            intervalDays: config.intervalDays,
            lastReviewedAt: new Date().toISOString(),
            nextReviewAt: toIsoDateAfter(config.intervalDays)
          }
        };
      })
    );

    setSessionStats((prev) => ({
      ...prev,
      processed: prev.processed + 1,
      [grade]: prev[grade] + 1
    }));
    setReviewIndex((prev) => prev + 1);
    setIsAnswerVisible(false);
  };

  const createFolder = () => {
    const title = newFolderTitle.trim();
    const goalValue = Number(newFolderGoal);

    if (!title) {
      return;
    }

    const nextIndex = folders.length % folderColorFallbacks.length;

    setFolders((prev) => [
      ...prev,
      {
        id: `folder-custom-${Date.now()}`,
        title,
        description: "Пользовательская папка для слов и выражений.",
        dailyGoal: Number.isFinite(goalValue) && goalValue > 0 ? goalValue : 12,
        colorClass: folderColorFallbacks[nextIndex],
        createdAt: new Date().toISOString()
      }
    ]);

    setNewFolderTitle("");
    setIsFolderFormOpen(false);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Словарь</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Четкий поток работы: сначала библиотека слов, затем отдельный режим тренировки без визуального шума.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode("library")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                viewMode === "library" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              )}
            >
              Библиотека
            </button>
            <button
              type="button"
              onClick={() => setViewMode("review")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                viewMode === "review" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              )}
            >
              Тренировка
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Всего слов</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{words.length}</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">К повторению сегодня</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{dueWordsAll.length}</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">В избранном</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{favoriteWordsCount}</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Активная папка</p>
            <p className="mt-1 truncate text-lg font-semibold text-foreground">{activeFolderLabel}</p>
          </article>
        </div>
      </section>

      {viewMode === "library" ? (
        <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-foreground">Папки</h2>
                <span className="text-xs text-muted-foreground">{folders.length} шт.</span>
              </div>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveFolder("all")}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-2 text-left text-sm transition",
                    activeFolder === "all"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-slate-50 text-muted-foreground"
                  )}
                >
                  Все папки
                  <p className="mt-1 text-xs">{words.length} слов • к повторению: {dueWordsAll.length}</p>
                </button>

                {folderStats.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setActiveFolder(folder.id)}
                    className={cn(
                      "w-full rounded-2xl border px-3 py-2 text-left text-sm transition",
                      activeFolder === folder.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-slate-50 text-muted-foreground"
                    )}
                  >
                    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold", folder.colorClass)}>
                      {folder.title}
                    </span>
                    <p className="mt-1 text-xs">{folder.wordsCount} слов • к повторению: {folder.dueCount}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <button
                type="button"
                onClick={() => setIsFolderFormOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 px-3 py-1.5 text-sm font-semibold text-foreground"
              >
                <FolderPlus className="h-4 w-4" />
                {isFolderFormOpen ? "Скрыть форму" : "Новая папка"}
              </button>

              {isFolderFormOpen ? (
                <div className="mt-3 space-y-2">
                  <label className="block text-xs text-muted-foreground">
                    Название
                    <input
                      type="text"
                      value={newFolderTitle}
                      onChange={(event) => setNewFolderTitle(event.target.value)}
                      placeholder="Например: Фразовые глаголы"
                      className="mt-1 w-full rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
                    />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Дневная цель (слов)
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={newFolderGoal}
                      onChange={(event) => setNewFolderGoal(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={createFolder}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Добавить папку
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  Разделяйте слова по целям: экзамен, разговор, работа. Это ускоряет повторение.
                </p>
              )}
            </article>

            <article className="rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-card">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Target className="h-4 w-4 text-primary" />
                Быстрый старт
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                1) Выберите папку → 2) Отфильтруйте слова → 3) Нажмите «Тренировка по выборке».
              </p>
            </article>
          </aside>

          <section className="space-y-4">
            <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Поиск по словам, переводу или контексту"
                    className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Все" },
                    { id: "favorites", label: "Избранное" },
                    { id: "due", label: "К повторению" }
                  ].map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setLibraryScope(scope.id as LibraryScope)}
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-semibold transition",
                        libraryScope === scope.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-muted-foreground"
                      )}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      activeTag === tag
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-slate-50 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  Найдено слов: <span className="font-semibold text-foreground">{filteredWords.length}</span>
                </p>
                <button
                  type="button"
                  onClick={() => startReviewSession(filteredWords.map((word) => word.id))}
                  disabled={filteredWords.length === 0}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BookOpenCheck className="h-3.5 w-3.5" />
                  Тренировка по выборке
                </button>
              </div>
            </article>

            {filteredWords.length === 0 ? (
              <EmptyState
                title="Совпадений не найдено"
                description="Измените папку, тег или режим фильтрации, чтобы увидеть слова."
                actionLabel="Сбросить фильтры"
                actionHref="/app/vocabulary"
              />
            ) : (
              <div className="space-y-3">
                {filteredWords.map((word) => (
                  <article key={word.id} className="rounded-3xl border border-border bg-white p-4 shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold text-foreground">{word.word}</p>
                        <p className="text-sm text-muted-foreground">{word.translation}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Следующее повторение</p>
                        <p className="mt-1 inline-flex rounded-full border border-border bg-slate-50 px-2.5 py-1 text-xs font-semibold text-foreground">
                          <Clock3 className="mr-1 h-3.5 w-3.5 text-primary" />
                          {formatDateTime(word.review.nextReviewAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 rounded-2xl border border-border bg-slate-50 p-3 text-sm text-muted-foreground">{word.context}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {word.tags.map((tag) => (
                        <PillBadge key={tag}>{tag}</PillBadge>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <label className="text-xs text-muted-foreground">
                        Папка
                        <select
                          value={word.folderId}
                          onChange={(event) =>
                            setWords((prev) => prev.map((item) => (item.id === word.id ? { ...item, folderId: event.target.value } : item)))
                          }
                          className="mt-1 w-full rounded-xl border border-border bg-slate-50 px-2.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary"
                        >
                          {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                              {folder.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setWords((prev) => prev.map((item) => (item.id === word.id ? { ...item, isFavorite: !item.isFavorite } : item)))
                        }
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center self-end rounded-full border transition",
                          word.isFavorite
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                        aria-label="Добавить в избранное"
                      >
                        <Heart className={cn("h-4 w-4", word.isFavorite ? "fill-current" : "")} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setWords((prev) => prev.filter((item) => item.id !== word.id))}
                        className="inline-flex h-10 w-10 items-center justify-center self-end rounded-full border border-border text-muted-foreground transition hover:border-rose-300 hover:text-rose-600"
                        aria-label="Удалить слово"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">Добавлено: {formatDate(word.addedAt)}</p>
                      <button
                        type="button"
                        onClick={() => startReviewSession([word.id])}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Тренировать это слово
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : (
        <section className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Режим тренировки</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Отдельный фокус-экран: карточка в центре, понятный прогресс и оценка сложности в один шаг.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startReviewSession()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Начать сессию
                </button>
                <button
                  type="button"
                  onClick={resetReviewSession}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Сбросить
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Папка для сессии</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFolder("all")}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    activeFolder === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground"
                  )}
                >
                  Все папки
                </button>
                {folderStats.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setActiveFolder(folder.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      activeFolder === folder.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-muted-foreground"
                    )}
                  >
                    {folder.title}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setReviewDueOnly(true)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    reviewDueOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground"
                  )}
                >
                  Только к повторению
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDueOnly(false)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    !reviewDueOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground"
                  )}
                >
                  Все слова папки
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <article className="rounded-2xl border border-border bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Слов в очереди</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{reviewQueue.length || reviewCandidates.length}</p>
              </article>
              <article className="rounded-2xl border border-border bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Пройдено</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{sessionStats.processed}</p>
              </article>
              <article className="rounded-2xl border border-border bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Уверенно</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{sessionStats.good + sessionStats.easy}</p>
              </article>
              <article className="rounded-2xl border border-border bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Нужно повторить</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{sessionStats.again + sessionStats.hard}</p>
              </article>
            </div>
          </article>

          {reviewQueue.length === 0 ? (
            <article className="rounded-3xl border border-dashed border-border bg-white p-10 text-center shadow-card">
              <p className="text-lg font-semibold text-foreground">Сессия не запущена</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Нажмите «Начать сессию». Будут взяты слова из выбранной папки ({activeFolderLabel}).
              </p>
            </article>
          ) : reviewCompleted ? (
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-card">
              <p className="text-lg font-semibold text-emerald-900">Сессия завершена</p>
              <p className="mt-2 text-sm text-emerald-800">
                Пройдено карточек: {sessionStats.processed}. Хорошо/Легко: {sessionStats.good + sessionStats.easy},
                Снова/Трудно: {sessionStats.again + sessionStats.hard}.
              </p>
              <button
                type="button"
                onClick={() => startReviewSession()}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900"
              >
                <RefreshCcw className="h-4 w-4" />
                Запустить новую сессию
              </button>
            </article>
          ) : currentReviewWord ? (
            <article className="mx-auto max-w-4xl rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Карточка {reviewIndex + 1} из {reviewQueue.length}
                </p>
                <p className="text-xs text-muted-foreground">Папка: {activeFolderLabel}</p>
              </div>

              <ProgressBar value={queueProgress} className="mt-3" ariaLabel="Прогресс сессии повторения" />

              <div className="mt-5 text-center">
                <h3 className="text-4xl font-semibold text-foreground">{currentReviewWord.word}</h3>
                <p className="mt-3 text-base text-muted-foreground">{currentReviewWord.context}</p>
              </div>

              {isAnswerVisible ? (
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-center text-xl font-semibold text-foreground">{currentReviewWord.translation}</p>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Оцените сложность, чтобы система назначила следующий интервал повторения.
                  </p>
                </div>
              ) : null}

              {!isAnswerVisible ? (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsAnswerVisible(true)}
                    className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Показать ответ
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {(Object.keys(gradeConfig) as VocabularyReviewGrade[]).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleReviewGrade(grade)}
                      className="rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40"
                    >
                      <p>{gradeConfig[grade].label}</p>
                      <p className="text-[11px] font-medium text-muted-foreground">{gradeConfig[grade].badge}</p>
                    </button>
                  ))}
                </div>
              )}

              {queuePreviewWords.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-xs text-muted-foreground">Дальше в очереди</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {queuePreviewWords.map((word) => (
                      <span key={word.id} className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground">
                        {word.word}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ) : null}

          <article className="rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-card">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Как использовать словарь эффективно
            </p>
            <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>1. Сначала пройдите «К повторению сегодня».</li>
              <li>2. Затем добавляйте в тренировку проблемные слова из фильтра.</li>
              <li>3. Раз в неделю запускайте сессию «Все слова папки» для закрепления.</li>
            </ol>
          </article>
        </section>
      )}
    </div>
  );
}
