import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/top-results - Fetch all Top Results (Hall of Fame)
export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseTables();

    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const rawClass = searchParams.get('class');

    const where: any = {};
    if (featuredOnly) where.isFeatured = true;
    if (rawClass && rawClass !== 'ALL') where.class = rawClass;

    const results = await prisma.topResult.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error fetching top results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top results', data: [] },
      { status: 500 }
    );
  }
}

// POST /api/top-results - Create new Top Result (Admin)
export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseTables();

    const body = await req.json();
    const {
      studentName,
      class: studentClass = '10th',
      percentage,
      score,
      schoolName = 'SYCV Rajuri',
      year = '2024-25',
      subject = 'Mathematics & Science',
      rank,
      testimonial,
      photoUrl,
      isFeatured = true,
      order = 0,
    } = body;

    if (!studentName || !percentage) {
      return NextResponse.json(
        { success: false, error: 'Student Name and Percentage are required.' },
        { status: 400 }
      );
    }

    const created = await prisma.topResult.create({
      data: {
        studentName: studentName.trim(),
        class: studentClass,
        percentage: percentage.trim(),
        score: score ? score.trim() : null,
        schoolName: schoolName ? schoolName.trim() : 'SYCV Rajuri',
        year: year.trim(),
        subject: subject.trim(),
        rank: rank ? rank.trim() : null,
        testimonial: testimonial ? testimonial.trim() : null,
        photoUrl: photoUrl ? photoUrl.trim() : null,
        isFeatured: Boolean(isFeatured),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    console.error('Error creating top result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create top result.' },
      { status: 500 }
    );
  }
}

// PATCH /api/top-results - Edit Top Result (Admin)
export async function PATCH(req: NextRequest) {
  try {
    await ensureDatabaseTables();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Top Result ID is required for editing.' },
        { status: 400 }
      );
    }

    const updated = await prisma.topResult.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating top result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update top result.' },
      { status: 500 }
    );
  }
}

// DELETE /api/top-results - Delete Top Result (Admin)
export async function DELETE(req: NextRequest) {
  try {
    await ensureDatabaseTables();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Top Result ID is required for deletion.' },
        { status: 400 }
      );
    }

    await prisma.topResult.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Top result successfully deleted.',
    });
  } catch (error: any) {
    console.error('Error deleting top result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete top result.' },
      { status: 500 }
    );
  }
}
