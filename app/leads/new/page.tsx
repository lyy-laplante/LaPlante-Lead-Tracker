import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display mb-6 text-2xl font-semibold text-ink">
          Add a lead
        </h1>
        <div className="rounded-lg border border-black/5 bg-surface p-6 shadow-sm">
          <LeadForm mode="create" />
        </div>
      </main>
    </div>
  );
}
