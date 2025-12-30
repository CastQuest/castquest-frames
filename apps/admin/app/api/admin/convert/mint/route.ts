import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id");
  console.log("[ADMIN] Convert to MINT:", id);
  return NextResponse.redirect(`/media/${id}`);
}
