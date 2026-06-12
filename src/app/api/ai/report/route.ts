import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await generateReport(data);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI report error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Ensure Ollama is running at localhost:11434." },
      { status: 503 }
    );
  }
}
