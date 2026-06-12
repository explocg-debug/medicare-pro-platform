"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pill, Printer, RefreshCw, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const prescriptions = [
  {
    id: "rx1", status: "active",
    medications: [
      { name: "Lisinopril 10mg", dosage: "1 tablet once daily", morning: true, evening: false, withFood: false },
      { name: "Amlodipine 5mg", dosage: "1 tablet once daily", morning: true, evening: false, withFood: false },
    ],
    prescribedBy: "Dr. Sarah Johnson",
    date: "2026-06-08",
    validUntil: "2026-07-08",
    instructions: "Take with water. Avoid alcohol. Monitor blood pressure daily.",
    remaining: 85,
    refillsLeft: 2,
  },
  {
    id: "rx2", status: "active",
    medications: [
      { name: "Aspirin 81mg", dosage: "1 tablet once daily", morning: true, evening: false, withFood: true },
    ],
    prescribedBy: "Dr. Sarah Johnson",
    date: "2026-04-02",
    validUntil: "2026-08-02",
    instructions: "Take with food to reduce stomach upset.",
    remaining: 90,
    refillsLeft: 3,
  },
  {
    id: "rx3", status: "completed",
    medications: [
      { name: "Tamiflu 75mg", dosage: "1 capsule twice daily for 5 days", morning: true, evening: true, withFood: true },
    ],
    prescribedBy: "Dr. Wilson",
    date: "2026-02-15",
    validUntil: "2026-02-20",
    instructions: "Complete the full course even if feeling better.",
    remaining: 0,
    refillsLeft: 0,
  },
];

export default function PatientPrescriptionsPage() {
  const active = prescriptions.filter((rx) => rx.status === "active");
  const completed = prescriptions.filter((rx) => rx.status === "completed");
  const needsRefill = active.filter((rx) => rx.remaining < 30);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Prescriptions</h2>
        <p className="text-sm text-gray-500">{active.length} active prescriptions</p>
      </div>

      {needsRefill.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Refill Needed Soon</p>
            <p className="text-xs text-amber-600">{needsRefill.map((rx) => rx.medications[0].name).join(", ")} — contact your doctor to request a refill.</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active Prescriptions</h3>
        <div className="space-y-4">
          {active.map((rx) => (
            <Card key={rx.id} className="border-green-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Prescribed by {rx.prescribedBy}</p>
                    <p className="text-xs text-gray-400">Valid until {formatDate(rx.validUntil)} · {rx.refillsLeft} refill(s) left</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                      <Printer className="h-3 w-3" /> Print
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs h-7 bg-green-600 hover:bg-green-700">
                      <RefreshCw className="h-3 w-3" /> Request Refill
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Medication remaining</span>
                    <span className="text-xs font-medium text-gray-700">{rx.remaining}%</span>
                  </div>
                  <Progress value={rx.remaining} className={`h-2 ${rx.remaining < 30 ? "[&>div]:bg-amber-500" : ""}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {rx.medications.map((med) => (
                  <div key={med.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-50 rounded-lg shrink-0">
                      <Pill className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{med.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{med.dosage}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {med.morning && <Badge variant="info" className="text-[10px]">Morning</Badge>}
                        {med.evening && <Badge variant="secondary" className="text-[10px]">Evening</Badge>}
                        {med.withFood && <Badge variant="warning" className="text-[10px]">With Food</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
                {rx.instructions && (
                  <p className="text-xs text-gray-500 italic border-l-2 border-green-200 pl-3">{rx.instructions}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Completed Prescriptions</h3>
        {completed.map((rx) => (
          <Card key={rx.id} className="opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  {rx.medications.map((med) => (
                    <div key={med.name} className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{med.name}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 mt-1">{rx.prescribedBy} · {formatDate(rx.date)}</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
