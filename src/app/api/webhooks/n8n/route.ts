import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const expectedKey = process.env.N8N_API_KEY;
    const authorization = req.headers.get("authorization");

    if (!expectedKey || authorization !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    if (!event || !data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const supabase = createAdminClient();
    let insertError: { message: string } | null = null;

    switch (event) {
      case "appointment.reminder": {
        const { error } = await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Appointment Reminder",
          message: `You have an appointment on ${data.appointmentDate} at ${data.appointmentTime}.`,
          type: "appointment",
        });
        insertError = error;
        break;
      }

      case "prescription.refill": {
        const { error } = await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Prescription Refill Due",
          message: `${data.medication} needs a refill by ${data.refillDate}.`,
          type: "prescription",
        });
        insertError = error;
        break;
      }

      case "report.ready": {
        const { error } = await supabase.from("notifications").insert({
          user_id: data.userId,
          title: "Report Ready",
          message: `Your ${data.reportType} report is ready for review.`,
          type: "report",
        });
        insertError = error;
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("n8n webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
