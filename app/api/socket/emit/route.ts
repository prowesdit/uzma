// app/api/socket/emit/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // @ts-ignore
  const io = globalThis.io || (globalThis.io = require("socket.io")(3001));
  const { message } = await req.json();
  io.emit("notification", { message });
  return NextResponse.json({ success: true });
}
