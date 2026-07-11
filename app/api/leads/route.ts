import { NextRequest, NextResponse } from "next/server";
import { getUser, verifyRequestOrigin } from "@netlify/identity";
import { getDatabase } from "@netlify/database";
import { Lead } from "@/lib/types";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const leads = await db.sql<Lead>`
    SELECT * FROM leads
    ORDER BY next_follow_up_date ASC NULLS LAST
  `;

  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    verifyRequestOrigin(req);
  } catch {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const db = getDatabase();
  const [lead] = await db.sql<Lead>`
    INSERT INTO leads (
      name, contact_info, property_address, source, status,
      last_contact_date, next_follow_up_date, notes
    ) VALUES (
      ${body.name},
      ${body.contact_info ?? null},
      ${body.property_address ?? null},
      ${body.source ?? "phone"},
      ${body.status ?? "new"},
      ${body.last_contact_date ?? null},
      ${body.next_follow_up_date ?? null},
      ${body.notes ?? null}
    )
    RETURNING *
  `;

  return NextResponse.json({ lead }, { status: 201 });
}
