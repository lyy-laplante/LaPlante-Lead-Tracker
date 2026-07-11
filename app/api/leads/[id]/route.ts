import { NextRequest, NextResponse } from "next/server";
import { getUser, verifyRequestOrigin } from "@netlify/identity";
import { getDatabase } from "@netlify/database";
import { Lead } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const [lead] = await db.sql<Lead>`SELECT * FROM leads WHERE id = ${params.id}`;

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    UPDATE leads SET
      name = ${body.name},
      contact_info = ${body.contact_info ?? null},
      property_address = ${body.property_address ?? null},
      source = ${body.source ?? "phone"},
      status = ${body.status ?? "new"},
      last_contact_date = ${body.last_contact_date ?? null},
      next_follow_up_date = ${body.next_follow_up_date ?? null},
      notes = ${body.notes ?? null}
    WHERE id = ${params.id}
    RETURNING *
  `;

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    verifyRequestOrigin(req);
  } catch {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const db = getDatabase();
  await db.sql`DELETE FROM leads WHERE id = ${params.id}`;

  return NextResponse.json({ ok: true });
}
