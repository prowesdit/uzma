// app/api/socket/route.ts
import { NextResponse } from "next/server";
import { getIO } from "@/app/lib/socket";

export async function POST(req: Request) {
  const io = getIO();
  const { message } = await req.json();
  io.emit("notification", { message });
  return NextResponse.json({ success: true });
}
