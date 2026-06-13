# MediCare Pro — Healthcare Management System

A full-stack healthcare management platform with three role-based dashboards: **Doctor**, **Admin**, and **Patient**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Styling | Tailwind CSS v4 + ShadCN UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| AI | Ollama (local) |
| Automation | n8n (local) |
| Deployment | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
cd healthcare-system
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

N8N_URL=http://localhost:5678
N8N_API_KEY=your-n8n-api-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Get your Supabase keys from: **supabase.com → Project → Settings → API**

### 3. Set up the database

Link the Supabase CLI and apply the versioned migrations:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:push
npm run db:types
```

Database migrations are stored in `supabase/migrations/`.

### 4. Bootstrap the first administrator

Register the account normally, then promote it with the server-only role command:

```bash
npm run user:set-role -- admin@example.com admin
```

To create a doctor account, include specialization and license number:

```bash
npm run user:set-role -- doctor@example.com doctor "Cardiology" "LICENSE-123"
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

For testing without a Supabase connection, use these built-in demo credentials. Click the role button on the login page for one-click access — no signup required.

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Doctor | `doctor@medicare.demo` | `demo123` | `/doctor` |
| Patient | `patient@medicare.demo` | `demo123` | `/patient` |
| Admin | `admin@medicare.demo` | `demo123` | `/admin` |

---

## Dashboards

### Doctor Dashboard `/doctor`
- Patient list (50+ patients) with search and filters
- Appointment calendar and daily schedule
- AI-assisted diagnosis (via Ollama)
- Prescription management
- Reports with charts
- Analytics (weekly stats, performance radar)

### Admin Dashboard `/admin`
- System overview with revenue and health metrics
- Doctor and patient management
- Billing and invoices
- Role and permission management
- Activity logs
- Integrations settings (Ollama, n8n, Supabase)

### Patient Dashboard `/patient`
- Personal health overview and vitals
- Medical records (accordion view)
- Appointments (book, view upcoming/past)
- Active prescriptions with refill tracking
- Document uploads
- Messaging with doctors
- Health tracking charts

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register, forgot-password
│   ├── (dashboard)/
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── doctor/       # Doctor dashboard pages
│   │   └── patient/      # Patient dashboard pages
│   ├── api/
│   │   ├── ai/           # Ollama AI routes (diagnose, report, summary)
│   │   └── webhooks/n8n/ # n8n automation webhook
│   └── page.tsx          # Landing page
├── components/
│   ├── layout/           # Sidebar, TopNav, DashboardShell
│   └── ui/               # ShadCN-style UI components
├── lib/
│   ├── supabase/         # Browser + server Supabase clients
│   ├── ollama.ts         # Ollama AI helpers
│   └── n8n.ts            # n8n workflow triggers
├── types/
│   └── database.ts       # Full Supabase Database type
└── proxy.ts              # Auth routing (Next.js 16 middleware)
```

---

## AI Features (Ollama)

Make sure Ollama is running locally and a model is pulled:

```bash
ollama pull llama3.2
ollama serve
```

AI is used for:
- Diagnosis support (Doctor → Diagnoses page)
- Patient summary generation
- Report generation

---

## Automation (n8n)

Start n8n locally:

```bash
npx n8n
```

Webhook endpoint: `POST /api/webhooks/n8n`

Supported events: `appointment.reminder`, `prescription.refill`, `report.ready`

---

## Deployment (Vercel)

```bash
vercel deploy
```

Set all environment variables from `.env.local` in the Vercel project settings.
