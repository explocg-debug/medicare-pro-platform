"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: "1", doctor: "Dr. Sarah Johnson", specialty: "Internal Medicine",
    lastMessage: "Your blood pressure looks good. Keep up the lifestyle changes.",
    time: "10:30 AM", unread: 0, initials: "SJ",
    messages: [
      { id: "m1", sender: "doctor", content: "Hello James, I reviewed your recent BP readings. They're trending well!", time: "Jun 8, 9:00 AM" },
      { id: "m2", sender: "patient", content: "Thank you Dr. Johnson. I've been taking walks every morning.", time: "Jun 8, 9:15 AM" },
      { id: "m3", sender: "doctor", content: "Excellent! Continue with the morning walks and maintain the low-sodium diet. Schedule a follow-up in 4 weeks.", time: "Jun 8, 9:30 AM" },
      { id: "m4", sender: "patient", content: "Will do. Should I increase to 30 minutes?", time: "Jun 8, 10:00 AM" },
      { id: "m5", sender: "doctor", content: "Yes, 30 minutes daily is ideal. Your blood pressure looks good. Keep up the lifestyle changes.", time: "Jun 8, 10:30 AM" },
    ],
  },
  {
    id: "2", doctor: "Dr. Michael Chen", specialty: "Cardiology",
    lastMessage: "Please bring your ECG records to the next appointment.",
    time: "Yesterday", unread: 1, initials: "MC",
    messages: [
      { id: "m1", sender: "doctor", content: "James, I'm scheduling a cardiology review for you next month.", time: "Jun 7, 2:00 PM" },
      { id: "m2", sender: "doctor", content: "Please bring your ECG records to the next appointment.", time: "Jun 7, 2:05 PM" },
    ],
  },
];

export default function PatientMessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  function sendMessage() {
    if (!newMessage.trim()) return;
    setNewMessage("");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border border-gray-100 rounded-xl overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input placeholder="Search…" className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.filter((c) => c.doctor.toLowerCase().includes(search.toLowerCase())).map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={cn(
                "w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left",
                activeConv.id === conv.id && "bg-green-50"
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-green-100 text-green-700 text-sm">{conv.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{conv.doctor}</p>
                  <span className="text-xs text-gray-400 shrink-0">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="h-4 w-4 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-green-100 text-green-700 text-sm">{activeConv.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{activeConv.doctor}</p>
            <p className="text-xs text-gray-400">{activeConv.specialty}</p>
          </div>
          <Badge variant="success" className="ml-auto text-xs">Online</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeConv.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.sender === "patient" ? "justify-end" : "justify-start")}
            >
              {msg.sender === "doctor" && (
                <Avatar className="h-7 w-7 shrink-0 mt-1">
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs">{activeConv.initials}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 text-sm",
                  msg.sender === "patient"
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                )}
              >
                <p>{msg.content}</p>
                <p className={cn("text-[10px] mt-1", msg.sender === "patient" ? "text-green-200" : "text-gray-400")}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <Input
            placeholder="Type a message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} className="gap-2 bg-green-600 hover:bg-green-700 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
