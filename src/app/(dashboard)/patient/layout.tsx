"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  LayoutDashboard, FileText, Calendar, ClipboardList,
  FolderOpen, MessageSquare, Bell, Settings, Heart,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/patient", icon: LayoutDashboard },
  { label: "Medical Records", href: "/patient/records", icon: FileText },
  { label: "Appointments", href: "/patient/appointments", icon: Calendar },
  { label: "Prescriptions", href: "/patient/prescriptions", icon: ClipboardList },
  { label: "Documents", href: "/patient/documents", icon: FolderOpen },
  { label: "Messages", href: "/patient/messages", icon: MessageSquare, badge: 2 },
  { label: "Notifications", href: "/patient/notifications", icon: Bell, badge: 1 },
  { label: "My Health", href: "/patient/health", icon: Heart },
  { label: "Settings", href: "/patient/settings", icon: Settings },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={<Sidebar items={navItems} role="patient" userName="James Wilson" />}
      topNav={<TopNav title="Patient Portal" role="patient" userName="James Wilson" notificationCount={1} />}
    >
      {children}
    </DashboardShell>
  );
}
