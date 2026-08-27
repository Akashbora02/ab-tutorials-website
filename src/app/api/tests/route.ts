import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/tests - List all tests with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetClass = searchParams.get('class');
    const subject = searchParams.get('subject');

    const where: any = { isPublished: true };

    if (targetClass && targetClass !== 'ALL') {
      where.class = targetClass;
    }

    if (subject && subject !== 'ALL') {
      where.subject = subject;
    }

    const tests = await prisma.test.findMany({
      where,
      include: {
        _count: {
          select: { questions: true, submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: tests });
  } catch (error: any) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

// POST /api/tests - Create a new test with questions (Admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      subject,
      class: targetClass,
      durationMinutes,
      totalMarks,
      passingMarks,
      description,
      difficulty,
      questions,
    } = body;

    if (!title || !subject || !targetClass || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: 'Missing required test information or questions' },
        { status: 400 }
      );
    }

    const createdTest = await prisma.test.create({
      data: {
        title,
        subject,
        class: targetClass,
        durationMinutes: Number(durationMinutes) || 30,
        totalMarks: Number(totalMarks) || (questions.length * 4),
        passingMarks: Number(passingMarks) || Math.floor((questions.length * 4) * 0.4),
        description: description || '',
        difficulty: difficulty || 'Medium',
        isPublished: true,
        questions: {
          create: questions.map((q: any, index: number) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation || '',
            marks: Number(q.marks) || 4,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, data: createdTest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test' },
      { status: 500 }
    );
  }
}
