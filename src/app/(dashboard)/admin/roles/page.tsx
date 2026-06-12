"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Lock, Plus } from "lucide-react";
import { getInitials } from "@/lib/utils";

const roles = [
  {
    id: "admin", name: "Administrator", description: "Full system access — manage all resources, users, billing, and settings.",
    color: "bg-purple-600", users: 3,
    permissions: {
      "Patient Records": ["view", "create", "edit", "delete"],
      "Doctor Management": ["view", "create", "edit", "delete"],
      "Appointments": ["view", "create", "edit", "delete"],
      "Billing": ["view", "create", "edit", "delete"],
      "User Management": ["view", "create", "edit", "delete"],
      "System Settings": ["view", "create", "edit"],
      "Analytics": ["view", "export"],
      "Activity Logs": ["view", "export"],
    },
  },
  {
    id: "doctor", name: "Doctor", description: "Clinical access — manage patients, diagnoses, prescriptions, and appointments.",
    color: "bg-blue-600", users: 24,
    permissions: {
      "Patient Records": ["view", "create", "edit"],
      "Doctor Management": ["view"],
      "Appointments": ["view", "create", "edit"],
      "Billing": [],
      "User Management": [],
      "System Settings": [],
      "Analytics": ["view"],
      "Activity Logs": [],
    },
  },
  {
    id: "patient", name: "Patient", description: "Limited access — view own records, book appointments, and message doctors.",
    color: "bg-green-600", users: 1284,
    permissions: {
      "Patient Records": ["view"],
      "Doctor Management": ["view"],
      "Appointments": ["view", "create"],
      "Billing": ["view"],
      "User Management": [],
      "System Settings": [],
      "Analytics": [],
      "Activity Logs": [],
    },
  },
];

const allAdmins = [
  { name: "Admin User", email: "admin@medicare.com" },
  { name: "John Manager", email: "jmanager@medicare.com" },
  { name: "Lisa Admin", email: "ladmin@medicare.com" },
];

const permissionLabels: Record<string, string> = {
  view: "View", create: "Create", edit: "Edit", delete: "Delete", export: "Export",
};

export default function AdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState("admin");
  const role = roles.find((r) => r.id === selectedRole)!;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Roles & Access Control</h2>
          <p className="text-sm text-gray-500">Manage user permissions and access levels</p>
        </div>
        <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" /> Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Role List */}
        <div className="space-y-3">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selectedRole === r.id ? "border-purple-300 bg-purple-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-8 w-8 rounded-lg ${r.color} flex items-center justify-center`}>
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.users} users</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{r.description}</p>
            </button>
          ))}
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg ${role.color} flex items-center justify-center`}>
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">{role.name} Permissions</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(role.permissions).map(([resource, perms]) => (
                  <div key={resource} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{resource}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {perms.length === 0 ? (
                        <span className="text-xs text-gray-300">No access</span>
                      ) : (
                        perms.map((p) => (
                          <Badge key={p} variant={p === "delete" ? "destructive" : p === "edit" || p === "create" ? "warning" : "secondary"} className="text-[10px]">
                            {permissionLabels[p] || p}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedRole === "admin" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Administrators</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {allAdmins.map((admin) => (
                  <div key={admin.email} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">{getInitials(admin.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="text-xs">Active</Badge>
                      <Switch defaultChecked />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
