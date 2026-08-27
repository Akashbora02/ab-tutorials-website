import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  schemaInitialized: boolean | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Self-healing helper: automatically creates tables if the database is newly initialized on Vercel/Neon/PostgreSQL.
 */
export async function ensureDatabaseTables() {
  if (globalForPrisma.schemaInitialized) return;

  try {
    // 1. Admin Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Admin" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL DEFAULT 'Prof. Akshay Bora',
        "email" TEXT NOT NULL DEFAULT 'akshaybora82@gmail.com',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Student Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Student" (
        "id" TEXT PRIMARY KEY,
        "rollNo" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT NOT NULL,
        "class" TEXT NOT NULL,
        "subjects" TEXT NOT NULL DEFAULT 'Mathematics & Science',
        "parentName" TEXT,
        "parentPhone" TEXT,
        "address" TEXT,
        "pin" TEXT NOT NULL DEFAULT '1234',
        "status" TEXT NOT NULL DEFAULT 'Active',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. AdmissionEnquiry Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AdmissionEnquiry" (
        "id" TEXT PRIMARY KEY,
        "studentName" TEXT NOT NULL,
        "parentName" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT NOT NULL,
        "targetClass" TEXT NOT NULL,
        "subjects" TEXT NOT NULL DEFAULT 'Mathematics & Science',
        "schoolName" TEXT,
        "previousPercentage" TEXT,
        "preferredBatch" TEXT,
        "message" TEXT,
        "status" TEXT NOT NULL DEFAULT 'NEW',
        "staffNotes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Test Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Test" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "class" TEXT NOT NULL,
        "durationMinutes" INTEGER NOT NULL DEFAULT 20,
        "totalMarks" INTEGER NOT NULL DEFAULT 12,
        "passingMarks" INTEGER NOT NULL DEFAULT 5,
        "description" TEXT,
        "difficulty" TEXT NOT NULL DEFAULT 'Medium',
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Question Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Question" (
        "id" TEXT PRIMARY KEY,
        "testId" TEXT NOT NULL REFERENCES "Test"("id") ON DELETE CASCADE,
        "questionText" TEXT NOT NULL,
        "optionA" TEXT NOT NULL,
        "optionB" TEXT NOT NULL,
        "optionC" TEXT NOT NULL,
        "optionD" TEXT NOT NULL,
        "correctOption" TEXT NOT NULL,
        "explanation" TEXT,
        "marks" INTEGER NOT NULL DEFAULT 2,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. TestSubmission Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TestSubmission" (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT,
        "studentName" TEXT NOT NULL,
        "studentRollNo" TEXT,
        "studentClass" TEXT NOT NULL,
        "testId" TEXT NOT NULL REFERENCES "Test"("id") ON DELETE CASCADE,
        "score" INTEGER NOT NULL,
        "totalMarks" INTEGER NOT NULL,
        "percentage" DOUBLE PRECISION NOT NULL,
        "timeTakenSeconds" INTEGER NOT NULL,
        "answersJson" TEXT NOT NULL,
        "isPassed" BOOLEAN NOT NULL,
        "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. ContactMessage Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    globalForPrisma.schemaInitialized = true;
  } catch (err) {
    console.warn('Database self-healing schema creation notice:', err);
  }
}
