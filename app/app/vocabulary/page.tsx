"use client";

import { Heart, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { PillBadge } from "@/components/shared/PillBadge";
import { vocabularyTags, vocabularyWords } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(new Date(dateValue));
}

export default function VocabularyPage() {
  const [words, setWords] = useState(vocabularyWords);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Все");

  const tags = useMemo(() => ["Все", ...vocabularyTags], []);

  const filteredWords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return words.filter((word) => {
      const matchesQuery =
        normalized.length === 0 ||
        word.word.toLowerCase().includes(normalized) ||
        word.translation.toLowerCase().includes(normalized) ||
        word.context.toLowerCase().includes(normalized);

      const matchesTag = activeTag === "Все" || word.tags.includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [activeTag, query, words]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Словарь</h1>
        <p className="mt-1 text-sm text-muted-foreground">Слова и выражения, которые вы сохранили на уроках</p>

        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по словам…"
            className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
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
      </section>

      {filteredWords.length === 0 ? (
        <EmptyState
          title="Совпадений не найдено"
          description="Попробуйте другой запрос или выберите другой тег."
          actionLabel="Сбросить фильтры"
          actionHref="/app/vocabulary"
        />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredWords.map((word) => (
            <article key={word.id} className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-foreground">{word.word}</p>
                  <p className="text-sm text-muted-foreground">{word.translation}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setWords((prev) => prev.map((item) => (item.id === word.id ? { ...item, isFavorite: !item.isFavorite } : item)))
                    }
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
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
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-rose-300 hover:text-rose-600"
                    aria-label="Удалить слово"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 rounded-2xl border border-border bg-slate-50 p-3 text-sm text-muted-foreground">{word.context}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {word.tags.map((tag) => (
                  <PillBadge key={tag}>{tag}</PillBadge>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted-foreground">Добавлено: {formatDate(word.addedAt)}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
