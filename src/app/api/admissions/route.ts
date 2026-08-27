import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to normalize class
function normalizeClass(rawClass?: string): string {
  if (!rawClass) return '10th';
  const numMatch = rawClass.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    if (num === '7' || num === '8') return '8th';
    if (num === '9') return '9th';
    if (num === '10') return '10th';
  }
  return rawClass.trim();
}

// GET /api/admissions - List admission leads with optional filters
export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseTables();
    const { searchParams } = new URL(req.url);
    const rawClass = searchParams.get('class');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const targetClass = rawClass && rawClass !== 'ALL' ? normalizeClass(rawClass) : null;

    const where: any = {};

    if (targetClass) {
      where.targetClass = targetClass;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { studentName: { contains: search } },
        { parentName: { contains: search } },
        { phone: { contains: search } },
        { schoolName: { contains: search } },
      ];
    }

    const admissions = await prisma.admissionEnquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Compute class-wise stats summary
    const classCounts = await prisma.admissionEnquiry.groupBy({
      by: ['targetClass'],
      _count: { id: true },
    }).catch(() => []);

    return NextResponse.json({
      success: true,
      data: admissions,
      classCounts: classCounts.reduce((acc: any, curr) => {
        acc[curr.targetClass] = curr._count.id;
        return acc;
      }, {}),
    });
  } catch (error: any) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admissions' },
      { status: 500 }
    );
  }
}

// POST /api/admissions - Submit admission application with strict duplicate prevention & student creation
export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseTables();
    const body = await req.json();
    const {
      studentName,
      parentName,
      email,
      phone,
      targetClass: rawTargetClass,
      subjects,
      schoolName,
      previousPercentage,
      preferredBatch,
      message,
    } = body;

    // 1. Validation
    if (!studentName?.trim() || !parentName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please fill in all required fields: Student Name, Parent Name, and Mobile Number.' 
        },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const cleanClass = normalizeClass(rawTargetClass);
    const cleanEmail = email?.trim() || null;
    const cleanSubjects = subjects || 'Mathematics & Science';
    const cleanStudentName = studentName.trim();
    const cleanParentName = parentName.trim();
    const studentPin = '1234';

    // 2. Duplicate Check
    let existingStudent = null;
    let existingEnquiry = null;

    try {
      existingStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ],
        },
      });

      existingEnquiry = await prisma.admissionEnquiry.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ],
        },
      });
    } catch (e) {
      console.warn('Duplicate query check warning (proceeding):', e);
    }

    if (existingStudent || existingEnquiry) {
      const matchedName = existingStudent?.name || existingEnquiry?.studentName || cleanStudentName;
      const matchedRoll = existingStudent?.rollNo || 'Registered';
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          error: `An application with Mobile Number (${cleanPhone}) already exists for "${matchedName}" (Roll No: ${matchedRoll}).`,
          existingRollNo: existingStudent?.rollNo,
          existingPhone: cleanPhone,
          existingName: matchedName,
        },
        { status: 409 }
      );
    }

    // 3. Generate Unique Roll Number
    const classNum = cleanClass.replace(/[^0-9]/g, '');
    let nextNum = 1;

    try {
      const classStudents = await prisma.student.findMany({
        where: { class: cleanClass },
        select: { rollNo: true },
      });
      const existingNums = classStudents.map((s) => {
        const match = s.rollNo.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      });
      if (existingNums.length > 0) {
        nextNum = Math.max(...existingNums) + 1;
      }
    } catch (e) {
      nextNum = Math.floor(10 + Math.random() * 90);
    }

    const newRollNumber = `AB-${classNum}${String(nextNum).padStart(2, '0')}`;

    // 4. Create Student Account
    const student = await prisma.student.create({
      data: {
        rollNo: newRollNumber,
        name: cleanStudentName,
        email: cleanEmail,
        phone: cleanPhone,
        class: cleanClass,
        subjects: cleanSubjects,
        parentName: cleanParentName,
        parentPhone: cleanPhone,
        pin: studentPin,
        status: 'Active',
      },
    });

    // 5. Create Admission Enquiry for Admin Ledger
    const newEnquiry = await prisma.admissionEnquiry.create({
      data: {
        studentName: cleanStudentName,
        parentName: cleanParentName,
        email: cleanEmail,
        phone: cleanPhone,
        targetClass: cleanClass,
        subjects: cleanSubjects,
        schoolName: schoolName?.trim() || '',
        previousPercentage: previousPercentage?.trim() || '',
        preferredBatch: preferredBatch || 'Evening Batch',
        message: message?.trim() || '',
        status: 'NEW',
        staffNotes: `Registered Online. Auto Roll No: ${student.rollNo}, PIN: ${student.pin}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admission registered successfully!',
        data: {
          enquiryId: newEnquiry.id,
          studentId: student.id,
          rollNo: student.rollNo,
          pin: student.pin,
          studentName: student.name,
          class: student.class,
          subjects: student.subjects,
          phone: student.phone,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admission enquiry and student:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to process admission registration. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admissions - Update enquiry status or staff notes
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, staffNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.admissionEnquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(staffNotes !== undefined ? { staffNotes } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}
