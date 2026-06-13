import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const patientEmail = process.argv[2];

if (!patientEmail) {
  console.error("Usage: npm run db:seed:patient -- <patient-email>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Supabase service credentials are missing from .env.local.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: WebSocket,
  },
});

const ids = {
  pastAppointment: "8c6d4f0a-4b7d-4e3f-9b1a-000000000001",
  upcomingAppointment: "8c6d4f0a-4b7d-4e3f-9b1a-000000000002",
  followUpAppointment: "8c6d4f0a-4b7d-4e3f-9b1a-000000000003",
  wellnessRecord: "8c6d4f0a-4b7d-4e3f-9b1a-000000001001",
  bloodPressureRecord: "8c6d4f0a-4b7d-4e3f-9b1a-000000001002",
  lisinoprilPrescription: "8c6d4f0a-4b7d-4e3f-9b1a-000000002001",
  vitaminPrescription: "8c6d4f0a-4b7d-4e3f-9b1a-000000002002",
  vitalOne: "8c6d4f0a-4b7d-4e3f-9b1a-000000003001",
  vitalTwo: "8c6d4f0a-4b7d-4e3f-9b1a-000000003002",
  vitalThree: "8c6d4f0a-4b7d-4e3f-9b1a-000000003003",
  vitalFour: "8c6d4f0a-4b7d-4e3f-9b1a-000000003004",
  activityGoal: "8c6d4f0a-4b7d-4e3f-9b1a-000000004001",
  weightGoal: "8c6d4f0a-4b7d-4e3f-9b1a-000000004002",
  doctorMessage: "8c6d4f0a-4b7d-4e3f-9b1a-000000005001",
  patientMessage: "8c6d4f0a-4b7d-4e3f-9b1a-000000005002",
  followUpMessage: "8c6d4f0a-4b7d-4e3f-9b1a-000000005003",
  appointmentNotification: "8c6d4f0a-4b7d-4e3f-9b1a-000000006001",
  prescriptionNotification: "8c6d4f0a-4b7d-4e3f-9b1a-000000006002",
  reportNotification: "8c6d4f0a-4b7d-4e3f-9b1a-000000006003",
  document: "8c6d4f0a-4b7d-4e3f-9b1a-000000007001",
};

function isoAtOffset(days, hour = 10, minute = 30) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
}

function isoHoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function dateAtOffset(days) {
  return isoAtOffset(days).slice(0, 10);
}

