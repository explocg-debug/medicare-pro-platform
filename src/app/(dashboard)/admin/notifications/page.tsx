"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, X, Bell, Users, CreditCard, Settings } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const notifTypes = {
  user: { icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  billing: { icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50" },
  alert: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  system: { icon: Settings, color: "text-purple-600", bg: "bg-purple-50" },
};

const initialNotifications = [
  { id: "1", type: "alert" as const, title: "Critical: Server Load High", message: "Server CPU usage exceeded 90% for the past 10 minutes. Investigating cause.", time: "2026-06-09T10:45:00Z", read: false, priority: "high" },
  { id: "2", type: "billing" as const, title: "5 Overdue Invoices", message: "5 invoices totaling $2,340 are overdue by more than 30 days.", time: "2026-06-09T09:00:00Z", read: false, priority: "high" },
  { id: "3", type: "user" as const, title: "New Doctor Registration", message: "Dr. Amanda Torres has registered and is awaiting admin approval.", time: "2026-06-09T08:30:00Z", read: false, priority: "medium" },
  { id: "4", type: "system" as const, title: "Backup Completed", message: "Nightly database backup completed successfully. All data secured.", time: "2026-06-09T02:00:00Z", read: true, priority: "low" },
  { id: "5", type: "user" as const, title: "Monthly Report Ready", message: "The May 2026 platform report is ready for review in Analytics.", time: "2026-06-08T18:00:00Z", read: true, priority: "low" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Admin Notifications</h2>
          <p className="text-sm text-gray-500">{unread} unread alerts</p>
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
            <Card key={notif.id} className={cn(!notif.read && "border-blue-100 bg-blue-50/20")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", cfg.bg)}>
                    <Icon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                        <Badge
                          variant={notif.priority === "high" ? "destructive" : notif.priority === "medium" ? "warning" : "secondary"}
                          className="text-[10px]"
                        >
                          {notif.priority}
                        </Badge>
                        {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </div>
                      <button
                        onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                        className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">{formatDateTime(notif.time)}</p>
                      {!notif.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 text-blue-600"
                          onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
