"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Plus, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

const appointments = [
  { id: "1", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine", date: "2026-06-13", time: "10:30 AM", type: "Follow-up", status: "confirmed", duration: 30, notes: "Bring blood pressure log" },
  { id: "2", doctor: "Dr. Michael Chen", specialty: "Cardiology", date: "2026-06-20", time: "2:00 PM", type: "Check-up", status: "scheduled", duration: 45, notes: "" },
  { id: "3", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine", date: "2026-06-08", time: "10:30 AM", type: "Consultation", status: "completed", duration: 30, notes: "" },
  { id: "4", doctor: "Dr. Emily Rodriguez", specialty: "Pediatrics", date: "2026-05-22", time: "3:00 PM", type: "Consultation", status: "completed", duration: 30, notes: "" },
  { id: "5", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine", date: "2026-05-12", time: "11:00 AM", type: "Follow-up", status: "completed", duration: 30, notes: "" },
  { id: "6", doctor: "Dr. James Williams", specialty: "Neurology", date: "2026-04-20", time: "9:00 AM", type: "Consultation", status: "cancelled", duration: 60, notes: "Patient cancelled — rescheduling needed" },
];

const statusVariant = {
  confirmed: "success", scheduled: "info", completed: "secondary", cancelled: "destructive",
} as const;

export default function PatientAppointmentsPage() {
  const [open, setOpen] = useState(false);
  const upcoming = appointments.filter((a) => ["confirmed", "scheduled"].includes(a.status));
  const past = appointments.filter((a) => ["completed", "cancelled"].includes(a.status));

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
          <p className="text-sm text-gray-500">{upcoming.length} upcoming</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" /> Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Select Doctor</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
                  <SelectContent>
                    {["Dr. Sarah Johnson — Internal Medicine", "Dr. Michael Chen — Cardiology", "Dr. Emily Rodriguez — Pediatrics", "Dr. James Williams — Neurology"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Appointment Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["Consultation", "Follow-up", "Check-up", "Lab Review"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Preferred Date</Label>
                  <Input type="date" min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Time</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Time" /></SelectTrigger>
                    <SelectContent>
                      {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Reason for Visit</Label>
                <Textarea placeholder="Briefly describe your symptoms or reason for visit…" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setOpen(false)}>Request Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <Card key={appt.id} className="border-green-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                        {appt.doctor.split(" ").slice(1).map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900">{appt.doctor}</p>
                        <Badge variant={statusVariant[appt.status as keyof typeof statusVariant]}>{appt.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{appt.specialty} · {appt.type} · {appt.duration}min</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {appt.time}
                        </span>
                      </div>
                      {appt.notes && <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded px-2 py-1">Note: {appt.notes}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past Appointments</h3>
        <Card>
          <div className="divide-y divide-gray-50">
            {past.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-20 shrink-0">
                  <p className="text-xs font-medium text-gray-600">{formatDate(appt.date)}</p>
                  <p className="text-xs text-gray-400">{appt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{appt.doctor}</p>
                  <p className="text-xs text-gray-400">{appt.type} · {appt.specialty}</p>
                </div>
                <Badge variant={statusVariant[appt.status as keyof typeof statusVariant]}>{appt.status}</Badge>
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 shrink-0">View</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
