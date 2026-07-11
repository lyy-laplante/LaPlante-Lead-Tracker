"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lead, LeadSource, LeadStatus, SOURCE_LABELS, STATUS_LABELS } from "@/lib/types";

interface LeadFormProps {
  mode: "create" | "edit";
  initial?: Lead;
}

export default function LeadForm({ mode, initial }: LeadFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [contactInfo, setContactInfo] = useState(initial?.contact_info ?? "");
  const [propertyAddress, setPropertyAddress] = useState(
    initial?.property_address ?? ""
  );
  const [source, setSource] = useState<LeadSource>(initial?.source ?? "phone");
  const [status, setStatus] = useState<LeadStatus>(initial?.status ?? "new");
  const [lastContactDate, setLastContactDate] = useState(
    initial?.last_contact_date ?? new Date().toISOString().slice(0, 10)
  );
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    initial?.next_follow_up_date ?? ""
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      contact_info: contactInfo || null,
      property_address: propertyAddress || null,
      source,
      status,
      last_contact_date: lastContactDate || null,
      next_follow_up_date: nextFollowUpDate || null,
      notes: notes || null,
    };

    const url = mode === "create" ? "/api/leads" : `/api/leads/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Couldn't save this lead. Try again in a moment.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm(`Remove ${initial.name} from the tracker? This can't be undone.`)) {
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/leads/${initial.id}`, { method: "DELETE" });
    setSaving(false);

    if (!res.ok) {
      setError("Couldn't remove this lead. Try again in a moment.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Name *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Contact info
          </label>
          <input
            placeholder="Phone or email"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Property address
          </label>
          <input
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource)}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Last contact date
          </label>
          <input
            type="date"
            value={lastContactDate}
            onChange={(e) => setLastContactDate(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Next follow-up date
          </label>
          <input
            type="date"
            value={nextFollowUpDate}
            onChange={(e) => setNextFollowUpDate(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-muted">
            Leave blank if this lead doesn&apos;t need a scheduled follow-up.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Notes</label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did they say? Loan type, urgency, anything worth remembering."
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && (
        <p className="text-sm text-overdue" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "create" ? "Add lead" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            Cancel
          </button>
        </div>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="text-sm font-medium text-overdue/80 transition hover:text-overdue"
          >
            Remove lead
          </button>
        )}
      </div>
    </form>
  );
}
