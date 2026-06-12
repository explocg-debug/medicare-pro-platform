const N8N_URL = process.env.N8N_URL || "http://localhost:5678";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

export async function triggerN8nWorkflow(
  webhookPath: string,
  payload: Record<string, unknown>
) {
  const url = `${N8N_URL}/webhook/${webhookPath}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(N8N_API_KEY ? { Authorization: `Bearer ${N8N_API_KEY}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`n8n webhook error: ${res.status}`);
  }
  return res.json();
}

export const workflows = {
  appointmentReminder: (appointmentId: string) =>
    triggerN8nWorkflow("appointment-reminder", { appointmentId }),

  newPatientNotification: (patientId: string, doctorId: string) =>
    triggerN8nWorkflow("new-patient", { patientId, doctorId }),

  prescriptionGenerated: (prescriptionId: string) =>
    triggerN8nWorkflow("prescription-created", { prescriptionId }),

  reportReady: (reportId: string, userId: string) =>
    triggerN8nWorkflow("report-ready", { reportId, userId }),

  billingAlert: (invoiceId: string) =>
    triggerN8nWorkflow("billing-alert", { invoiceId }),
};
