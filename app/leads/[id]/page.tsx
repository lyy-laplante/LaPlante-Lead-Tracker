import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import { getDatabase } from "@netlify/database";
import { Lead } from "@/lib/types";

export default async function EditLeadPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDatabase();
  const [lead] = await db.sql<Lead>`SELECT * FROM leads WHERE id = ${params.id}`;

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display mb-6 text-2xl font-semibold text-ink">
          Edit lead
        </h1>
        <div className="rounded-lg border border-black/5 bg-surface p-6 shadow-sm">
          <LeadForm mode="edit" initial={lead} />
        </div>
      </main>
    </div>
  );
}
