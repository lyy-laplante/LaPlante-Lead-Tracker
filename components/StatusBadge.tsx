import { LeadStatus, STATUS_LABELS } from "@/lib/types";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-primary/10 text-primary-dark",
  contacted: "bg-accent/10 text-accent",
  waiting: "bg-waiting/10 text-waiting",
  scheduled: "bg-scheduled/10 text-scheduled",
  lost: "bg-lost/20 text-muted",
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
