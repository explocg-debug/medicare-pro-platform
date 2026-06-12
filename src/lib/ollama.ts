const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function ollamaChat(
  messages: OllamaMessage[],
  model = OLLAMA_MODEL
): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.message?.content ?? "";
}

export async function generatePatientSummary(patientData: {
  name: string;
  age: number;
  conditions: string[];
  medications: string[];
  recentVisit?: string;
}): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: "system",
      content:
        "You are a clinical assistant. Generate concise, professional patient summaries in 2-3 sentences. Focus on key health status and recent changes.",
    },
    {
      role: "user",
      content: `Generate a summary for patient: ${JSON.stringify(patientData)}`,
    },
  ];
  return ollamaChat(messages);
}

export async function aiDiagnosisSupport(symptoms: string[]): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: "system",
      content:
        "You are a medical AI assistant supporting doctors. Based on symptoms, suggest possible diagnoses and recommended diagnostic tests. Always note this is for clinical support only and not a replacement for professional judgment.",
    },
    {
      role: "user",
      content: `Patient presents with: ${symptoms.join(", ")}. What are the differential diagnoses and recommended investigations?`,
    },
  ];
  return ollamaChat(messages);
}

export async function generateReport(data: {
  type: string;
  period: string;
  metrics: Record<string, unknown>;
}): Promise<string> {
  const messages: OllamaMessage[] = [
    {
      role: "system",
      content:
        "You are a healthcare analytics assistant. Generate clear, professional reports from provided data. Use structured formatting.",
    },
    {
      role: "user",
      content: `Generate a ${data.type} report for ${data.period}: ${JSON.stringify(data.metrics)}`,
    },
  ];
  return ollamaChat(messages);
}
