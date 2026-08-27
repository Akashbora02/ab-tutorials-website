import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetClass = searchParams.get('class');
    const search = searchParams.get('search');

    const where: any = {};

    if (targetClass && targetClass !== 'ALL') {
      where.class = targetClass;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { rollNo: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: [{ class: 'asc' }, { rollNo: 'asc' }],
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student directory' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rollNo, phone, class: studentClass, email, parentName, parentPhone, pin } = body;

    if (!name || !rollNo || !phone || !studentClass) {
      return NextResponse.json(
        { success: false, error: 'Missing required student fields' },
        { status: 400 }
      );
    }

    // Check unique rollNo
    const existing = await prisma.student.findUnique({
      where: { rollNo },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Student with this Roll No already exists' },
        { status: 409 }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        name,
        rollNo,
        phone,
        class: studentClass,
        email: email || '',
        parentName: parentName || '',
        parentPhone: parentPhone || '',
        pin: pin || '1234',
        status: 'Active',
      },
    });

    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add student' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID required' },
        { status: 400 }
      );
    }

    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Student removed' });
  } catch (error: any) {
    console.error('Error removing student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove student' },
      { status: 500 }
    );
  }
}
