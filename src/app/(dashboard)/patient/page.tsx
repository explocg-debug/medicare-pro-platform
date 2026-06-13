import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  ClipboardList,
  Droplets,
  FileText,
  Heart,
  MessageSquare,
  Thermometer,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  doctorMap,
  doctorName,
  firstName,
  getDoctorDirectory,
  parseMedications,
  prescriptionValidityPercent,
  requirePatientContext,
} from "@/lib/patient-data";
import { formatDate, formatTime, getInitials } from "@/lib/utils";

export default async function PatientOverviewPage() {
  const { supabase, user, profile, patient } = await requirePatientContext();
  const now = new Date().toISOString();

  const [
    { data: appointments },
    { data: prescriptions },
    { data: records },
    { data: latestVital },
    { data: alert },
    doctors,
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", patient.id)
      .in("status", ["scheduled", "confirmed"])
      .gte("scheduled_at", now)
      .order("scheduled_at")
      .limit(3),
    supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", patient.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("vital_readings")
      .select("*")
      .eq("patient_id", patient.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getDoctorDirectory(supabase),
  ]);

  const doctorsById = doctorMap(doctors);
  const vitals = latestVital
    ? [
        latestVital.blood_pressure_systolic &&
        latestVital.blood_pressure_diastolic
          ? {
              label: "Blood Pressure",
              value: `${latestVital.blood_pressure_systolic}/${latestVital.blood_pressure_diastolic}`,
              unit: "mmHg",
              icon: Heart,
              color: "text-red-500",
              bg: "bg-red-50",
            }
          : null,
        latestVital.heart_rate
          ? {
              label: "Heart Rate",
              value: String(latestVital.heart_rate),
              unit: "bpm",
              icon: Activity,
              color: "text-blue-600",
              bg: "bg-blue-50",
            }
          : null,
        latestVital.temperature_celsius
          ? {
              label: "Temperature",
              value: String(
                Math.round(
                  (Number(latestVital.temperature_celsius) * 9 / 5 + 32) * 10,
                ) / 10,
              ),
              unit: "°F",
              icon: Thermometer,
              color: "text-amber-600",
              bg: "bg-amber-50",
            }
          : null,
        latestVital.blood_glucose_mg_dl
          ? {
              label: "Blood Glucose",
              value: String(latestVital.blood_glucose_mg_dl),
              unit: "mg/dL",
              icon: Droplets,
              color: "text-green-600",
              bg: "bg-green-50",
            }
          : null,
      ].filter((vital): vital is NonNullable<typeof vital> => vital !== null)
    : [];

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Hello, {firstName(profile.full_name)}!
          </h2>
          <p className="text-sm text-gray-500">
            {formatDate(new Date())} — Your live health summary
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
          <Link href="/patient/appointments">
            <Calendar className="h-4 w-4" /> Book Appointment
          </Link>
        </Button>
      </div>

      {alert && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">{alert.title}</p>
            <p className="text-xs text-amber-600">{alert.message}</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={alert.link || "/patient/notifications"}>Open</Link>
          </Button>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Latest Vitals</h3>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
            <Link href="/patient/health">
              View history <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        {vitals.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {vitals.map(({ label, value, unit, icon: Icon, color, bg }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <div className={`p-2 rounded-lg w-fit mb-3 ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400">{unit}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                  <Badge variant="success" className="text-[10px] mt-2">
                    Latest
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-gray-500">
              No vital readings yet. Add your first reading from My Health.
            </CardContent>
          </Card>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
              <Link href="/patient/appointments">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments?.length ? appointments.map((appointment) => {
              const doctor = doctorsById.get(appointment.doctor_id);
              const name = doctorName(doctor);
              return (
                <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">
                      {doctor?.specialization || "General care"} · {appointment.type}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(appointment.scheduled_at)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTime(appointment.scheduled_at)}
                    </p>
                  </div>
                  <Badge variant={appointment.status === "confirmed" ? "success" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              );
            }) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No upcoming appointments.
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full border-dashed text-gray-500">
              <Link href="/patient/appointments">
                <Calendar className="h-4 w-4" /> Book New Appointment
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Active Prescriptions</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
              <Link href="/patient/prescriptions">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {prescriptions?.length ? prescriptions.map((prescription) => {
              const medications = parseMedications(prescription.medications);
              const validity = prescriptionValidityPercent(
                prescription.created_at,
                prescription.valid_until,
              );
              return (
                <div key={prescription.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {medications.map((medication) => medication.name).join(", ") || "Prescription"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {prescription.valid_until
                          ? `Valid through ${formatDate(prescription.valid_until)}`
                          : "No expiration date"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{validity}%</span>
                  </div>
                  <Progress value={validity} className="h-1.5" />
                </div>
              );
            }) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No active prescriptions.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Medical Records</CardTitle>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-green-600">
            <Link href="/patient/records">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {records?.length ? (
            <div className="divide-y divide-gray-50">
              {records.map((record) => {
                const doctor = doctorsById.get(record.doctor_id);
                return (
                  <div key={record.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{record.diagnosis}</p>
                      <p className="text-xs text-gray-400">
                        {doctorName(doctor)} · {doctor?.specialization || "Medical record"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(record.created_at)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500">
              No medical records have been added yet.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Book Appointment", href: "/patient/appointments", icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
          { label: "View Records", href: "/patient/records", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Message Doctor", href: "/patient/messages", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "My Prescriptions", href: "/patient/prescriptions", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, href, icon: Icon, color, bg }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg}`}>
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
