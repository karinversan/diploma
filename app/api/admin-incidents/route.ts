import { NextResponse } from "next/server";

import { listAdminIncidents } from "@/lib/server/admin-incident-store";

export const runtime = "nodejs";

export async function GET() {
  const incidents = await listAdminIncidents();
  return NextResponse.json({ incidents }, { status: 200 });
}
