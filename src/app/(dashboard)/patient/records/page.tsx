"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, ChevronDown, ChevronUp, Pill } from "lucide-react";
import { formatDate } from "@/lib/utils";

const records = [
  {
    id: "1", date: "2026-06-08", type: "Consultation", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine",
    diagnosis: "Hypertension management — stable",
    symptoms: ["Occasional dizziness", "Slight headache"],
    notes: "Blood pressure well controlled on current medication. Continue Lisinopril and Amlodipine. Lifestyle modifications reinforced.",
    vitals: { bp: "128/82", hr: "74", temp: "98.6", weight: "182 lbs" },
    prescriptions: ["Lisinopril 10mg – continue", "Amlodipine 5mg – continue"],
  },
  {
    id: "2", date: "2026-06-05", type: "Lab Test", doctor: "Lab Department", specialty: "Pathology",
    diagnosis: "Blood panel — results normal",
    symptoms: [],
    notes: "Complete blood count and metabolic panel within normal range. Cholesterol slightly elevated at 210 mg/dL — dietary advice given.",
    vitals: {},
    prescriptions: [],
  },
  {
    id: "3", date: "2026-05-12", type: "Follow-up", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine",
    diagnosis: "Annual check-up",
    symptoms: ["Fatigue"],
    notes: "Overall health good. Slight fatigue reported — recommend improving sleep schedule. All preventive screenings up to date.",
    vitals: { bp: "132/85", hr: "76", temp: "98.4", weight: "183 lbs" },
    prescriptions: [],
  },
  {
    id: "4", date: "2026-04-02", type: "Consultation", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine",
    diagnosis: "Hypertension follow-up — adjusted medication",
    symptoms: ["Elevated blood pressure"],
    notes: "BP slightly elevated at 148/92. Increased Amlodipine to 5mg. Follow-up in 6 weeks.",
    vitals: { bp: "148/92", hr: "80", temp: "98.7", weight: "184 lbs" },
    prescriptions: ["Amlodipine increased to 5mg"],
  },
  {
    id: "5", date: "2026-02-15", type: "Emergency", doctor: "Dr. Wilson", specialty: "General Practice",
    diagnosis: "Influenza — treated",
    symptoms: ["Fever", "Body aches", "Fatigue", "Cough"],
    notes: "Influenza A confirmed by rapid test. Prescribed antiviral. Rest advised for 5–7 days.",
    vitals: { temp: "101.2", hr: "88" },
    prescriptions: ["Tamiflu 75mg – 5 days (completed)"],
  },
];

const typeVariant = { Consultation: "info", "Lab Test": "secondary", "Follow-up": "success", Emergency: "destructive" } as const;

export default function PatientRecordsPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = records.filter(
    (r) => r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Medical Records</h2>
        <p className="text-sm text-gray-500">{records.length} records in your history</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <Input placeholder="Search records…" className="pl-8 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((record) => {
          const isOpen = expanded === record.id;
          return (
            <Card key={record.id} className="overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setExpanded(isOpen ? null : record.id)}
              >
                <CardContent className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="p-2.5 bg-blue-50 rounded-lg shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                      <Badge variant={typeVariant[record.type as keyof typeof typeVariant] ?? "secondary"} className="text-xs">{record.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{record.doctor} · {formatDate(record.date)}</p>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </CardContent>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-4">
                  {/* Notes */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Doctor Notes</p>
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>

                  {/* Symptoms */}
                  {record.symptoms.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Symptoms Reported</p>
                      <div className="flex flex-wrap gap-1.5">
                        {record.symptoms.map((s) => (
                          <span key={s} className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5 text-gray-600">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitals */}
                  {Object.keys(record.vitals).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Vitals at Visit</p>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(record.vitals).map(([k, v]) => (
                          <div key={k} className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-center">
                            <p className="text-xs text-gray-400 capitalize">{k === "bp" ? "Blood Pressure" : k === "hr" ? "Heart Rate" : k === "temp" ? "Temperature" : k}</p>
                            <p className="text-sm font-semibold text-gray-900">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescriptions */}
                  {record.prescriptions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Prescriptions</p>
                      <div className="space-y-1">
                        {record.prescriptions.map((rx) => (
                          <div key={rx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Pill className="h-3.5 w-3.5 text-green-600" />
                            {rx}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
