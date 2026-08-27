import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetClass = searchParams.get('class');
    const testId = searchParams.get('testId');
    const studentRollNo = searchParams.get('rollNo');
    const search = searchParams.get('search');

    const where: any = {};

    if (targetClass && targetClass !== 'ALL') {
      where.studentClass = targetClass;
    }

    if (testId && testId !== 'ALL') {
      where.testId = testId;
    }

    if (studentRollNo) {
      where.studentRollNo = studentRollNo;
    }

    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { studentRollNo: { contains: search } },
      ];
    }

    const submissions = await prisma.testSubmission.findMany({
      where,
      include: {
        test: {
          select: {
            title: true,
            subject: true,
            class: true,
            passingMarks: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    // Aggregations
    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter((s) => s.isPassed).length;
    const passRate = totalSubmissions > 0 ? (passedCount / totalSubmissions) * 100 : 0;
    const avgPercentage =
      totalSubmissions > 0
        ? submissions.reduce((sum, s) => sum + s.percentage, 0) / totalSubmissions
        : 0;

    return NextResponse.json({
      success: true,
      data: submissions,
      stats: {
        totalSubmissions,
        passedCount,
        passRate: Number(passRate.toFixed(1)),
        avgPercentage: Number(avgPercentage.toFixed(1)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}
