import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      );
    }

    if (!isAdmin) {
      // Strip correct options and explanations for test takers
      const sanitizedQuestions = test.questions.map((q) => ({
        id: q.id,
        testId: q.testId,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        marks: q.marks,
        order: q.order,
      }));

      return NextResponse.json({
        success: true,
        data: {
          ...test,
          questions: sanitizedQuestions,
        },
      });
    }

    return NextResponse.json({ success: true, data: test });
  } catch (error: any) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.test.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Test deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete test' },
      { status: 500 }
    );
  }
}