function createSimplePdf(lines) {
  const escapeText = (value) =>
    value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  const textCommands = lines
    .map((line, index) =>
      index === 0
        ? `(${escapeText(line)}) Tj`
        : `0 -18 Td (${escapeText(line)}) Tj`,
    )
    .join("\n");
  const stream = `BT\n/F1 12 Tf\n72 720 Td\n${textCommands}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  body += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  body += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(body, "ascii");
}

async function findUserByEmail(email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    });

    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase(),
    );
    if (user || data.users.length < 100) return user;

    page += 1;
  }
}

async function upsert(table, values) {
  const { error } = await supabase.from(table).upsert(values, {
    onConflict: "id",
  });
  if (error) throw new Error(`${table}: ${error.message}`);
}

const patientUser = await findUserByEmail(patientEmail);
if (!patientUser) {
  throw new Error(`No Supabase user exists for ${patientEmail}.`);
}

const { data: patient, error: patientError } = await supabase
  .from("patients")
  .select("id, profile_id")
  .eq("profile_id", patientUser.id)
  .single();

if (patientError) throw patientError;

const doctorEmail = "demo-doctor@medicarepro.example";
let doctorUser = await findUserByEmail(doctorEmail);

if (!doctorUser) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: doctorEmail,
    password: `${crypto.randomUUID()}Aa1!`,
    email_confirm: true,
    user_metadata: {
      full_name: "Maya Patel",
    },
  });

  if (error) throw error;
  doctorUser = data.user;
}

const { error: roleError } = await supabase.rpc("service_set_user_role", {
  target_user_id: doctorUser.id,
  new_role: "doctor",
  doctor_specialization: "Internal Medicine",
  doctor_license_number: "DEMO-MP-2026-001",
});
if (roleError) throw roleError;

const { error: profileError } = await supabase
  .from("profiles")
  .update({
    full_name: "Maya Patel",
    phone: "+1 555 010 2011",
  })
  .eq("id", doctorUser.id);
if (profileError) throw profileError;

const { data: doctor, error: doctorError } = await supabase
  .from("doctors")
  .update({
    department: "Primary Care",
    experience_years: 11,
    consultation_fee: 95,
    available_hours: {
      monday: ["09:00", "13:00"],
      wednesday: ["10:00", "15:00"],
      friday: ["09:00", "12:00"],
    },
    bio: "Demo care provider for the MediCare Pro live patient portal.",
    is_active: true,
  })
  .eq("profile_id", doctorUser.id)
  .select("id, profile_id")
  .single();
if (doctorError) throw doctorError;

const { error: patientUpdateError } = await supabase
  .from("patients")
  .update({
    assigned_doctor_id: doctor.id,
    blood_type: "O+",
    allergies: ["Penicillin"],
    emergency_contact_name: "Demo Family Contact",
    emergency_contact_phone: "+1 555 010 2040",
    insurance_provider: "MediCare Demo Health",
    insurance_number: "DEMO-2026-109094",
  })
  .eq("id", patient.id);
if (patientUpdateError) throw patientUpdateError;

const pastAppointmentAt = isoAtOffset(-7, 5, 0);
const upcomingAppointmentAt = isoAtOffset(5, 5, 0);
const followUpAppointmentAt = isoAtOffset(14, 8, 30);

await upsert("appointments", [
  {
    id: ids.pastAppointment,
    patient_id: patient.id,
    doctor_id: doctor.id,
    scheduled_at: pastAppointmentAt,
    duration_minutes: 30,
    status: "completed",
    type: "Annual wellness visit",
    reason: "Routine preventive care review",
    notes: "Demo appointment generated for the live patient portal.",
  },
  {
    id: ids.upcomingAppointment,
    patient_id: patient.id,
    doctor_id: doctor.id,
    scheduled_at: upcomingAppointmentAt,
    duration_minutes: 30,
    status: "confirmed",
    type: "Follow-up",
    reason: "Review blood pressure readings and medication response",
    notes: "Demo appointment generated for the live patient portal.",
  },
  {
    id: ids.followUpAppointment,
    patient_id: patient.id,
    doctor_id: doctor.id,
    scheduled_at: followUpAppointmentAt,
    duration_minutes: 45,
    status: "scheduled",
    type: "Lab review",
    reason: "Discuss routine blood panel results",
    notes: "Demo appointment generated for the live patient portal.",
  },
]);

await upsert("medical_records", [
  {
    id: ids.wellnessRecord,
    patient_id: patient.id,
    doctor_id: doctor.id,
    appointment_id: ids.pastAppointment,
    diagnosis: "Routine wellness review",
    symptoms: ["No acute symptoms"],
    treatment_plan:
      "Continue regular activity, balanced nutrition, and home blood pressure monitoring.",
    notes: "Preventive care discussion completed. Demo clinical record.",
    vitals: {
      bloodPressure: "124/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.4 F",
      weight: "174 lb",
    },
    created_at: isoAtOffset(-7, 5, 35),
  },
  {
    id: ids.bloodPressureRecord,
    patient_id: patient.id,
    doctor_id: doctor.id,
    appointment_id: null,
    diagnosis: "Blood pressure follow-up",
    symptoms: ["Occasional mild headache"],
    treatment_plan:
      "Continue current medication and record blood pressure three times weekly.",
    notes: "Readings are trending toward the target range. Demo clinical record.",
    vitals: {
      bloodPressure: "130/84 mmHg",
      heartRate: "76 bpm",
    },
    created_at: isoAtOffset(-35, 6, 0),
  },
]);

await upsert("prescriptions", [
  {
    id: ids.lisinoprilPrescription,
    patient_id: patient.id,
    doctor_id: doctor.id,
    medical_record_id: ids.wellnessRecord,
    medications: [
      {
        name: "Lisinopril",
        dosage: "10 mg",
        morning: true,
        evening: false,
        withFood: false,
      },
    ],
    instructions: "Take one tablet each morning. Monitor blood pressure.",
    valid_until: dateAtOffset(83),
    is_active: true,
    created_at: isoAtOffset(-7, 5, 40),
  },
  {
    id: ids.vitaminPrescription,
    patient_id: patient.id,
    doctor_id: doctor.id,
    medical_record_id: ids.wellnessRecord,
    medications: [
      {
        name: "Vitamin D3",
        dosage: "1000 IU",
        morning: true,
        evening: false,
        withFood: true,
      },
    ],
    instructions: "Take once daily with breakfast.",
    valid_until: dateAtOffset(173),
    is_active: true,
    created_at: isoAtOffset(-7, 5, 45),
  },
]);

await upsert("vital_readings", [
  {
    id: ids.vitalOne,
    patient_id: patient.id,
    recorded_by: patientUser.id,
    blood_pressure_systolic: 132,
    blood_pressure_diastolic: 86,
    heart_rate: 78,
    temperature_celsius: 36.8,
    blood_glucose_mg_dl: 101,
    oxygen_saturation: 98,
    weight_kg: 80.2,
    notes: "Demo home reading.",
    recorded_at: isoAtOffset(-21, 2, 30),
  },
  {
    id: ids.vitalTwo,
    patient_id: patient.id,
    recorded_by: patientUser.id,
    blood_pressure_systolic: 130,
    blood_pressure_diastolic: 84,
    heart_rate: 76,
    temperature_celsius: 36.9,
    blood_glucose_mg_dl: 98,
    oxygen_saturation: 98,
    weight_kg: 79.8,
    notes: "Demo home reading.",
    recorded_at: isoAtOffset(-14, 2, 30),
  },
  {
    id: ids.vitalThree,
    patient_id: patient.id,
    recorded_by: doctorUser.id,
    blood_pressure_systolic: 124,
    blood_pressure_diastolic: 80,
    heart_rate: 72,
    temperature_celsius: 36.9,
    blood_glucose_mg_dl: 96,
    oxygen_saturation: 99,
    weight_kg: 79.1,
    notes: "Demo clinic reading.",
    recorded_at: isoAtOffset(-7, 5, 20),
  },
  {
    id: ids.vitalFour,
    patient_id: patient.id,
    recorded_by: patientUser.id,
    blood_pressure_systolic: 126,
    blood_pressure_diastolic: 81,
    heart_rate: 74,
    temperature_celsius: 37,
    blood_glucose_mg_dl: 94,
    oxygen_saturation: 99,
    weight_kg: 78.9,
    notes: "Latest demo home reading.",
    recorded_at: isoAtOffset(0, 2, 30),
  },
]);

await upsert("health_goals", [
  {
    id: ids.activityGoal,
    patient_id: patient.id,
    title: "Weekly activity",
    description: "Complete at least 150 minutes of moderate activity each week.",
    target_value: 150,
    current_value: 105,
    unit: "minutes",
    target_date: dateAtOffset(30),
    status: "on_track",
    created_by: doctorUser.id,
  },
  {
    id: ids.weightGoal,
    patient_id: patient.id,
    title: "Healthy weight target",
    description: "Continue gradual progress through nutrition and regular activity.",
    target_value: 77,
    current_value: 78.9,
    unit: "kg",
    target_date: dateAtOffset(90),
    status: "in_progress",
    created_by: patientUser.id,
  },
]);

await upsert("messages", [
  {
    id: ids.doctorMessage,
    sender_id: doctorUser.id,
    receiver_id: patientUser.id,
    content:
      "Your recent readings look steady. Please continue tracking them before our follow-up.",
    is_read: true,
    read_at: isoHoursAgo(46),
    created_at: isoHoursAgo(48),
  },
  {
    id: ids.patientMessage,
    sender_id: patientUser.id,
    receiver_id: doctorUser.id,
    content:
      "Thank you. I have been recording my blood pressure and taking the medication each morning.",
    is_read: true,
    read_at: isoHoursAgo(22),
    created_at: isoHoursAgo(24),
  },
  {
    id: ids.followUpMessage,
    sender_id: doctorUser.id,
    receiver_id: patientUser.id,
    content:
      "Great. Bring the latest readings to your next appointment and contact us if symptoms change.",
    is_read: false,
    read_at: null,
    created_at: isoHoursAgo(3),
  },
]);

await upsert("notifications", [
  {
    id: ids.appointmentNotification,
    user_id: patientUser.id,
    title: "Upcoming appointment confirmed",
    message: "Your follow-up with Dr. Maya Patel is confirmed.",
    type: "appointment",
    is_read: false,
    read_at: null,
    link: "/patient/appointments",
    created_at: isoHoursAgo(4),
  },
  {
    id: ids.prescriptionNotification,
    user_id: patientUser.id,
    title: "Prescription plan updated",
    message: "Your active medication plan is available for review.",
    type: "reminder",
    is_read: false,
    read_at: null,
    link: "/patient/prescriptions",
    created_at: isoHoursAgo(26),
  },
  {
    id: ids.reportNotification,
    user_id: patientUser.id,
    title: "Visit summary available",
    message: "A summary from your recent wellness visit is now in Documents.",
    type: "report",
    is_read: true,
    read_at: isoHoursAgo(70),
    link: "/patient/documents",
    created_at: isoHoursAgo(72),
  },
]);

const documentPath = `${patientUser.id}/demo/wellness-visit-summary.pdf`;
const documentBody = createSimplePdf([
  "MediCare Pro - Demo Wellness Visit Summary",
  "",
  "Provider: Dr. Maya Patel",
  `Visit date: ${pastAppointmentAt.slice(0, 10)}`,
  "",
  "This file contains demonstration data created for portal verification.",
  "Continue home blood pressure monitoring and attend the scheduled follow-up.",
]);

const { error: storageError } = await supabase.storage
  .from("patient-documents")
  .upload(documentPath, documentBody, {
    contentType: "application/pdf",
    upsert: true,
  });
if (storageError) throw storageError;

await upsert("documents", {
  id: ids.document,
  patient_id: patient.id,
  uploaded_by: doctorUser.id,
  name: "Wellness visit summary.pdf",
  type: "report",
  storage_path: documentPath,
  mime_type: "application/pdf",
  size_bytes: documentBody.length,
});

console.log(
  JSON.stringify(
    {
      patient: patientEmail,
      assignedDoctor: "Dr. Maya Patel",
      appointments: 3,
      medicalRecords: 2,
      prescriptions: 2,
      vitalReadings: 4,
      healthGoals: 2,
      messages: 3,
      notifications: 3,
      documents: 1,
    },
    null,
    2,
  ),
);
