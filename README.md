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
   - **Homepage**: Hero showcase, dynamic database-backed Hall of Fame (Rahul 95%, Sneha 92%, Amit 90%), 4-stage pedagogy, photo galleries, and WhatsApp counseling actions.
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
   - **Overview Telemetry**: Real-time KPI counts, class distribution graphs, and quick access.
   - **Student Data Flush Engine**: Secure, password-protected utility to wipe student test records while keeping 100% of question banks and admin accounts intact.
   - **Top Results (Hall of Fame) Manager**: Add, edit, feature, and archive top board performers with percentages, ranks, and student testimonials.
   - **Admissions Pipeline**: Class-wise lead records, status toggles (`NEW`, `CONTACTED`, `COUNSELING`, `ENROLLED`), staff notes, UTF-8 BOM CSV export.
   - **Student Roster**: Student directory with roll numbers, registered phone numbers, PINs, and full CSV export.
   - **Test Results Ledger**: Real-time scorecards, raw answer sheets, and CSV export.
   - **Test & Question Builder**: Standardized test and question authoring.
   - **Inquiry Inbox**: Read and resolve incoming website inquiries with CSV export.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **ORM & Database**: Prisma ORM (Cloud PostgreSQL for Vercel production)
- **Runtime**: Node.js 18+ / 20+

---

## 🚀 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Akashbora02/ab-tutorials-website.git
cd ab-tutorials-website

# 2. Install dependencies
pnpm install

# 3. Initialize database
pnpm prisma generate

# 4. Run development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Vercel Deployment Instructions

1. **Repository**: `https://github.com/Akashbora02/ab-tutorials-website.git` (branch `main`)
2. **Environment Variables**:
   - `DATABASE_URL`: *Cloud PostgreSQL connection string (Neon / Supabase)*
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `admin123`
3. Click **Deploy**. Vercel will automatically generate Prisma Client and build all 20 routes.
