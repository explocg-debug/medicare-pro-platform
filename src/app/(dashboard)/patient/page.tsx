"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, FileText, ClipboardList, MessageSquare, ArrowRight,
  Heart, Activity, Thermometer, Droplets, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const vitals = [
  { label: "Blood Pressure", value: "128/82", unit: "mmHg", icon: Heart, color: "text-red-500", bg: "bg-red-50", status: "normal" },
  { label: "Heart Rate", value: "74", unit: "bpm", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", status: "normal" },
  { label: "Temperature", value: "98.6", unit: "°F", icon: Thermometer, color: "text-amber-600", bg: "bg-amber-50", status: "normal" },
  { label: "Blood Sugar", value: "94", unit: "mg/dL", icon: Droplets, color: "text-green-600", bg: "bg-green-50", status: "normal" },
];

const upcomingAppointments = [
  { id: "1", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine", date: "2026-06-13", time: "10:30 AM", type: "Follow-up", status: "confirmed" },
  { id: "2", doctor: "Dr. Michael Chen", specialty: "Cardiology", date: "2026-06-20", time: "2:00 PM", type: "Check-up", status: "scheduled" },
];

const activePrescriptions = [
  { id: "rx1", medication: "Lisinopril 10mg", dosage: "1 daily", refillBy: "2026-07-08", remaining: 85 },
  { id: "rx2", medication: "Amlodipine 5mg", dosage: "1 daily", refillBy: "2026-07-08", remaining: 72 },
  { id: "rx3", medication: "Aspirin 81mg", dosage: "1 daily", refillBy: "2026-08-02", remaining: 90 },
];

const recentRecords = [
  { id: "1", type: "Consultation", doctor: "Dr. Sarah Johnson", date: "2026-06-08", diagnosis: "Hypertension management" },
  { id: "2", type: "Lab Test", doctor: "Lab Dept.", date: "2026-06-05", diagnosis: "Blood panel results" },
  { id: "3", type: "Follow-up", doctor: "Dr. Sarah Johnson", date: "2026-05-12", diagnosis: "Annual check-up" },
];

export default function PatientOverviewPage() {
  return (
    <div className="space-y-6 max-w-full">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hello, James!</h2>
          <p className="text-sm text-gray-500">{formatDate(new Date())} — Your health summary</p>
        </div>
        <Link href="/patient/appointments/new">
          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Calendar className="h-4 w-4" /> Book Appointment
          </Button>
        </Link>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">Prescription Refill Due</p>
          <p className="text-xs text-amber-600">Lisinopril 10mg needs refill by Jul 8. Contact Dr. Johnson.</p>
        </div>
        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0">
          Request Refill
        </Button>
      </div>

      {/* Vitals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Latest Vitals</h3>
          <Link href="/patient/health">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
              View history <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {vitals.map(({ label, value, unit, icon: Icon, color, bg, status }) => (
            <Card key={label} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg w-fit mb-3 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{unit}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
                <Badge variant="success" className="text-[10px] mt-2">{status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Link href="/patient/appointments">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
                All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                    {appt.doctor.split(" ").map((n) => n[0]).join("").slice(1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{appt.doctor}</p>
                  <p className="text-xs text-gray-400">{appt.specialty} · {appt.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-900">{formatDate(appt.date)}</p>
                  <p className="text-xs text-gray-400">{appt.time}</p>
                </div>
                <Badge variant={appt.status === "confirmed" ? "success" : "secondary"}>{appt.status}</Badge>
              </div>
            ))}
            <Link href="/patient/appointments/new">
              <Button variant="outline" size="sm" className="w-full gap-2 border-dashed text-gray-400 hover:text-gray-600">
                <Calendar className="h-4 w-4" /> Book New Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Active Prescriptions</CardTitle>
            <Link href="/patient/prescriptions">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-green-600">All <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePrescriptions.map((rx) => (
              <div key={rx.id}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rx.medication}</p>
                    <p className="text-xs text-gray-400">{rx.dosage}</p>
                  </div>
                  <span className="text-xs text-gray-500">{rx.remaining}%</span>
                </div>
                <Progress value={rx.remaining} className="h-1.5" />
                <p className="text-xs text-gray-400 mt-1">Refill by {formatDate(rx.refillBy)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Medical Records</CardTitle>
          <Link href="/patient/records">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-green-600">View all <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{record.diagnosis}</p>
                  <p className="text-xs text-gray-400">{record.type} · {record.doctor}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                  <Button variant="ghost" size="sm" className="text-xs h-6 text-blue-600 mt-0.5">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Book Appointment", href: "/patient/appointments", icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
          { label: "View Records", href: "/patient/records", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Message Doctor", href: "/patient/messages", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "My Prescriptions", href: "/patient/prescriptions", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, href, icon: Icon, color, bg }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
