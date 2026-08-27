# AB Tutorials — Academic & Online Assessment Platform

> **Institute Slogan**: *Building strong foundation for student success*  
> **Director**: Prof. Akshay Bora (M.Sc Botany, B.Ed)  
> **Center Location**: Rajuri (Near New Talathi Office), Tal-Rahata, Dist-Ahilyanagar, 413737  
> **Contact / WhatsApp**: +91 98907 24002 | **Email**: akshaybora82@gmail.com  
> **Target Classes**: Classes 8th, 9th, and 10th (Science & Mathematics)

---

## 🌟 Platform Overview

**AB Tutorials** is a modern Full-Stack Web Application and Computer-Based Testing (CBT) platform engineered for **Prof. Akshay Bora's** coaching academy in Rajuri.

### ✨ Key Features

1. **Modern Responsive Public Portal**:
   - **Homepage**: Hero showcase, verified student results (Rahul 95%, Sneha 92%, Amit 90%), 4-stage pedagogy, photo galleries, and WhatsApp counseling actions.
   - **About Director**: Verified biography of Prof. Akshay Bora (M.Sc Botany & B.Ed, 4+ Years Experience).
   - **Curriculum & Batches**: Detailed Class 8th, 9th, and 10th Science & Mathematics syllabus.
   - **Classroom Photo Gallery**: Filterable moments from lectures, experiments, and annual topper felicitations.
   - **Contact & Center Location**: Interactive inquiry form and exact directions to Rajuri (Near New Talathi Office).

2. **Online Admission & Automated Student Credential Engine**:
   - Class-wise online admission registration (`/admission`).
   - Duplicate prevention popup for existing mobile numbers/emails.
   - Auto-generation of unique Class Roll Numbers (e.g. `AB-1001`, `AB-901`, `AB-801`) and 4-digit PINs (`1234`).
   - 1-click launch from admission directly to the class examination arena.

3. **Computer-Based Examination (CBT) Arena**:
   - Authenticated student access with strict class and subject filtering.
   - Standardized format: **6 Questions per Exam • 2 Marks Each • 12 Total Marks • 5 Passing Marks • 20 Mins**.
   - Live countdown timer, flag for review, and question palette.
   - Instant auto-grading, pass/fail badges, and step-by-step mathematical & scientific explanations.

4. **Private Admin Command Center (`/admin/login`)**:
   - **Admissions Pipeline**: Class-wise lead records, status toggles (`NEW`, `CONTACTED`, `COUNSELING`, `ENROLLED`), staff notes, CSV export.
   - **Student Roster**: Student directory with roll numbers, registered phone numbers, and PINs.
   - **Test Results Ledger**: Real-time scorecards and raw answer sheets.
   - **Test Builder**: Standardized test and question authoring.
   - **Inquiry Inbox**: Read and resolve incoming website inquiries.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **ORM & Database**: Prisma ORM (SQLite for local dev / Postgres for Vercel production)
- **Runtime**: Node.js 18+ / 20+

---

## 🚀 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Akashbora02/ab-tutorials-website.git
cd ab-tutorials-website

# 2. Install dependencies
pnpm install # or npm install / yarn

# 3. Initialize database
pnpm prisma db push
pnpm prisma db seed

# 4. Run development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Vercel Deployment Instructions

Follow these steps to deploy **AB Tutorials** to Vercel:

### Step 1: Create a Free Cloud Database (PostgreSQL)
Because Vercel is a serverless platform with read-only file systems in production, SQLite should be swapped to a hosted PostgreSQL instance (e.g. **Neon**, **Supabase**, or **Vercel Postgres**):
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy your connection string (e.g. `postgresql://user:password@ep-xyz.neon.tech/abtutorials?sslmode=require`).

### Step 2: Push to GitHub
```bash
git remote set-url origin https://github.com/Akashbora02/ab-tutorials-website.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Log in to [Vercel.com](https://vercel.com) with your GitHub account.
2. Click **"Add New"** &rarr; **"Project"**.
3. Import the `Akashbora02/ab-tutorials-website` repository.
4. In **Environment Variables**, add:
   - `DATABASE_URL`: *Your cloud PostgreSQL connection string*
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `admin123`
5. In `prisma/schema.prisma`, update the provider datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Click **"Deploy"**!

### Step 4: Seed Production Database
In your local terminal or Vercel deployment console:
```bash
DATABASE_URL="your-postgresql-url" pnpm prisma db push
DATABASE_URL="your-postgresql-url" pnpm prisma db seed
```

---

## 👨‍🏫 Institute Leadership

- **Director**: Prof. Akshay Bora
- **Experience**: 4+ Years
- **Location**: Rajuri (Near New Talathi Office), Tal-Rahata, Dist-Ahilyanagar, 413737
- **Phone / WhatsApp**: [+91 98907 24002](https://wa.me/919890724002)
- **Email**: [akshaybora82@gmail.com](mailto:akshaybora82@gmail.com)
