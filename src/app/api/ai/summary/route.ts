import { NextRequest, NextResponse } from "next/server";
import { generatePatientSummary } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await generatePatientSummary(data);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { error: "AI service unavailable." },
      { status: 503 }
    );
  }
}
