import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to auto-seed initial tests if database is completely empty
async function ensureInitialTests() {
  try {
    const count = await prisma.test.count();
    if (count > 0) return;

    // Seed 10th Math
    await prisma.test.create({
      data: {
        title: 'Class 10 - Mathematics: Quadratic Equations & Arithmetic Progressions',
        subject: 'Mathematics',
        class: '10th',
        durationMinutes: 20,
        totalMarks: 12,
        passingMarks: 5,
        difficulty: 'Medium',
        description: 'Standardized assessment covering roots of quadratic equations, discriminant tests, and nth term of arithmetic progressions.',
        questions: {
          create: [
            {
              questionText: 'If the roots of the quadratic equation 2x² - 8x + k = 0 are real and equal, find the value of k:',
              optionA: '8',
              optionB: '4',
              optionC: '16',
              optionD: '2',
              correctOption: 'A',
              explanation: 'For real and equal roots, Discriminant D = b² - 4ac = 0. Here (-8)² - 4(2)(k) = 0 -> 64 - 8k = 0 -> k = 8.',
              marks: 2,
              order: 1,
            },
            {
              questionText: 'Find the 20th term of the Arithmetic Progression 4, 9, 14, 19... :',
              optionA: '99',
              optionB: '95',
              optionC: '104',
              optionD: '100',
              correctOption: 'A',
              explanation: 'First term a = 4, common difference d = 9 - 4 = 5. nth term T₂₀ = a + (n - 1)d = 4 + 19(5) = 4 + 95 = 99.',
              marks: 2,
              order: 2,
            },
            {
              questionText: 'Solve the quadratic equation by factoring: 6x² - x - 2 = 0. The roots are:',
              optionA: '2/3 and -1/2',
              optionB: '-2/3 and 1/2',
              optionC: '3/2 and -2',
              optionD: '1/3 and -2',
              correctOption: 'A',
              explanation: '6x² - 4x + 3x - 2 = 0 -> 2x(3x - 2) + 1(3x - 2) = 0 -> (2x + 1)(3x - 2) = 0. Roots are x = 2/3 and x = -1/2.',
              marks: 2,
              order: 3,
            },
            {
              questionText: 'The sum of first 10 terms of an A.P. whose first term is 2 and common difference is 4 is:',
              optionA: '200',
              optionB: '180',
              optionC: '220',
              optionD: '160',
              correctOption: 'A',
              explanation: 'S₁₀ = (10/2)[2(2) + 9(4)] = 5 * [4 + 36] = 5 * 40 = 200.',
              marks: 2,
              order: 4,
            },
            {
              questionText: 'In a simultaneous linear system 3x + 2y = 11 and 2x + 3y = 4, the value of (x + y) is:',
              optionA: '3',
              optionB: '5',
              optionC: '7',
              optionD: '15',
              correctOption: 'A',
              explanation: 'Adding both equations: 5x + 5y = 15 -> 5(x + y) = 15 -> x + y = 3.',
              marks: 2,
              order: 5,
            },
            {
              questionText: 'The distance between points A(2, -3) and B(10, 3) is:',
              optionA: '10 units',
              optionB: '8 units',
              optionC: '14 units',
              optionD: '12 units',
              correctOption: 'A',
              explanation: 'Distance d = √[(10 - 2)² + (3 - (-3))²] = √[64 + 36] = √100 = 10 units.',
              marks: 2,
              order: 6,
            },
          ],
        },
      },
    });

    // Seed 10th Science
    await prisma.test.create({
      data: {
        title: 'Class 10 - Science: Optics, Electricity & Chemical Reactions',
        subject: 'Science',
        class: '10th',
        durationMinutes: 20,
        totalMarks: 12,
        passingMarks: 5,
        difficulty: 'Medium',
        description: 'Comprehensive board exam questions covering Ray optics, Ohm’s Law, Electrolysis, Redox reactions, and Acids-Bases.',
        questions: {
          create: [
            {
              questionText: 'An object is placed at a distance of 10 cm in front of a convex lens of focal length 15 cm. The image produced is:',
              optionA: 'Virtual, erect and magnified',
              optionB: 'Real, inverted and diminished',
              optionC: 'Real, inverted and magnified',
              optionD: 'Virtual, erect and diminished',
              correctOption: 'A',
              explanation: 'When an object is placed between optical center and principal focus (u < f), the convex lens creates a virtual, erect, and magnified image on the same side.',
              marks: 2,
              order: 1,
            },
            {
              questionText: 'A wire of resistance R is cut into five equal parts. When connected in parallel, the equivalent resistance R\' is:',
              optionA: 'R / 25',
              optionB: '5 R',
              optionC: 'R / 5',
              optionD: '25 R',
              correctOption: 'A',
              explanation: 'Each piece has resistance r = R/5. In parallel connection: 1/R\' = 5 * (1/(R/5)) = 25/R -> R\' = R/25.',
              marks: 2,
              order: 2,
            },
            {
              questionText: 'Which of the following is a balanced equation for the reaction of iron with steam?',
              optionA: '3Fe + 4H₂O(g) -> Fe₃O₄ + 4H₂',
              optionB: '2Fe + 3H₂O(g) -> Fe₂O₃ + 3H₂',
              optionC: 'Fe + H₂O(g) -> FeO + H₂',
              optionD: 'Fe + 2H₂O(g) -> FeO₂ + 2H₂',
              correctOption: 'A',
              explanation: 'Red-hot iron reacts with steam to form magnetic iron oxide (Fe₃O₄) and hydrogen gas: 3Fe(s) + 4H₂O(g) -> Fe₃O₄(s) + 4H₂(g).',
              marks: 2,
              order: 3,
            },
            {
              questionText: 'The refractive index of glass with respect to air is 1.5. The speed of light in glass is (Speed in air = 3 × 10⁸ m/s):',
              optionA: '2.0 × 10⁸ m/s',
              optionB: '2.25 × 10⁸ m/s',
              optionC: '1.5 × 10⁸ m/s',
              optionD: '3.0 × 10⁸ m/s',
              correctOption: 'A',
              explanation: 'v = c / n = (3 × 10⁸ m/s) / 1.5 = 2.0 × 10⁸ m/s.',
              marks: 2,
              order: 4,
            },
            {
              questionText: 'The pH of fresh milk is 6. When it turns into curd, its pH will:',
              optionA: 'Decrease below 6',
              optionB: 'Increase above 6',
              optionC: 'Remain the same',
              optionD: 'Become 7',
              correctOption: 'A',
              explanation: 'Lactobacillus bacteria convert lactose into lactic acid, increasing hydrogen ion concentration [H+] and lowering the pH below 6.',
              marks: 2,
              order: 5,
            },
            {
              questionText: 'Commercial electric energy unit (1 kilowatt-hour) is equal to:',
              optionA: '3.6 × 10⁶ Joules',
              optionB: '3.6 × 10⁵ Joules',
              optionC: '1000 Joules',
              optionD: '3600 Joules',
              correctOption: 'A',
              explanation: '1 kWh = 1000 W × 3600 s = 3,600,000 J = 3.6 × 10⁶ Joules.',
              marks: 2,
              order: 6,
            },
          ],
        },
      },
    });

    // Seed 9th Math
    await prisma.test.create({
      data: {
        title: 'Class 9 - Mathematics: Polynomials, Lines, Angles & Geometry',
        subject: 'Mathematics',
        class: '9th',
        durationMinutes: 20,
        totalMarks: 12,
        passingMarks: 5,
        difficulty: 'Medium',
        description: 'Algebraic identities, remainder theorem, Euclidean geometry theorems, and coordinate plane calculations.',
        questions: {
          create: [
            {
              questionText: 'If x + 1/x = 4, what is the value of x² + 1/x²?',
              optionA: '14',
              optionB: '16',
              optionC: '18',
              optionD: '12',
              correctOption: 'A',
              explanation: '(x + 1/x)² = x² + 2(x)(1/x) + 1/x² -> 4² = x² + 1/x² + 2 -> x² + 1/x² = 16 - 2 = 14.',
              marks: 2,
              order: 1,
            },
            {
              questionText: 'Find the remainder when polynomial p(x) = x³ - 3x² + 4x - 5 is divided by (x - 2):',
              optionA: '-1',
              optionB: '1',
              optionC: '3',
              optionD: '-3',
              correctOption: 'A',
              explanation: 'By Remainder Theorem, Remainder = p(2) = (2)³ - 3(2)² + 4(2) - 5 = 8 - 12 + 8 - 5 = -1.',
              marks: 2,
              order: 2,
            },
            {
              questionText: 'The point (-4, 7) lies in which quadrant of the Cartesian coordinate plane?',
              optionA: 'Quadrant II',
              optionB: 'Quadrant I',
              optionC: 'Quadrant III',
              optionD: 'Quadrant IV',
              correctOption: 'A',
              explanation: 'In the second quadrant, x-coordinate is negative (x < 0) and y-coordinate is positive (y > 0).',
              marks: 2,
              order: 3,
            },
            {
              questionText: 'Two angles forming a linear pair are in the ratio 2:3. The measure of the larger angle is:',
              optionA: '108°',
              optionB: '72°',
              optionC: '120°',
              optionD: '90°',
              correctOption: 'A',
              explanation: '2x + 3x = 180° -> 5x = 180° -> x = 36°. Larger angle = 3 * 36° = 108°.',
              marks: 2,
              order: 4,
            },
            {
              questionText: 'In triangle ABC, if ∠A = 50° and ∠B = 70°, find the measure of exterior angle at vertex C:',
              optionA: '120°',
              optionB: '60°',
              optionC: '110°',
              optionD: '130°',
              correctOption: 'A',
              explanation: 'Ext ∠C = ∠A + ∠B = 50° + 70° = 120°.',
              marks: 2,
              order: 5,
            },
            {
              questionText: 'The area of an equilateral triangle with side 6 cm is:',
              optionA: '9√3 cm²',
              optionB: '18√3 cm²',
              optionC: '36 cm²',
              optionD: '12√3 cm²',
              correctOption: 'A',
              explanation: 'Area = (√3/4) * a² = (√3/4) * 36 = 9√3 cm².',
              marks: 2,
              order: 6,
            },
          ],
        },
      },
    });
  } catch (err) {
    console.warn('Auto-seed check failed (non-blocking):', err);
  }
}

// GET /api/tests - List all tests with optional filters
export async function GET(req: NextRequest) {
  try {
    await ensureInitialTests();

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
    return NextResponse.json({
      success: true,
      data: [],
    });
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
        durationMinutes: Number(durationMinutes) || 20,
        totalMarks: Number(totalMarks) || (questions.length * 2),
        passingMarks: Number(passingMarks) || Math.floor((questions.length * 2) * 0.4),
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
            marks: Number(q.marks) || 2,
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
