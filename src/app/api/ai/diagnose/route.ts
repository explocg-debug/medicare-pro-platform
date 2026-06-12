import { NextRequest, NextResponse } from "next/server";
import { aiDiagnosisSupport } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json({ error: "Invalid symptoms array" }, { status: 400 });
    }

    const result = await aiDiagnosisSupport(symptoms);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI diagnose error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Ensure Ollama is running at localhost:11434." },
      { status: 503 }
    );
  }
}
