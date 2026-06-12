import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { event, data } = payload;

    const supabase = await createClient();

    switch (event) {
      case "appointment.reminder":
        await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Appointment Reminder",
          message: `You have an appointment on ${data.appointmentDate} at ${data.appointmentTime}.`,
          type: "appointment",
        });
        break;

      case "prescription.refill":
        await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Prescription Refill Due",
          message: `${data.medication} needs a refill by ${data.refillDate}.`,
          type: "prescription",
        });
        break;

      case "report.ready":
        await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Report Ready",
          message: `Your ${data.reportType} report is ready for review.`,
          type: "report",
        });
        break;

      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("n8n webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
