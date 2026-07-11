function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export type FollowUpUrgency = "overdue" | "due-today" | "upcoming" | "none";

export function getUrgency(nextFollowUpDate: string | null): FollowUpUrgency {
  if (!nextFollowUpDate) return "none";
  const today = todayISO();
  if (nextFollowUpDate < today) return "overdue";
  if (nextFollowUpDate === today) return "due-today";
  return "upcoming";
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysOverdue(dateStr: string | null): number {
  if (!dateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const diff = Math.floor((today.getTime() - target.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}
