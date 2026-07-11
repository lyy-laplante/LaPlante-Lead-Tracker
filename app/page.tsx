import Link from "next/link";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { getDatabase } from "@netlify/database";
import { Lead, SOURCE_LABELS } from "@/lib/types";
import { formatDate, getUrgency, daysOverdue } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const db = getDatabase();
  const leads = await db.sql<Lead>`
    SELECT * FROM leads
    ORDER BY next_follow_up_date ASC NULLS LAST
  `;

  const active = leads.filter((l) => l.status !== "scheduled" && l.status !== "lost");
  const dueNow = active
    .filter((l) => {
      const urgency = getUrgency(l.next_follow_up_date);
      return urgency === "overdue" || urgency === "due-today";
    })
    .sort((a, b) => daysOverdue(b.next_follow_up_date) - daysOverdue(a.next_follow_up_date));

  const everyoneElse = leads.filter((l) => !dueNow.includes(l));

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Follow up today
          </h1>
          <p className="mt-1 text-sm text-muted">
            Leads that are overdue or due for a check-in today, most overdue first.
          </p>

          {dueNow.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-black/10 bg-surface/60 px-6 py-8 text-center text-sm text-muted">
              Nothing due right now. New follow-ups will show up here.
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {dueNow.map((lead) => {
                const urgency = getUrgency(lead.next_follow_up_date);
                const overdueDays = daysOverdue(lead.next_follow_up_date);
                return (
                  <li key={lead.id}>
                    <Link
                      href={`/leads/${lead.id}`}
                      className={`ledger-tab ledger-tab--${
                        urgency === "overdue" ? "overdue" : "due"
                      } flex items-center justify-between rounded-md border border-black/5 bg-surface py-3 pl-5 pr-4 shadow-sm transition hover:border-black/10`}
                    >
                      <div>
                        <p className="font-medium text-ink">{lead.name}</p>
                        <p className="text-xs text-muted">
                          {SOURCE_LABELS[lead.source]}
                          {lead.property_address ? ` · ${lead.property_address}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={lead.status} />
                        <span
                          className={`text-xs font-medium ${
                            urgency === "overdue" ? "text-overdue" : "text-due"
                          }`}
                        >
                          {urgency === "overdue"
                            ? `${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue`
                            : "Due today"}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            All leads
          </h2>

          {leads.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-black/10 bg-surface/60 px-6 py-10 text-center">
              <p className="text-sm text-muted">
                No leads yet. Add one to start tracking follow-ups.
              </p>
              <Link
                href="/leads/new"
                className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
              >
                Add lead
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-black/5 bg-surface shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-black/5 bg-black/[0.02] text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Last contact</th>
                    <th className="px-4 py-3 font-medium">Next follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {everyoneElse.map((lead) => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-black/[0.015]"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/leads/${lead.id}`} className="font-medium text-ink">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {SOURCE_LABELS[lead.source]}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(lead.last_contact_date)}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(lead.next_follow_up_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
