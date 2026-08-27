import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admissions - List admission leads with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetClass = searchParams.get('class');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (targetClass && targetClass !== 'ALL') {
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
    });

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

// POST /api/admissions - Submit admission application with strict duplicate prevention
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName,
      parentName,
      email,
      phone,
      targetClass,
      subjects,
      schoolName,
      previousPercentage,
      preferredBatch,
      message,
    } = body;

    // 1. Validation
    if (!studentName?.trim() || !parentName?.trim() || !phone?.trim() || !targetClass?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please fill in all mandatory fields: Student Name, Parent Name, Mobile Number, and Target Class.' 
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

    const cleanEmail = email?.trim() || '';
    const cleanClass = targetClass === '7th' ? '8th' : targetClass.trim();
    const cleanSubjects = subjects || 'Mathematics & Science';
    const cleanStudentName = studentName.trim();
    const cleanParentName = parentName.trim();
    const studentPin = '1234';

    // 2. Strict Duplicate Check (Check existing Student or Admission Enquiry)
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    const existingEnquiry = await prisma.admissionEnquiry.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (existingStudent || existingEnquiry) {
      const matchedName = existingStudent?.name || existingEnquiry?.studentName || 'Student';
      const matchedRoll = existingStudent?.rollNo || 'Registered';
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          error: `An application with this Mobile Number (${cleanPhone}) already exists for "${matchedName}" (Roll No: ${matchedRoll}).`,
          existingRollNo: existingStudent?.rollNo,
          existingPhone: cleanPhone,
          existingName: matchedName,
        },
        { status: 409 }
      );
    }

    // 3. Generate unique Roll Number based on Class
    const classNumeric = cleanClass.replace(/[^0-9]/g, '');
    const prefix = `AB-${classNumeric}`;

    const existingCount = await prisma.student.count({
      where: { class: cleanClass },
    });

    const newRollNumber = `${prefix}${String(existingCount + 1).padStart(2, '0')}`;

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
      { success: false, error: 'Failed to process admission registration. Please try again.' },
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
    console.error('Error updating admission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admission' },
      { status: 500 }
    );
  }
}

// DELETE /api/admissions - Delete an enquiry and optionally associated student
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID required' },
        { status: 400 }
      );
    }

    const enquiry = await prisma.admissionEnquiry.findUnique({
      where: { id },
    });

    if (enquiry) {
      // Also delete from student if needed
      await prisma.student.deleteMany({
        where: { phone: enquiry.phone },
      });

      await prisma.admissionEnquiry.delete({
        where: { id },
      });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting admission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete admission' },
      { status: 500 }
    );
  }
}
