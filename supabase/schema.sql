-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('admin', 'doctor', 'patient');
create type appointment_status as enum ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
create type gender as enum ('male', 'female', 'other');
create type invoice_status as enum ('pending', 'paid', 'overdue', 'cancelled');

-- Profiles (linked to Supabase Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'patient',
  avatar_url text,
  phone text,
  date_of_birth date,
  gender gender,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Doctors
create table doctors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  specialization text not null,
  license_number text not null unique,
  department text,
  experience_years integer default 0,
  consultation_fee numeric(10,2) default 0,
  available_hours jsonb,
  bio text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Patients
create table patients (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  blood_type text,
  allergies text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  insurance_provider text,
  insurance_number text,
  assigned_doctor_id uuid references doctors(id),
  created_at timestamptz default now()
);

-- Appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer default 30,
  status appointment_status default 'scheduled',
  type text not null default 'consultation',
  notes text,
  reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Medical Records
create table medical_records (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  doctor_id uuid not null references doctors(id),
  appointment_id uuid references appointments(id),
  diagnosis text not null,
  symptoms text[] not null default '{}',
  treatment_plan text,
  notes text,
  vitals jsonb,
  created_at timestamptz default now()
);

-- Prescriptions
create table prescriptions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  doctor_id uuid not null references doctors(id),
  medical_record_id uuid references medical_records(id),
  medications jsonb not null default '[]',
  instructions text,
  valid_until date,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  name text not null,
  type text not null,
  storage_path text not null,
  size_bytes bigint,
  created_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references profiles(id),
  receiver_id uuid not null references profiles(id),
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Notifications
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- Activity Logs
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- Invoices
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  appointment_id uuid references appointments(id),
  amount numeric(10,2) not null,
  status invoice_status default 'pending',
  due_date date,
  paid_at timestamptz,
  description text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_appointments_patient on appointments(patient_id);
create index idx_appointments_doctor on appointments(doctor_id);
create index idx_appointments_scheduled on appointments(scheduled_at);
create index idx_medical_records_patient on medical_records(patient_id);
create index idx_messages_receiver on messages(receiver_id);
create index idx_notifications_user on notifications(user_id, is_read);
create index idx_activity_logs_user on activity_logs(user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger trg_appointments_updated_at before update on appointments
  for each row execute function update_updated_at();

-- RLS Policies
alter table profiles enable row level security;
alter table doctors enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table medical_records enable row level security;
alter table prescriptions enable row level security;
alter table documents enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;
alter table invoices enable row level security;

-- Profiles: everyone can read own, admin can read all
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Admin can read all profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Doctors: public read for active doctors
create policy "Anyone can view active doctors" on doctors for select using (is_active = true);
create policy "Admin manages doctors" on doctors for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Patients: doctors and admins can read all
create policy "Patients see own record" on patients for select using (
  profile_id = auth.uid()
);
create policy "Doctors can view patients" on patients for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('doctor', 'admin'))
);

-- Appointments
create policy "Patients see own appointments" on appointments for select using (
  exists (select 1 from patients pt where pt.id = patient_id and pt.profile_id = auth.uid())
);
create policy "Doctors see own appointments" on appointments for select using (
  exists (select 1 from doctors d where d.id = doctor_id and d.profile_id = auth.uid())
);
create policy "Admin sees all appointments" on appointments for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Medical Records
create policy "Patients see own records" on medical_records for select using (
  exists (select 1 from patients pt where pt.id = patient_id and pt.profile_id = auth.uid())
);
create policy "Doctors manage records" on medical_records for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('doctor', 'admin'))
);

-- Notifications
create policy "Users see own notifications" on notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on notifications for update using (user_id = auth.uid());

-- Messages
create policy "Users see own messages" on messages for select using (
  sender_id = auth.uid() or receiver_id = auth.uid()
);
create policy "Users send messages" on messages for insert with check (sender_id = auth.uid());
