export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = "admin" | "doctor" | "patient";
export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
export type Gender = "male" | "female" | "other";

// ── Row types ────────────────────────────────────────────────────────────────

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type DoctorRow = {
  id: string;
  profile_id: string;
  specialization: string;
  license_number: string;
  department: string | null;
  experience_years: number;
  consultation_fee: number;
  available_hours: Json | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
};

type PatientRow = {
  id: string;
  profile_id: string;
  blood_type: string | null;
  allergies: string[] | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  assigned_doctor_id: string | null;
  created_at: string;
};

type AppointmentRow = {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  type: string;
  notes: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

type MedicalRecordRow = {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  diagnosis: string;
  symptoms: string[];
  treatment_plan: string | null;
  notes: string | null;
  vitals: Json | null;
  created_at: string;
};

type PrescriptionRow = {
  id: string;
  patient_id: string;
  doctor_id: string;
  medical_record_id: string | null;
  medications: Json;
  instructions: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
};

type DocumentRow = {
  id: string;
  patient_id: string;
  uploaded_by: string;
  name: string;
  type: string;
  storage_path: string;
  size_bytes: number | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
};

type ActivityLogRow = {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Json | null;
  ip_address: string | null;
  created_at: string;
};

type InvoiceRow = {
  id: string;
  patient_id: string;
  appointment_id: string | null;
  amount: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
  due_date: string | null;
  paid_at: string | null;
  description: string | null;
  created_at: string;
};

// Makes nullable fields optional (matches how Supabase INSERT works — nullable columns accept NULL by default)
type NullableOptional<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
};

// ── Database interface ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: NullableOptional<Omit<ProfileRow, "created_at" | "updated_at">>;
        Update: Partial<Omit<ProfileRow, "created_at" | "updated_at">>;
        Relationships: [];
      };
      doctors: {
        Row: DoctorRow;
        Insert: NullableOptional<Omit<DoctorRow, "created_at">>;
        Update: Partial<Omit<DoctorRow, "created_at">>;
        Relationships: [];
      };
      patients: {
        Row: PatientRow;
        Insert: NullableOptional<Omit<PatientRow, "created_at">>;
        Update: Partial<Omit<PatientRow, "created_at">>;
        Relationships: [];
      };
      appointments: {
        Row: AppointmentRow;
        Insert: NullableOptional<Omit<AppointmentRow, "created_at" | "updated_at">>;
        Update: Partial<Omit<AppointmentRow, "created_at" | "updated_at">>;
        Relationships: [];
      };
      medical_records: {
        Row: MedicalRecordRow;
        Insert: NullableOptional<Omit<MedicalRecordRow, "created_at">>;
        Update: Partial<Omit<MedicalRecordRow, "created_at">>;
        Relationships: [];
      };
      prescriptions: {
        Row: PrescriptionRow;
        Insert: NullableOptional<Omit<PrescriptionRow, "created_at">>;
        Update: Partial<Omit<PrescriptionRow, "created_at">>;
        Relationships: [];
      };
      documents: {
        Row: DocumentRow;
        Insert: NullableOptional<Omit<DocumentRow, "created_at">>;
        Update: Partial<Omit<DocumentRow, "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: NullableOptional<Omit<MessageRow, "created_at">>;
        Update: Partial<Omit<MessageRow, "created_at">>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: NullableOptional<Omit<NotificationRow, "created_at" | "id" | "is_read">>;
        Update: Partial<Omit<NotificationRow, "created_at">>;
        Relationships: [];
      };
      activity_logs: {
        Row: ActivityLogRow;
        Insert: NullableOptional<Omit<ActivityLogRow, "created_at">>;
        Update: Partial<Omit<ActivityLogRow, "created_at">>;
        Relationships: [];
      };
      invoices: {
        Row: InvoiceRow;
        Insert: NullableOptional<Omit<InvoiceRow, "created_at">>;
        Update: Partial<Omit<InvoiceRow, "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      appointment_status: AppointmentStatus;
      gender: Gender;
    };
  };
}

// ── Convenience aliases ───────────────────────────────────────────────────────

export type Profile = ProfileRow;
export type Doctor = DoctorRow;
export type Patient = PatientRow;
export type Appointment = AppointmentRow;
export type MedicalRecord = MedicalRecordRow;
export type Prescription = PrescriptionRow;
export type Document = DocumentRow;
export type Message = MessageRow;
export type Notification = NotificationRow;
export type ActivityLog = ActivityLogRow;
export type Invoice = InvoiceRow;

export interface DoctorWithProfile extends Doctor {
  profiles: Profile;
}

export interface PatientWithProfile extends Patient {
  profiles: Profile;
  doctors?: DoctorWithProfile;
}

export interface AppointmentWithDetails extends Appointment {
  patients?: PatientWithProfile;
  doctors?: DoctorWithProfile;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}
