export type LeadSource = "website" | "phone" | "email" | "referral" | "other";

export type LeadStatus =
  | "new"
  | "contacted"
  | "waiting"
  | "scheduled"
  | "lost";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact_info: string | null;
  property_address: string | null;
  source: LeadSource;
  status: LeadStatus;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  notes: string | null;
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  phone: "Phone",
  email: "Email",
  referral: "Referral",
  other: "Other",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  waiting: "Waiting to hear back",
  scheduled: "Scheduled",
  lost: "Not moving forward",
};
