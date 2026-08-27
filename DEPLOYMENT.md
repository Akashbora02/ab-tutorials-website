# Complete Vercel Deployment Guide for AB Tutorials

This guide provides clear, step-by-step instructions to host the **AB Tutorials** full-stack web application on **Vercel** with zero downtime.

---

## 📋 Institute Contact & Standards Defaults
- **Target Standards:** **Classes 8th, 9th, and 10th (Science & Mathematics)**
- **Admin Email:** `akshaybora82@gmail.com`
- **Phone / WhatsApp:** `+91 98907 24002` (`9890724002`)
- **Center Location:** `Rajuri, Tal-Rahata, Dist-Ahilyanagar, 413737`
- **Facebook:** `https://www.facebook.com/akshay.bora1122`
- **Instagram:** `https://www.instagram.com/tr_akshay_bora/`

---

## 🚀 Method 1: Deploy with GitHub + Vercel (Recommended)

### Step 1: Push Code to GitHub
1. Open your terminal in the project directory:
   ```bash
   cd ab-tutorials
   git init
   git add .
   git commit -m "feat: AB Tutorials Full-Stack Platform for 8th-10th Classes"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `ab-tutorials`.
3. Push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ab-tutorials.git
   git push -u origin main
   ```

---

### Step 2: Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your `ab-tutorials` GitHub repository and click **Import**.
4. In the Project Configuration:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`

---

### Step 3: Configure Cloud Database & Environment Variables

Because Vercel serverless functions are stateless, production database data requires a cloud PostgreSQL database:

#### Option A: Use Neon Serverless PostgreSQL (Takes 1 minute)
1. Go to [neon.tech](https://neon.tech) and create a free PostgreSQL database.
2. Copy the Connection String URI (e.g., `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).

#### Option B: Use Vercel Postgres / Storage
1. In your Vercel Project Dashboard, click the **"Storage"** tab.
2. Click **"Create Database"** &rarr; **"Postgres"**.
3. Accept default settings and click **"Create & Link"**.

#### Set Environment Variables in Vercel:
In Vercel Dashboard &rarr; **Settings** &rarr; **Environment Variables**, add:
| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` (your cloud Postgres URI) | Database Connection URI |
| `ADMIN_USERNAME` | `admin` | Admin panel login |
| `ADMIN_PASSWORD` | `YourSecurePassword123` | Admin panel password |
| `NEXT_PUBLIC_APP_NAME` | `AB Tutorials` | Institute Name |
| `NEXT_PUBLIC_PHONE` | `+91 98907 24002` | Contact phone |
| `NEXT_PUBLIC_WHATSAPP` | `9890724002` | WhatsApp number |
| `NEXT_PUBLIC_EMAIL` | `akshaybora82@gmail.com` | Official Email |
| `NEXT_PUBLIC_ADDRESS` | `Rajuri, Tal-Rahata, Dist-Ahilyanagar, 413737` | Location |

---

### Step 4: Build & Database Push
In `prisma/schema.prisma`, when switching to PostgreSQL in production, set:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

In your Vercel project settings, set the **Build Command** to:
```bash
prisma generate && next build
```

---

### Step 5: Deploy!
Click **"Deploy"**. Vercel will build your application, generate the optimized pages, and deploy to your custom `.vercel.app` domain in seconds!

---

## 🛡️ Default Credentials for Production
- **Admin URL:** `https://your-domain.vercel.app/admin/login`
- **Username:** `admin`
- **Password:** `admin123` (or custom value in `ADMIN_PASSWORD` env)
- **Student Demo Roll Numbers:** `AB-1001`, `AB-1002`, `AB-901`, `AB-801` (PIN: `1234`)
