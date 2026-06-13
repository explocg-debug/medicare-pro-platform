"use client";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Calendar, ClipboardList, Activity, TrendingUp, Clock, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useProfileName } from "@/hooks/use-profile-name";
import { formatDate, formatTime, getInitials } from "@/lib/utils";

const stats = [
  { title: "Total Patients", value: "248", change: "+12 this month", changeType: "up" as const, icon: Users, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  { title: "Today's Appointments", value: "8", change: "2 pending", changeType: "neutral" as const, icon: Calendar, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
  { title: "Active Prescriptions", value: "134", change: "+5 this week", changeType: "up" as const, icon: ClipboardList, iconColor: "text-green-600", iconBg: "bg-green-50" },
  { title: "Avg. Consultations/Day", value: "12.4", change: "+2.1 vs last month", changeType: "up" as const, icon: Activity, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
];

const todayAppointments = [
  { id: "1", patient: "James Wilson", time: "09:00", type: "Follow-up", status: "completed" },
  { id: "2", patient: "Maria Garcia", time: "10:30", type: "Consultation", status: "completed" },
  { id: "3", patient: "Robert Chen", time: "11:00", type: "Check-up", status: "in_progress" },
  { id: "4", patient: "Emily Davis", time: "13:00", type: "Lab Review", status: "scheduled" },
  { id: "5", patient: "Michael Brown", time: "14:30", type: "Consultation", status: "scheduled" },
  { id: "6", patient: "Sarah Lee", time: "15:00", type: "Follow-up", status: "scheduled" },
  { id: "7", patient: "David Kim", time: "16:00", type: "Prescription", status: "scheduled" },
  { id: "8", patient: "Anna White", time: "17:00", type: "Consultation", status: "scheduled" },
];

const recentPatients = [
  { id: "1", name: "James Wilson", condition: "Hypertension", age: 54, lastVisit: "2026-06-08", status: "stable" },
  { id: "2", name: "Maria Garcia", condition: "Type 2 Diabetes", age: 47, lastVisit: "2026-06-08", status: "stable" },
  { id: "3", name: "Robert Chen", condition: "Asthma", age: 32, lastVisit: "2026-06-09", status: "review" },
  { id: "4", name: "Emily Davis", condition: "Anemia", age: 29, lastVisit: "2026-06-07", status: "stable" },
  { id: "5", name: "Michael Brown", condition: "Arthritis", age: 61, lastVisit: "2026-06-06", status: "critical" },
];

const statusStyles = {
  completed: "success",
  in_progress: "info",
  scheduled: "secondary",
  cancelled: "destructive",
  stable: "success",
  review: "warning",
  critical: "destructive",
} as const;

export default function DoctorOverviewPage() {
  const today = formatDate(new Date());
  const userName = useProfileName("Doctor");

  return (
    <div className="space-y-6 max-w-full">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Good morning, {userName}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{today} — You have 8 appointments today</p>
        </div>
        <Link href="/doctor/appointments/new">
          <Button size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
              <CardDescription>{today}</CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-600">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 w-16 text-xs font-medium text-gray-500">
                      <Clock className="h-3 w-3" />
                      {appt.time}
                    </div>
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{getInitials(appt.patient)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appt.patient}</p>
                      <p className="text-xs text-gray-400">{appt.type}</p>
                    </div>
                  </div>
                  <Badge variant={statusStyles[appt.status as keyof typeof statusStyles] ?? "secondary"}>
                    {appt.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Patients</CardTitle>
            <Link href="/doctor/patients">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-600">
                All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentPatients.map((patient) => (
                <Link key={patient.id} href={`/doctor/patients/${patient.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{getInitials(patient.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                      <p className="text-xs text-gray-400 truncate">{patient.condition}</p>
                    </div>
                    <Badge variant={statusStyles[patient.status as keyof typeof statusStyles] ?? "secondary"} className="text-[10px] shrink-0">
                      {patient.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "New Diagnosis", href: "/doctor/diagnoses/new", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Write Prescription", href: "/doctor/prescriptions/new", icon: ClipboardList, color: "text-green-600", bg: "bg-green-50" },
          { label: "Upload Report", href: "/doctor/reports/upload", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "View Analytics", href: "/doctor/analytics", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
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
