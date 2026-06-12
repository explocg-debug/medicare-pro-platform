"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  LayoutDashboard, Users, UserCheck, BarChart3, Shield, Calendar,
  CreditCard, Settings, ScrollText, Bell,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Doctors", href: "/admin/doctors", icon: UserCheck },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Roles & Access", href: "/admin/roles", icon: Shield },
  { label: "Activity Logs", href: "/admin/logs", icon: ScrollText },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, badge: 2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={<Sidebar items={navItems} role="admin" userName="Admin User" />}
      topNav={<TopNav title="Admin Dashboard" role="admin" userName="Admin User" notificationCount={2} />}
    >
      {children}
    </DashboardShell>
  );
}
