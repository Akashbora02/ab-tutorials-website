import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const [
      totalAdmissions,
      totalStudents,
      totalTests,
      totalSubmissions,
      admissionsByClass,
      studentsByClass,
      recentAdmissions,
      recentSubmissions,
      unreadMessages,
    ] = await Promise.all([
      prisma.admissionEnquiry.count(),
      prisma.student.count(),
      prisma.test.count(),
      prisma.testSubmission.count(),
      prisma.admissionEnquiry.groupBy({
        by: ['targetClass'],
        _count: { id: true },
      }),
      prisma.student.groupBy({
        by: ['class'],
        _count: { id: true },
      }),
      prisma.admissionEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: {
          test: {
            select: { title: true, subject: true },
          },
        },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    const formattedAdmissionsByClass = {
      '8th': 0,
      '9th': 0,
      '10th': 0,
    };
    admissionsByClass.forEach((item) => {
      (formattedAdmissionsByClass as any)[item.targetClass] = item._count.id;
    });

    const formattedStudentsByClass = {
      '8th': 0,
      '9th': 0,
      '10th': 0,
    };
    studentsByClass.forEach((item) => {
      (formattedStudentsByClass as any)[item.class] = item._count.id;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalAdmissions,
        totalStudents,
        totalTests,
        totalSubmissions,
        unreadMessages,
        admissionsByClass: formattedAdmissionsByClass,
        studentsByClass: formattedStudentsByClass,
        recentAdmissions,
        recentSubmissions,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
