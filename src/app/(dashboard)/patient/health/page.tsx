"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Heart, Activity, Thermometer, Droplets, Target } from "lucide-react";

const bpHistory = [
  { date: "Jan", systolic: 145, diastolic: 90 },
  { date: "Feb", systolic: 142, diastolic: 88 },
  { date: "Mar", systolic: 138, diastolic: 87 },
  { date: "Apr", systolic: 135, diastolic: 85 },
  { date: "May", systolic: 132, diastolic: 83 },
  { date: "Jun", systolic: 128, diastolic: 82 },
];

const weightHistory = [
  { date: "Jan", weight: 186 },
  { date: "Feb", weight: 185 },
  { date: "Mar", weight: 184 },
  { date: "Apr", weight: 184 },
  { date: "May", weight: 183 },
  { date: "Jun", weight: 182 },
];

const healthGoals = [
  { goal: "Blood Pressure < 130/80", progress: 75, status: "In Progress" },
  { goal: "Daily 30-min Walk", progress: 90, status: "On Track" },
  { goal: "Target Weight: 175 lbs", progress: 40, status: "In Progress" },
  { goal: "Sodium Intake < 2g/day", progress: 60, status: "On Track" },
];

const latestVitals = [
  { label: "Blood Pressure", value: "128/82 mmHg", icon: Heart, color: "text-red-500", bg: "bg-red-50", status: "normal", trend: "Improving" },
  { label: "Heart Rate", value: "74 bpm", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", status: "normal", trend: "Stable" },
  { label: "Temperature", value: "98.6°F", icon: Thermometer, color: "text-amber-600", bg: "bg-amber-50", status: "normal", trend: "Normal" },
  { label: "Blood Sugar", value: "94 mg/dL", icon: Droplets, color: "text-green-600", bg: "bg-green-50", status: "normal", trend: "Normal" },
];

export default function PatientHealthPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Health</h2>
        <p className="text-sm text-gray-500">Track your health metrics and goals</p>
      </div>

      {/* Current Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {latestVitals.map(({ label, value, icon: Icon, color, bg, status, trend }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className={`p-2 rounded-lg w-fit mb-3 ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-sm font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="success" className="text-[10px]">{status}</Badge>
                <span className="text-xs text-green-600">{trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* BP Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" /> Blood Pressure Trend
            </CardTitle>
            <CardDescription>6-month history</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bpHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 160]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Weight Trend</CardTitle>
            <CardDescription>Target: 175 lbs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[170, 190]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} name="Weight (lbs)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Health Goals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" /> Health Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {healthGoals.map((goal) => (
            <div key={goal.goal}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-gray-900">{goal.goal}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">{goal.progress}%</span>
                  <Badge variant={goal.status === "On Track" ? "success" : "warning"} className="text-[10px]">{goal.status}</Badge>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
