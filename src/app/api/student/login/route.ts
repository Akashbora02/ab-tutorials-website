import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept either rollNo, phone, or generic identifier
    const identifier = (body.rollNo || body.phone || body.identifier || '').trim();
    const pin = (body.pin || '').trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Please enter your Roll Number or Registered Phone Number' },
        { status: 400 }
      );
    }

    // Try finding by Roll Number, exact Phone, stripped Phone, or Email
    const cleanDigits = identifier.replace(/[^0-9]/g, '');

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { rollNo: { equals: identifier } },
          { rollNo: { equals: identifier.toUpperCase() } },
          { phone: { equals: identifier } },
          ...(cleanDigits.length >= 10 ? [{ phone: { contains: cleanDigits.slice(-10) } }] : []),
          { email: { equals: identifier } },
        ],
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: `No student record found for "${identifier}". Please apply online or practice as a Guest.`,
        },
        { status: 404 }
      );
    }

    if (pin && student.pin && student.pin !== pin) {
      return NextResponse.json(
        { success: false, error: 'Incorrect 4-digit Student PIN. Default PIN is 1234.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        rollNo: student.rollNo,
        name: student.name,
        class: student.class,
        subjects: student.subjects || 'Mathematics & Science',
        phone: student.phone,
        email: student.email,
        parentName: student.parentName,
      },
    });
  } catch (error: any) {
    console.error('Error in student login:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process student login' },
      { status: 500 }
    );
  }
}
