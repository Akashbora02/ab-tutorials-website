# Vercel Deployment Guide for AB Tutorials

Follow this step-by-step guide to deploy your Next.js application to Vercel with a production-ready database.

---

## 📋 Prerequisites
1. Your code is pushed to GitHub: [https://github.com/Akashbora02/ab-tutorials-website](https://github.com/Akashbora02/ab-tutorials-website) (✅ **Done**).
2. A free [Vercel](https://vercel.com) account.
3. A free cloud PostgreSQL database (from [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)).

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Free Cloud PostgreSQL Database
Vercel functions run in a serverless environment where SQLite files are read-only and ephemeral. A cloud PostgreSQL database provides persistent data for students, admissions, test question banks, and Hall of Fame toppers:

1. Sign up for a free account at **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)**.
2. Create a new project called `ab-tutorials`.
3. Copy your connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

---

### Step 2: Deploy Project on Vercel
1. Go to **[https://vercel.com/new](https://vercel.com/new)**.
2. Select **`Akashbora02/ab-tutorials-website`** and click **Import**.
3. In the configuration screen:
   - **Framework Preset**: Next.js (detected automatically)
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`
4. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | *Paste your Neon / Supabase PostgreSQL URL* |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `admin123` |
5. Click **"Deploy"**!

---

### Step 3: Self-Healing Zero-Config Database
The application includes a built-in **Self-Healing SQL Initializer** (`src/lib/db.ts`):
- All 8 database tables (`Admin`, `Student`, `AdmissionEnquiry`, `Test`, `Question`, `TestSubmission`, `ContactMessage`, `TopResult`) and initial standardized tests are created automatically on first run.
- Zero manual migrations or CLI commands required on Vercel!
