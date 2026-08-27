import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      studentName,
      studentRollNo,
      studentClass,
      answers, // { [questionId]: "A" | "B" | "C" | "D" }
      timeTakenSeconds,
    } = body;

    if (!studentName || !answers) {
      return NextResponse.json(
        { success: false, error: 'Student name and answers are required' },
        { status: 400 }
      );
    }

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

    let calculatedScore = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const questionResults = test.questions.map((q) => {
      totalMarks += q.marks;
      const studentChoice = answers[q.id] || null;
      const isAnswered = studentChoice !== null && studentChoice !== undefined;
      const isCorrect = isAnswered && studentChoice === q.correctOption;

      if (!isAnswered) {
        unattemptedCount++;
      } else if (isCorrect) {
        calculatedScore += q.marks;
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        selectedOption: studentChoice,
        correctOption: q.correctOption,
        isCorrect,
        isAnswered,
        explanation: q.explanation,
        marksAwarded: isCorrect ? q.marks : 0,
        maxMarks: q.marks,
      };
    });

    const percentage = totalMarks > 0 ? (calculatedScore / totalMarks) * 100 : 0;
    const isPassed = calculatedScore >= test.passingMarks;

    // Save submission to DB
    const submission = await prisma.testSubmission.create({
      data: {
        testId: test.id,
        studentName,
        studentRollNo: studentRollNo || 'GUEST',
        studentClass: studentClass || test.class,
        score: calculatedScore,
        totalMarks,
        percentage: Number(percentage.toFixed(1)),
        timeTakenSeconds: timeTakenSeconds || 0,
        answersJson: JSON.stringify(answers),
        isPassed,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        submissionId: submission.id,
        testTitle: test.title,
        subject: test.subject,
        class: test.class,
        studentName,
        score: calculatedScore,
        totalMarks,
        passingMarks: test.passingMarks,
        percentage: Number(percentage.toFixed(1)),
        isPassed,
        timeTakenSeconds: timeTakenSeconds || 0,
        correctCount,
        wrongCount,
        unattemptedCount,
        totalQuestions: test.questions.length,
        questionResults,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error: any) {
    console.error('Error grading test submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process test submission' },
      { status: 500 }
    );
  }
}
