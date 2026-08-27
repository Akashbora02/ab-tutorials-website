# Vercel Deployment Guide for AB Tutorials

Follow this step-by-step guide to deploy your Next.js application to Vercel with a production-ready database.

---

## 📋 Prerequisites
1. Your code is pushed to GitHub: [https://github.com/Akashbora02/ab-tutorials](https://github.com/Akashbora02/ab-tutorials) (✅ **Done**).
2. A free [Vercel](https://vercel.com) account.
3. A free cloud PostgreSQL database (from [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)).

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Free Cloud PostgreSQL Database
Vercel functions run in a serverless environment where SQLite files are read-only and ephemeral. A cloud PostgreSQL database provides persistent data for students, admissions, and test results:

1. Sign up for a free account at **[Neon.tech](https://neon.tech)** (takes 30 seconds).
2. Create a new project called `ab-tutorials`.
3. Copy the **Direct Connection String** or **Pooled Connection String** provided by Neon:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

---

### Step 2: Configure Database Provider in `prisma/schema.prisma`
In your codebase, ensure the `datasource` block in `prisma/schema.prisma` uses `postgresql`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Push this schema to your Neon database locally:
```bash
DATABASE_URL="your_neon_url" pnpm prisma db push
DATABASE_URL="your_neon_url" pnpm prisma db seed
```

---

### Step 3: Deploy Project on Vercel
1. Go to **[https://vercel.com/new](https://vercel.com/new)**.
2. Select **`Akashbora02/ab-tutorials`** and click **Import**.
3. In the configuration screen:
   - **Framework Preset**: Next.js (detected automatically)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `pnpm build` (or `npx prisma generate && next build`)
   - **Output Directory**: `.next`
4. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | *Paste your Neon PostgreSQL URL* |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `admin123` |
5. Click **"Deploy"**!

---

### Step 4: Verify Deployment
Once Vercel finishes building (usually in ~60 seconds):
- Your production URL will be live (e.g. `https://ab-tutorials-akashbora02.vercel.app`).
- Test student online admission, CBT examination portal, and the private admin dashboard.
- Any new commits pushed to `main` will automatically trigger a Vercel production deployment!
