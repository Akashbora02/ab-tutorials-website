import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseTables();

    const body = await req.json();
    const { 
      password, 
      confirmationText,
      flushStudents = true, 
      flushAdmissions = true, 
      flushSubmissions = true, 
      flushMessages = false 
    } = body;

    // Safety guard 1: Confirmation text must match exactly "FLUSH"
    if (confirmationText !== 'FLUSH') {
      return NextResponse.json(
        { success: false, error: 'Confirmation phrase must be exactly "FLUSH" (in uppercase).' },
        { status: 400 }
      );
    }

    // Safety guard 2: Admin Password Verification
    const envAdminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUser = await prisma.admin.findFirst();
    const validPassword = adminUser?.password || envAdminPass;

    if (!password || (password !== validPassword && password !== envAdminPass)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Admin Password. Access Denied.' },
        { status: 401 }
      );
    }

    const report: {
      studentsDeleted?: number;
      admissionsDeleted?: number;
      submissionsDeleted?: number;
      messagesDeleted?: number;
    } = {};

    // 1. Flush Test Submissions (Student scorecards)
    if (flushSubmissions) {
      const resSubmissions = await prisma.testSubmission.deleteMany({});
      report.submissionsDeleted = resSubmissions.count;
    }

    // 2. Flush Student Roster
    if (flushStudents) {
      const resStudents = await prisma.student.deleteMany({});
      report.studentsDeleted = resStudents.count;
    }

    // 3. Flush Admission Enquiries & Leads
    if (flushAdmissions) {
      const resAdmissions = await prisma.admissionEnquiry.deleteMany({});
      report.admissionsDeleted = resAdmissions.count;
    }

    // 4. Optionally flush Contact Messages if explicitly selected
    if (flushMessages) {
      const resMessages = await prisma.contactMessage.deleteMany({});
      report.messagesDeleted = resMessages.count;
    }

    // Fetch refreshed telemetry stats
    const [totalStudents, totalAdmissions, totalSubmissions, totalTests] = await Promise.all([
      prisma.student.count(),
      prisma.admissionEnquiry.count(),
      prisma.testSubmission.count(),
      prisma.test.count(),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Student-related database records successfully flushed.',
      report,
      preserved: {
        testsIntact: totalTests,
        adminIntact: true,
        topResultsIntact: true,
      },
      currentStats: {
        totalStudents,
        totalAdmissions,
        totalSubmissions,
      }
    });

  } catch (error: any) {
    console.error('Error during student database flush:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute student database flush.' },
      { status: 500 }
    );
  }
}
