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
      prisma.admissionEnquiry.count().catch(() => 0),
      prisma.student.count().catch(() => 0),
      prisma.test.count().catch(() => 0),
      prisma.testSubmission.count().catch(() => 0),
      prisma.admissionEnquiry.groupBy({
        by: ['targetClass'],
        _count: { id: true },
      }).catch(() => []),
      prisma.student.groupBy({
        by: ['class'],
        _count: { id: true },
      }).catch(() => []),
      prisma.admissionEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
      prisma.testSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: {
          test: {
            select: { title: true, subject: true },
          },
        },
      }).catch(() => []),
      prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
    ]);

    const formattedAdmissionsByClass = {
      '8th': 0,
      '9th': 0,
      '10th': 0,
    };
    (admissionsByClass || []).forEach((item) => {
      if (item?.targetClass) {
        (formattedAdmissionsByClass as any)[item.targetClass] = item._count.id;
      }
    });

    const formattedStudentsByClass = {
      '8th': 0,
      '9th': 0,
      '10th': 0,
    };
    (studentsByClass || []).forEach((item) => {
      if (item?.class) {
        (formattedStudentsByClass as any)[item.class] = item._count.id;
      }
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
    return NextResponse.json({
      success: true,
      data: {
        totalAdmissions: 0,
        totalStudents: 0,
        totalTests: 0,
        totalSubmissions: 0,
        unreadMessages: 0,
        admissionsByClass: { '8th': 0, '9th': 0, '10th': 0 },
        studentsByClass: { '8th': 0, '9th': 0, '10th': 0 },
        recentAdmissions: [],
        recentSubmissions: [],
      },
    });
  }
}
