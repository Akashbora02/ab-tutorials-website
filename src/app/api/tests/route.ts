import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Complete initial standardized test series (6 questions each, 2 marks per question = 12 marks total)
const initialTestsData = [
  // 1. Class 10th Mathematics
  {
    title: 'Class 10 - Mathematics: Quadratic Equations & Arithmetic Progressions',
    subject: 'Mathematics',
    class: '10th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Standardized assessment covering roots of quadratic equations, discriminant tests, and nth term of arithmetic progressions.',
    questions: [
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
  // 2. Class 10th Science
  {
    title: 'Class 10 - Science: Optics, Electricity & Chemical Reactions',
    subject: 'Science',
    class: '10th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Comprehensive board exam questions covering Ray optics, Ohm’s Law, Electrolysis, Redox reactions, and Acids-Bases.',
    questions: [
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
  // 3. Class 9th Mathematics
  {
    title: 'Class 9 - Mathematics: Polynomials, Lines, Angles & Geometry',
    subject: 'Mathematics',
    class: '9th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Algebraic identities, remainder theorem, Euclidean geometry theorems, and coordinate plane calculations.',
    questions: [
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
  // 4. Class 9th Science
  {
    title: 'Class 9 - Science: Motion, Laws of Gravitation & Atomic Structure',
    subject: 'Science',
    class: '9th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Kinematics formulas, Newton\'s laws of motion, Universal gravitation, and Rutherford atomic models.',
    questions: [
      {
        questionText: 'A car accelerates uniformly from 18 km/h to 36 km/h in 5 seconds. The acceleration of the car is:',
        optionA: '1 m/s²',
        optionB: '2 m/s²',
        optionC: '0.5 m/s²',
        optionD: '3.6 m/s²',
        correctOption: 'A',
        explanation: 'u = 18 * (5/18) = 5 m/s, v = 36 * (5/18) = 10 m/s. a = (v - u)/t = (10 - 5)/5 = 1 m/s².',
        marks: 2,
        order: 1,
      },
      {
        questionText: 'What is the SI unit of Universal Gravitational Constant (G)?',
        optionA: 'N m² / kg²',
        optionB: 'N kg² / m²',
        optionC: 'N / kg',
        optionD: 'm / s²',
        correctOption: 'A',
        explanation: 'From F = G(m₁m₂)/r², G = F*r² / (m₁m₂) -> SI unit is N m² / kg².',
        marks: 2,
        order: 2,
      },
      {
        questionText: 'Which organelle is known as the "Powerhouse of the Cell"?',
        optionA: 'Mitochondria',
        optionB: 'Ribosome',
        optionC: 'Golgi Apparatus',
        optionD: 'Endoplasmic Reticulum',
        correctOption: 'A',
        explanation: 'Mitochondria produce ATP through cellular respiration, providing energy required for all cellular activities.',
        marks: 2,
        order: 3,
      },
      {
        questionText: 'The mass number of an atom with 6 protons and 8 neutrons is:',
        optionA: '14',
        optionB: '6',
        optionC: '8',
        optionD: '48',
        correctOption: 'A',
        explanation: 'Mass number A = Protons + Neutrons = 6 + 8 = 14 (Carbon-14 isotope).',
        marks: 2,
        order: 4,
      },
      {
        questionText: 'Inertia of an object depends directly on its:',
        optionA: 'Mass',
        optionB: 'Velocity',
        optionC: 'Volume',
        optionD: 'Shape',
        correctOption: 'A',
        explanation: 'Inertia is the inherent property of matter that resists changes in motion and is directly proportional to mass.',
        marks: 2,
        order: 5,
      },
      {
        questionText: 'What type of solution is blood?',
        optionA: 'Colloidal solution',
        optionB: 'True solution',
        optionC: 'Suspension',
        optionD: 'Pure element',
        correctOption: 'A',
        explanation: 'Blood is a heterogeneous colloidal dispersion consisting of cellular components suspended in liquid plasma.',
        marks: 2,
        order: 6,
      },
    ],
  },
  // 5. Class 8th Mathematics
  {
    title: 'Class 8 - Mathematics: Rational Numbers, Linear Equations & Exponents',
    subject: 'Mathematics',
    class: '8th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Foundational algebra, distributive properties, exponent rules, and single variable linear equations.',
    questions: [
      {
        questionText: 'Solve the equation for x: 5x + 9 = 5 + 3x:',
        optionA: 'x = -2',
        optionB: 'x = 2',
        optionC: 'x = -7',
        optionD: 'x = 7',
        correctOption: 'A',
        explanation: '5x - 3x = 5 - 9 -> 2x = -4 -> x = -2.',
        marks: 2,
        order: 1,
      },
      {
        questionText: 'The additive inverse of -7/19 is:',
        optionA: '7/19',
        optionB: '-19/7',
        optionC: '19/7',
        optionD: '0',
        correctOption: 'A',
        explanation: 'The additive inverse of -a/b is +a/b because (-7/19) + (7/19) = 0.',
        marks: 2,
        order: 2,
      },
      {
        questionText: 'Evaluate: (3⁻¹ + 4⁻¹)⁻¹ :',
        optionA: '12/7',
        optionB: '7/12',
        optionC: '7',
        optionD: '1/7',
        correctOption: 'A',
        explanation: '3⁻¹ + 4⁻¹ = 1/3 + 1/4 = 7/12. Taking reciprocal (7/12)⁻¹ = 12/7.',
        marks: 2,
        order: 3,
      },
      {
        questionText: 'How many diagonals does a regular convex hexagon have?',
        optionA: '9',
        optionB: '6',
        optionC: '12',
        optionD: '8',
        correctOption: 'A',
        explanation: 'Number of diagonals = n(n - 3) / 2 = 6(3) / 2 = 9 diagonals.',
        marks: 2,
        order: 4,
      },
      {
        questionText: 'The smallest number by which 180 must be multiplied to make it a perfect square is:',
        optionA: '5',
        optionB: '2',
        optionC: '3',
        optionD: '6',
        correctOption: 'A',
        explanation: 'Prime factorization of 180 = 2² × 3² × 5. To make it a square, 5 needs a pair, so multiply by 5 (180 × 5 = 900 = 30²).',
        marks: 2,
        order: 5,
      },
      {
        questionText: 'A sum of money doubles itself in 5 years at simple interest. The rate of interest per annum is:',
        optionA: '20%',
        optionB: '10%',
        optionC: '25%',
        optionD: '15%',
        correctOption: 'A',
        explanation: 'Interest I = P. Formula I = (P * R * T)/100 -> P = (P * R * 5)/100 -> R = 100/5 = 20%.',
        marks: 2,
        order: 6,
      },
    ],
  },
  // 6. Class 8th Science
  {
    title: 'Class 8 - Science: Force, Pressure, Sound & Microorganisms',
    subject: 'Science',
    class: '8th',
    durationMinutes: 20,
    totalMarks: 12,
    passingMarks: 5,
    difficulty: 'Medium',
    description: 'Foundational physics and biology: Atmospheric pressure, frequency of sound, friction, and bacterial fermentation.',
    questions: [
      {
        questionText: 'Pressure is defined as Force per unit:',
        optionA: 'Area',
        optionB: 'Volume',
        optionC: 'Mass',
        optionD: 'Length',
        correctOption: 'A',
        explanation: 'Pressure P = Force (F) / Area (A). Its SI unit is Pascal (N/m²).',
        marks: 2,
        order: 1,
      },
      {
        questionText: 'Sound cannot travel through which of the following mediums?',
        optionA: 'Vacuum',
        optionB: 'Water',
        optionC: 'Steel wire',
        optionD: 'Air',
        correctOption: 'A',
        explanation: 'Sound is a mechanical wave that requires a material medium with particles to propagate. It cannot travel in vacuum.',
        marks: 2,
        order: 2,
      },
      {
        questionText: 'Which microorganism converts milk into curd?',
        optionA: 'Lactobacillus',
        optionB: 'Rhizobium',
        optionC: 'Yeast',
        optionD: 'Amoeba',
        correctOption: 'A',
        explanation: 'Lactobacillus bacteria promote the formation of curd by fermenting milk sugar (lactose) into lactic acid.',
        marks: 2,
        order: 3,
      },
      {
        questionText: 'Friction between two sliding surfaces can be reduced by:',
        optionA: 'Using lubricants or ball bearings',
        optionB: 'Making surfaces rougher',
        optionC: 'Increasing the pressing force',
        optionD: 'Sprinkling sand',
        correctOption: 'A',
        explanation: 'Lubricants and ball bearings create a smooth layer that minimizes surface interlocking and lowers friction.',
        marks: 2,
        order: 4,
      },
      {
        questionText: 'The pitch of a sound is determined by its:',
        optionA: 'Frequency',
        optionB: 'Amplitude',
        optionC: 'Loudness',
        optionD: 'Speed',
        correctOption: 'A',
        explanation: 'Pitch depends directly on the frequency of sound vibrations: higher frequency results in higher pitch (shrillness).',
        marks: 2,
        order: 5,
      },
      {
        questionText: 'The process of conversion of sugar into alcohol by yeast is called:',
        optionA: 'Fermentation',
        optionB: 'Pasteurization',
        optionC: 'Sterilization',
        optionD: 'Nitrogen fixation',
        correctOption: 'A',
        explanation: 'Fermentation is the anaerobic conversion of sugar to alcohol and CO₂ by yeast enzymes.',
        marks: 2,
        order: 6,
      },
    ],
  },
];

// Helper to auto-seed initial tests for any missing classes
async function ensureInitialTests(requestedClass?: string | null) {
  try {
    for (const testData of initialTestsData) {
      const existing = await prisma.test.findFirst({
        where: {
          class: testData.class,
          subject: testData.subject,
        },
      });

      if (!existing) {
        await prisma.test.create({
          data: {
            title: testData.title,
            subject: testData.subject,
            class: testData.class,
            durationMinutes: testData.durationMinutes,
            totalMarks: testData.totalMarks,
            passingMarks: testData.passingMarks,
            difficulty: testData.difficulty,
            description: testData.description,
            isPublished: true,
            questions: {
              create: testData.questions.map((q) => ({
                questionText: q.questionText,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctOption: q.correctOption,
                explanation: q.explanation,
                marks: q.marks,
                order: q.order,
              })),
            },
          },
        });
      }
    }
  } catch (err) {
    console.warn('Auto-seed check failed (non-blocking):', err);
  }
}

// Normalize class filter ('10', '10th', 'Class 10')
function normalizeClass(rawClass: string | null): string | null {
  if (!rawClass || rawClass === 'ALL') return null;
  const numMatch = rawClass.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    if (num === '7' || num === '8') return '8th';
    if (num === '9') return '9th';
    if (num === '10') return '10th';
  }
  return rawClass;
}

// GET /api/tests - List all tests with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawClass = searchParams.get('class');
    const rawSubject = searchParams.get('subject');

    const targetClass = normalizeClass(rawClass);
    await ensureInitialTests(targetClass);

    const where: any = { isPublished: true };

    if (targetClass) {
      where.class = targetClass;
    }

    if (rawSubject && rawSubject !== 'ALL') {
      where.subject = rawSubject;
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
      class: rawClass,
      durationMinutes,
      totalMarks,
      passingMarks,
      description,
      difficulty,
      questions,
    } = body;

    const targetClass = normalizeClass(rawClass) || '10th';

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
