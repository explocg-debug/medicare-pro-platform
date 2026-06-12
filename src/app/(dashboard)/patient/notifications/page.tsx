"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, AlertCircle, X, CheckCircle } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

const notifTypes = {
  appointment: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  report: { icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  alert: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  reminder: { icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
};

const initialNotifications = [
  { id: "1", type: "alert" as const, title: "Prescription Refill Due", message: "Lisinopril 10mg needs refill by July 8. Contact Dr. Johnson to request a new prescription.", time: "2026-06-09T09:00:00Z", read: false },
  { id: "2", type: "appointment" as const, title: "Appointment Reminder", message: "You have a follow-up with Dr. Sarah Johnson on June 13 at 10:30 AM. Please arrive 10 minutes early.", time: "2026-06-08T18:00:00Z", read: true },
  { id: "3", type: "report" as const, title: "Lab Results Available", message: "Your blood panel results from June 5 are now available. You can view them in Medical Records.", time: "2026-06-07T14:00:00Z", read: true },
  { id: "4", type: "reminder" as const, title: "Daily Medication Reminder", message: "Don't forget to take your morning medications: Lisinopril and Amlodipine.", time: "2026-06-09T08:00:00Z", read: false },
];

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const cfg = notifTypes[notif.type];
          const Icon = cfg.icon;
          return (
            <Card key={notif.id} className={cn(!notif.read && "border-green-100 bg-green-50/20")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", cfg.bg)}>
                    <Icon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                      {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.time)}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                    className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
