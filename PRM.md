# Product Requirements Document (PRM.md)
## AB Tutorials — Senior Full-Stack Academic & Online Assessment Platform

---

## 1. Executive Summary & Institute Identity
**AB Tutorials** is a premier coaching academy specializing in **Mathematics and Science** for students in **Grades 8th, 9th, and 10th**, directed by **Prof. Akshay Bora** (M.Sc Botany, B.Ed) and based at **Rajuri (Near New Talathi Office), Tal-Rahata, Dist-Ahilyanagar, 413737**.

### Official Identity & Leadership:
- **Institute Slogan:** `Building strong foundation for student success`
- **Director / Principal Faculty:** Prof. Akshay Bora (M.Sc in Botany, B.Ed)
- **Director Profile:**
  > *"With 4+ years of teaching experience, Prof. Akshay Bora is known for simplifying complex concepts and guiding students towards success.*  
  > *My name is Akshay Bora. I am a dedicated teacher with a strong passion for education. I have completed my M.Sc in Botany and B.Ed.*  
  > *I am currently working as a teacher and also run coaching classes for students from 8th to 10th standard, focusing on Science and Mathematics. I believe in making learning simple, interesting, and practical for students.*  
  > *I am hardworking, disciplined, and always ready to help my students achieve their goals. My aim is to guide students towards success and build a strong academic foundation for their future."*
- **Primary Contact / WhatsApp:** `+91 98907 24002` (`9890724002`)
- **Official Email:** `akshaybora82@gmail.com`
- **Center Location:** `Rajuri (Near New Talathi Office), Tal-Rahata, Dist-Ahilyanagar, Maharashtra - 413737`
- **Target Standards:** **Classes 8th, 9th, and 10th (Science & Mathematics)**
- **Facebook:** `https://www.facebook.com/akshay.bora1122`
- **Instagram:** `https://www.instagram.com/tr_akshay_bora/`

---

## 2. Core Functional Workflows

### 2.1 Online Admission & Automated Credentials Provisioning
- When a student or parent fills the Online Admission form (`/admission`):
  1. Validates mobile number and email against duplicates. If existing, raises an interactive duplicate modal offering direct login.
  2. Creates an admission lead in the database for faculty review.
  3. **Automatically creates an enrolled Student Account** with:
     - Class-specific Roll Number (e.g. `AB-1001` for 10th, `AB-901` for 9th, `AB-801` for 8th).
     - 4-digit student login PIN (`1234`).
     - Selected subjects (`Mathematics & Science`, `Mathematics Only`, `Science Only`).
  4. Displays an instant **Student Credentials Card** on the confirmation screen with a 1-click **"Launch My Class Examination Portal"** action.

### 2.2 Flexible Student Login
- Students log in to the assessment arena using **EITHER**:
  - Their Assigned Roll Number (e.g. `AB-1001`)
  - **OR their Registered Mobile Phone Number** (e.g. `9890724002`)
  + their 4-digit PIN.
- PIN field starts empty by default.
- Logging out or switching user automatically redirects to the Home page (`/`).

### 2.3 Computer-Based Testing (CBT) Standard
- **Standard Format**:
  - **6 Questions** per exam
  - **2 Marks** per question
  - **12 Total Marks** (6 × 2)
  - **5 Passing Marks**
  - **20 Minutes** countdown timer
- **Access Control**: Unauthenticated visitors clicking "Start Examination" are gated by a mandatory student login / admission modal.
- **Strict Class Filtering**: Students only see exams for their enrolled standard (8th, 9th, or 10th).

### 2.4 Private Admin Command Center (`/admin/login`)
- Focused 5-module management suite:
  1. **Admissions Manager (`/admin/admissions`)**: Filter leads by class (8th, 9th, 10th), update status, log staff counseling notes, export to CSV.
  2. **Student Roster (`/admin/students`)**: Manage roll numbers, registered phone numbers, PINs, and enrollment statuses.
  3. **Test Results Ledger (`/admin/results`)**: Class-wise scorecards, auto-graded percentages, detailed answer sheet inspector, export to CSV.
  4. **Test & Question Bank Builder (`/admin/tests`)**: Author and publish standardized 6-question (12 marks) tests with explanations.
  5. **Parent Inquiries (`/admin/messages`)**: Read and resolve incoming website queries.
