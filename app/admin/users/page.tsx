"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { adminUsers, type PlatformUser } from "@/data/admin";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { readTutorApplications, TutorApplication, updateTutorApplication } from "@/lib/tutor-applications";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [tutorApplications, setTutorApplications] = useState<TutorApplication[]>([]);
  const [pendingTutorApplications, setPendingTutorApplications] = useState(0);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | PlatformUser["role"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PlatformUser["status"]>("all");

  useEffect(() => {
    const syncApplications = () => {
      const applications = readTutorApplications();
      const pending = applications.filter((item) => item.status === "pending").length;
      setTutorApplications(applications);
      setPendingTutorApplications(pending);
    };

    syncApplications();
    window.addEventListener("storage", syncApplications);
    window.addEventListener(STORAGE_SYNC_EVENT, syncApplications);
    return () => {
      window.removeEventListener("storage", syncApplications);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncApplications);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      if (statusFilter !== "all" && user.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery);
    });
  }, [query, roleFilter, statusFilter, users]);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        if (user.status === "blocked") {
          return { ...user, status: "active" };
        }

        if (user.role === "admin") {
          return user;
        }

        return { ...user, status: "blocked" };
      })
    );
  };

  const moderateTutorApplication = (applicationId: string, status: TutorApplication["status"]) => {
    const note = status === "approved" ? "Профиль подтвержден администратором" : "Нужна доработка анкеты и документов";
    const next = updateTutorApplication(applicationId, { status, adminNote: note });
    setTutorApplications(next);
    setPendingTutorApplications(next.filter((item) => item.status === "pending").length);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Пользователи и роли</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управляйте доступами учеников, преподавателей и администраторов, включая блокировку и повторную активацию.
        </p>

        <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-slate-50 p-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Поиск</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Имя или email"
                className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Роль</span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Все роли</option>
              <option value="student">Ученики</option>
              <option value="teacher">Преподаватели</option>
              <option value="admin">Администраторы</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Статус</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активен</option>
              <option value="blocked">Заблокирован</option>
              <option value="invited">Приглашён</option>
            </select>
          </label>
        </div>

        <p className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
          Заявок преподавателей на модерации: {pendingTutorApplications}
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="border-b border-border bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Пользователь</th>
                <th className="px-4 py-3">Роль</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Регистрация</th>
                <th className="px-4 py-3">Последняя активность</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    По выбранным фильтрам пользователи не найдены.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "student" ? "Ученик" : user.role === "teacher" ? "Преподаватель" : "Администратор"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.status === "blocked"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {user.status === "active" ? "Активен" : user.status === "blocked" ? "Заблокирован" : "Приглашён"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.registeredAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.lastActivityAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={user.role === "admin"}
                        className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {user.status === "blocked" ? "Разблокировать" : "Заблокировать"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-semibold text-foreground">Заявки преподавателей</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Здесь администратор подтверждает или отклоняет заявки из форм «Оставить заявку» и «Регистрация преподавателя».
        </p>

        <div className="mt-4 space-y-3">
          {tutorApplications.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              Заявок пока нет.
            </p>
          ) : (
            tutorApplications.map((application) => (
              <article key={application.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{application.fullName}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      application.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : application.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {application.status === "pending"
                      ? "На проверке"
                      : application.status === "approved"
                        ? "Одобрена"
                        : "Отклонена"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {application.email} · {application.phone}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Предметы: {application.subjects}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Опыт: {application.experience} · Источник: {application.source === "lead_form" ? "Лид-форма" : "Регистрация"}
                </p>
                {application.message ? <p className="mt-1 text-xs text-muted-foreground">Комментарий: {application.message}</p> : null}
                {application.adminNote ? <p className="mt-1 text-xs font-medium text-primary">Решение: {application.adminNote}</p> : null}

                {application.status === "pending" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moderateTutorApplication(application.id, "approved")}
                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Одобрить
                    </button>
                    <button
                      type="button"
                      onClick={() => moderateTutorApplication(application.id, "rejected")}
                      className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Отклонить
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
