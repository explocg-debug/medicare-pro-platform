"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { FileText, Download, Upload, TrendingUp, Users, Calendar, Activity, Loader2, Brain } from "lucide-react";

const monthlyPatients = [
  { month: "Jan", patients: 38, appointments: 55 },
  { month: "Feb", patients: 42, appointments: 62 },
  { month: "Mar", patients: 45, appointments: 70 },
  { month: "Apr", patients: 51, appointments: 78 },
  { month: "May", patients: 48, appointments: 72 },
  { month: "Jun", patients: 55, appointments: 85 },
];

const conditionDistribution = [
  { name: "Hypertension", value: 35 },
  { name: "Diabetes", value: 22 },
  { name: "Asthma", value: 15 },
  { name: "Arthritis", value: 12 },
  { name: "Other", value: 16 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#6b7280"];

const documents = [
  { id: "1", name: "Monthly Report - May 2026", type: "PDF", size: "2.4 MB", date: "2026-06-01", status: "final" },
  { id: "2", name: "Patient Lab Results - James Wilson", type: "PDF", size: "1.1 MB", date: "2026-06-08", status: "pending" },
  { id: "3", name: "Annual Statistics Q1 2026", type: "XLSX", size: "3.8 MB", date: "2026-04-05", status: "final" },
  { id: "4", name: "Prescription Summary - June", type: "PDF", size: "0.8 MB", date: "2026-06-09", status: "draft" },
];

const docStatusVariant = { final: "success", pending: "warning", draft: "secondary" } as const;

export default function DoctorReportsPage() {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");

  async function generateAIReport() {
    setGeneratingReport(true);
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "monthly", period: "June 2026", metrics: { patients: 248, appointments: 85, diagnoses: 32 } }),
      });
      const data = await res.json();
      setGeneratedReport(data.result || "Report generated successfully.");
    } catch {
      setGeneratedReport("Unable to reach AI service. Ensure Ollama is running.");
    }
    setGeneratingReport(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Clinical data insights and document management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload
          </Button>
          <Button size="sm" onClick={generateAIReport} disabled={generatingReport} className="gap-2">
            {generatingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {generatingReport ? "Generating…" : "AI Report"}
          </Button>
        </div>
      </div>

      {generatedReport && (
        <Card className="border-purple-100 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2.5">
              <Brain className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1.5">AI-Generated Report</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{generatedReport}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Patients", value: "248", icon: Users, color: "text-blue-600", bg: "bg-blue-50", change: "+12%" },
          { label: "Appointments", value: "85", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", change: "+18%" },
          { label: "Diagnoses Made", value: "67", icon: Activity, color: "text-green-600", bg: "bg-green-50", change: "+8%" },
          { label: "Avg. Satisfaction", value: "4.8/5", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", change: "+0.2" },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-xs text-green-600 font-medium">{change}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Patient Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Patient & Appointment Trends</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyPatients}>
                <defs>
                  <linearGradient id="patGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
                <Area type="monotone" dataKey="patients" stroke="#3b82f6" fill="url(#patGrad)" strokeWidth={2} name="Patients" />
                <Area type="monotone" dataKey="appointments" stroke="#8b5cf6" fill="url(#apptGrad)" strokeWidth={2} name="Appointments" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Condition Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Condition Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie data={conditionDistribution} cx={75} cy={75} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {conditionDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {conditionDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-gray-600 flex-1">{item.name}</span>
                  <div className="w-20">
                    <Progress value={item.value} className="h-1.5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Documents & Files</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600">View all</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FileText className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.type} · {doc.size} · {doc.date}</p>
                </div>
                <Badge variant={docStatusVariant[doc.status as keyof typeof docStatusVariant]}>{doc.status}</Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <Download className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
