import { NextResponse } from "next/server";
import {
  getRepairMemoByMemoId,
  insertRepairMemo,
} from "@/app/lib/models/repairMemo";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const memoId = uuidv4();
    const { vehicleNumber, date, parts } = body;
    const total = parts.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );

    const memo = {
      memoId,
      vehicleNumber,
      date,
      parts,
      total,
    };

    const result = await insertRepairMemo(memo);
    return NextResponse.json({ success: true, memoId, id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/repair-memo?memoId=xxxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memoId = searchParams.get("memoId");
  if (!memoId) {
    return NextResponse.json(
      { success: false, error: "memoId is required" },
      { status: 400 }
    );
  }
  try {
    const memo = await getRepairMemoByMemoId(memoId);
    if (!memo) {
      return NextResponse.json(
        { success: false, error: "Memo not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, memo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
