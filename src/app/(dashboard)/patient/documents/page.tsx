"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Download, Search, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const documents = [
  { id: "1", name: "Blood Test Report - June 2026", type: "Lab Report", size: "1.2 MB", date: "2026-06-05", uploadedBy: "Lab Department", category: "lab" },
  { id: "2", name: "ECG Report - Jan 2026", type: "Medical Report", size: "2.8 MB", date: "2026-01-20", uploadedBy: "Dr. Michael Chen", category: "report" },
  { id: "3", name: "Chest X-Ray - Dec 2025", type: "Radiology", size: "5.4 MB", date: "2025-12-10", uploadedBy: "Radiology Dept.", category: "imaging" },
  { id: "4", name: "Insurance Card Copy", type: "Insurance", size: "0.4 MB", date: "2025-11-01", uploadedBy: "Self", category: "administrative" },
  { id: "5", name: "Prescription History - 2025", type: "Prescription", size: "0.9 MB", date: "2025-10-15", uploadedBy: "Dr. Sarah Johnson", category: "prescription" },
  { id: "6", name: "Annual Physical - 2025", type: "Medical Report", size: "1.6 MB", date: "2025-09-22", uploadedBy: "Dr. Sarah Johnson", category: "report" },
];

const categoryVariant = {
  lab: "info", report: "secondary", imaging: "purple", administrative: "secondary", prescription: "success",
} as const;

const categories = ["all", "lab", "report", "imaging", "prescription", "administrative"];

export default function PatientDocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = documents.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || d.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Documents</h2>
          <p className="text-sm text-gray-500">{filtered.length} files</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Document Name</Label>
                <Input placeholder="e.g., Blood Test Results - June 2026" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">Lab Report</SelectItem>
                    <SelectItem value="report">Medical Report</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-300 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to select file or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX up to 20MB</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setOpen(false)}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input placeholder="Search documents…" className="pl-8 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className={cn("text-xs capitalize", category === cat ? "bg-green-600 hover:bg-green-700" : "")}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-all group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 bg-red-50 rounded-lg shrink-0">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.size}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={categoryVariant[doc.category as keyof typeof categoryVariant] ?? "secondary"} className="text-xs capitalize">
                  {doc.category}
                </Badge>
                <span className="text-xs text-gray-400">{formatDate(doc.date)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">By: {doc.uploadedBy}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-7 text-xs">
                  <Download className="h-3 w-3" /> Download
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
