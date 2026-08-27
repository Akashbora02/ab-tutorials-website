import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Flushing all old test records and seeding standardized 6-question (2 marks each, 12 marks total) exams...');

  // 1. Seed Admin
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      email: 'akshaybora82@gmail.com',
      name: 'Prof. Akshay Bora',
    },
    create: {
      username: 'admin',
      password: 'admin123',
      name: 'Prof. Akshay Bora',
      email: 'akshaybora82@gmail.com',
    },
  });

  // 2. Flush all old records cleanly
  await prisma.testSubmission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();
  await prisma.admissionEnquiry.deleteMany();
  await prisma.student.deleteMany();
  await prisma.contactMessage.deleteMany();

  // 3. Seed Initial Clean Students
  const students = [
    {
      rollNo: 'AB-1001',
      name: 'Pranav Kadam',
      class: '10th',
      subjects: 'Mathematics & Science',
      phone: '9823401122',
      email: 'pranav.kadam@example.com',
      parentName: 'Sunil Kadam',
      parentPhone: '9823401122',
      pin: '1234',
      status: 'Active',
    },
    {
      rollNo: 'AB-1002',
      name: 'Isha Gaikwad',
      class: '10th',
      subjects: 'Mathematics & Science',
      phone: '9823401123',
      email: 'isha.gaikwad@example.com',
      parentName: 'Ravindra Gaikwad',
      parentPhone: '9823401123',
      pin: '1234',
      status: 'Active',
    },
    {
      rollNo: 'AB-901',
      name: 'Aditya Shinde',
      class: '9th',
      subjects: 'Mathematics & Science',
      phone: '9823301122',
      email: 'aditya.shinde@example.com',
      parentName: 'Vijay Shinde',
      parentPhone: '9823301122',
      pin: '1234',
      status: 'Active',
    },
    {
      rollNo: 'AB-801',
      name: 'Rohan Patil',
      class: '8th',
      subjects: 'Mathematics & Science',
      phone: '9823201122',
      email: 'rohan.patil@example.com',
      parentName: 'Mahesh Patil',
      parentPhone: '9823201122',
      pin: '1234',
      status: 'Active',
    },
  ];

  for (const s of students) {
    await prisma.student.create({ data: s });
  }

  // 4. Seed Clean Initial Admission Enquiries
  const admissions = [
    {
      studentName: 'Pranav Kadam',
      parentName: 'Sunil Kadam',
      phone: '9823401122',
      email: 'pranav.kadam@example.com',
      targetClass: '10th',
      subjects: 'Mathematics & Science',
      schoolName: 'Ahilyanagar Central School',
      previousPercentage: '94%',
      preferredBatch: 'Morning (8:00 AM - 10:00 AM)',
      message: 'Intensive 10th Board preparation series with previous 5 years question papers.',
      status: 'ENROLLED',
      staffNotes: 'Enrolled in 10th Board Batch. Roll No: AB-1001, PIN: 1234',
    },
    {
      studentName: 'Isha Gaikwad',
      parentName: 'Ravindra Gaikwad',
      phone: '9823401123',
      email: 'isha.gaikwad@example.com',
      targetClass: '10th',
      subjects: 'Mathematics & Science',
      schoolName: 'Symbiosis School, Rahata',
      previousPercentage: '87%',
      preferredBatch: 'Evening (6:30 PM - 8:30 PM)',
      message: 'Looking for dedicated Mathematics board coaching and test series.',
      status: 'ENROLLED',
      staffNotes: 'Enrolled in 10th Board Batch. Roll No: AB-1002, PIN: 1234',
    },
    {
      studentName: 'Aditya Shinde',
      parentName: 'Vijay Shinde',
      phone: '9823301122',
      email: 'aditya.shinde@example.com',
      targetClass: '9th',
      subjects: 'Mathematics & Science',
      schoolName: 'Rahata High School',
      previousPercentage: '91%',
      preferredBatch: 'Evening (4:30 PM - 6:30 PM)',
      message: 'Targeting 95%+ in 9th and early foundation for 10th boards.',
      status: 'ENROLLED',
      staffNotes: 'Enrolled in 9th Foundation Batch. Roll No: AB-901, PIN: 1234',
    },
    {
      studentName: 'Rohan Patil',
      parentName: 'Mahesh Patil',
      phone: '9823201122',
      email: 'rohan.patil@example.com',
      targetClass: '8th',
      subjects: 'Mathematics & Science',
      schoolName: 'Ahilyanagar Public School',
      previousPercentage: '85%',
      preferredBatch: 'Evening (4:30 PM - 6:30 PM)',
      message: 'Needs special help in Algebraic expressions and Physics concepts.',
      status: 'ENROLLED',
      staffNotes: 'Enrolled in 8th Starters Batch. Roll No: AB-801, PIN: 1234',
    },
  ];

  for (const adm of admissions) {
    await prisma.admissionEnquiry.create({ data: adm });
  }

  // -------------------------------------------------------------
  // TEST 1: CLASS 10TH MATHEMATICS (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test10Math1 = await prisma.test.create({
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

  // -------------------------------------------------------------
  // TEST 2: CLASS 10TH SCIENCE (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test10Sci1 = await prisma.test.create({
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

  // -------------------------------------------------------------
  // TEST 3: CLASS 9TH MATHEMATICS (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test9Math = await prisma.test.create({
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
            explanation: 'Sum of angles in a linear pair is 180°. 2x + 3x = 180° -> 5x = 180° -> x = 36°. Larger angle = 3 * 36° = 108°.',
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

  // -------------------------------------------------------------
  // TEST 4: CLASS 9TH SCIENCE (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test9Sci = await prisma.test.create({
    data: {
      title: 'Class 9 - Science: Motion, Force, Gravitation & Atomic Structure',
      subject: 'Science',
      class: '9th',
      durationMinutes: 20,
      totalMarks: 12,
      passingMarks: 5,
      difficulty: 'Medium',
      description: 'Newton’s Laws of motion, acceleration, universal gravitational constant, atomic models, and cell organelles.',
      questions: {
        create: [
          {
            questionText: 'A car accelerates uniformly from 18 km/h to 72 km/h in 5 seconds. The acceleration is:',
            optionA: '3.0 m/s²',
            optionB: '5.4 m/s²',
            optionC: '2.5 m/s²',
            optionD: '10.8 m/s²',
            correctOption: 'A',
            explanation: 'u = 5 m/s. v = 20 m/s. Acceleration a = (20 - 5)/5 = 15/5 = 3.0 m/s².',
            marks: 2,
            order: 1,
          },
          {
            questionText: 'If the distance between two objects is tripled, the gravitational force between them becomes:',
            optionA: '1/9 times original',
            optionB: '1/3 times original',
            optionC: '3 times original',
            optionD: '9 times original',
            correctOption: 'A',
            explanation: 'By Newton’s Law of Universal Gravitation, F ∝ 1/r². When r becomes 3r, F\' ∝ 1/(3r)² = 1/(9r²) = F/9.',
            marks: 2,
            order: 2,
          },
          {
            questionText: 'The inertia of an object tends to cause the object to:',
            optionA: 'Resist any change in its state of motion',
            optionB: 'Increase its speed',
            optionC: 'Decrease its momentum',
            optionD: 'Accelerate continuously',
            correctOption: 'A',
            explanation: 'Inertia is the inherent property of a body to resist any change in its state of rest or uniform motion.',
            marks: 2,
            order: 3,
          },
          {
            questionText: 'What is the mass of 0.5 moles of Water (H₂O)? (Atomic masses: H=1, O=16)',
            optionA: '9 grams',
            optionB: '18 grams',
            optionC: '36 grams',
            optionD: '4.5 grams',
            correctOption: 'A',
            explanation: 'Molar mass of H₂O = 18 g/mol. Mass = 0.5 mol * 18 g/mol = 9 grams.',
            marks: 2,
            order: 4,
          },
          {
            questionText: 'Which organelle is known as the "suicide bags" of the cell?',
            optionA: 'Lysosomes',
            optionB: 'Ribosomes',
            optionC: 'Golgi bodies',
            optionD: 'Plastids',
            correctOption: 'A',
            explanation: 'Lysosomes contain powerful digestive enzymes that digest their own cell if damaged.',
            marks: 2,
            order: 5,
          },
          {
            questionText: 'What is the work done in lifting a 10 kg object to a height of 2 meters? (g = 9.8 m/s²)',
            optionA: '196 Joules',
            optionB: '98 Joules',
            optionC: '20 Joules',
            optionD: '392 Joules',
            correctOption: 'A',
            explanation: 'Work done W = m * g * h = 10 kg * 9.8 m/s² * 2 m = 196 Joules.',
            marks: 2,
            order: 6,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------
  // TEST 5: CLASS 8TH MATHEMATICS (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test8Math = await prisma.test.create({
    data: {
      title: 'Class 8 - Mathematics: Rational Numbers, Linear Equations & Powers',
      subject: 'Mathematics',
      class: '8th',
      durationMinutes: 20,
      totalMarks: 12,
      passingMarks: 5,
      difficulty: 'Easy',
      description: 'Operations on rational numbers, single-variable equations, laws of exponents, and polygon angle calculations.',
      questions: {
        create: [
          {
            questionText: 'Solve for x: 5x - 7 = 2x + 8',
            optionA: '5',
            optionB: '3',
            optionC: '-5',
            optionD: '15',
            correctOption: 'A',
            explanation: 'Transposing variables: 5x - 2x = 8 + 7 -> 3x = 15 -> x = 15/3 = 5.',
            marks: 2,
            order: 1,
          },
          {
            questionText: 'What is the multiplicative inverse (reciprocal) of -5/8 × -3/7?',
            optionA: '56/15',
            optionB: '-56/15',
            optionC: '15/56',
            optionD: '-15/56',
            correctOption: 'A',
            explanation: '(-5/8) × (-3/7) = +15/56. The multiplicative inverse of 15/56 is 56/15.',
            marks: 2,
            order: 2,
          },
          {
            questionText: 'The sum of all interior angles of a regular pentagon (5 sides) is:',
            optionA: '540°',
            optionB: '360°',
            optionC: '720°',
            optionD: '180°',
            correctOption: 'A',
            explanation: 'Sum = (n - 2) * 180°. For a pentagon (n=5): (5 - 2) * 180° = 3 * 180° = 540°.',
            marks: 2,
            order: 3,
          },
          {
            questionText: 'Simplify: (3⁻¹ + 4⁻¹)⁻¹ ÷ 5⁻¹',
            optionA: '35/12',
            optionB: '12/35',
            optionC: '7/12',
            optionD: '5/7',
            correctOption: 'A',
            explanation: '3⁻¹ + 4⁻¹ = 1/3 + 1/4 = 7/12. Reciprocal is 12/7. Then (12/7) ÷ (1/5) = 60/7 or directly 35/12.',
            marks: 2,
            order: 4,
          },
          {
            questionText: 'The perimeter of a rectangle is 40 cm. If its length is 12 cm, its area is:',
            optionA: '96 cm²',
            optionB: '80 cm²',
            optionC: '120 cm²',
            optionD: '48 cm²',
            correctOption: 'A',
            explanation: 'Perimeter = 2(l + b) -> 40 = 2(12 + b) -> 20 = 12 + b -> b = 8 cm. Area = 12 * 8 = 96 cm².',
            marks: 2,
            order: 5,
          },
          {
            questionText: 'Find the square root of 5184 by prime factorization:',
            optionA: '72',
            optionB: '68',
            optionC: '78',
            optionD: '82',
            correctOption: 'A',
            explanation: '72² = 5184. √5184 = 72.',
            marks: 2,
            order: 6,
          },
        ],
      },
    },
  });

  // -------------------------------------------------------------
  // TEST 6: CLASS 8TH SCIENCE (6 Qs • 2 Marks Each • 12 Marks)
  // -------------------------------------------------------------
  const test8Sci = await prisma.test.create({
    data: {
      title: 'Class 8 - Science: Force, Pressure, Sound, Cells & Microorganisms',
      subject: 'Science',
      class: '8th',
      durationMinutes: 20,
      totalMarks: 12,
      passingMarks: 5,
      difficulty: 'Easy',
      description: 'Understanding types of forces, atmospheric pressure, plant vs animal cells, bacteria, and sound vibration amplitude.',
      questions: {
        create: [
          {
            questionText: 'A force of 100 N is applied over an area of 2 m². The pressure exerted is:',
            optionA: '50 Pascals (N/m²)',
            optionB: '200 Pascals',
            optionC: '25 Pascals',
            optionD: '100 Pascals',
            correctOption: 'A',
            explanation: 'Pressure P = Force / Area = 100 N / 2 m² = 50 N/m² = 50 Pa.',
            marks: 2,
            order: 1,
          },
          {
            questionText: 'Which microorganism converts sugar into alcohol during fermentation?',
            optionA: 'Yeast',
            optionB: 'Lactobacillus',
            optionC: 'Amoeba',
            optionD: 'Plasmodium',
            correctOption: 'A',
            explanation: 'Yeast carries out anaerobic fermentation, breaking down glucose into ethanol alcohol and carbon dioxide gas.',
            marks: 2,
            order: 2,
          },
          {
            questionText: 'The pitch of a sound is determined by its:',
            optionA: 'Frequency',
            optionB: 'Amplitude',
            optionC: 'Loudness',
            optionD: 'Speed',
            correctOption: 'A',
            explanation: 'Frequency of vibration determines the pitch (shrilness) of sound. Higher frequency results in higher pitch.',
            marks: 2,
            order: 3,
          },
          {
            questionText: 'Which organelle is the controlling center of all cellular metabolic activities?',
            optionA: 'Nucleus',
            optionB: 'Mitochondria',
            optionC: 'Vacuole',
            optionD: 'Endoplasmic Reticulum',
            correctOption: 'A',
            explanation: 'The nucleus contains genetic material (DNA/chromosomes) and directs vital cellular operations.',
            marks: 2,
            order: 4,
          },
          {
            questionText: 'Which of the following is a non-contact force?',
            optionA: 'Gravitational Force',
            optionB: 'Friction',
            optionC: 'Muscular Force',
            optionD: 'Tension in a rope',
            correctOption: 'A',
            explanation: 'Gravitational force acts across distances without physical contact between objects.',
            marks: 2,
            order: 5,
          },
          {
            questionText: 'Ball bearings are used in rotating bicycle wheels and fan motors to:',
            optionA: 'Convert sliding friction into rolling friction (reduce friction)',
            optionB: 'Increase grip on the axle',
            optionC: 'Increase contact area',
            optionD: 'Prevent electric conductivity',
            correctOption: 'A',
            explanation: 'Rolling friction is substantially smaller than sliding friction; ball bearings reduce resistance.',
            marks: 2,
            order: 6,
          },
        ],
      },
    },
  });

  // 6. Seed Clean Initial Test Submissions for Analytics
  const sampleSubmissions = [
    {
      studentName: 'Pranav Kadam',
      studentRollNo: 'AB-1001',
      studentClass: '10th',
      testId: test10Math1.id,
      score: 12,
      totalMarks: 12,
      percentage: 100.0,
      timeTakenSeconds: 820,
      answersJson: JSON.stringify({ '1': 'A', '2': 'A', '3': 'A', '4': 'A', '5': 'A', '6': 'A' }),
      isPassed: true,
    },
    {
      studentName: 'Isha Gaikwad',
      studentRollNo: 'AB-1002',
      studentClass: '10th',
      testId: test10Sci1.id,
      score: 10,
      totalMarks: 12,
      percentage: 83.3,
      timeTakenSeconds: 940,
      answersJson: JSON.stringify({ '1': 'A', '2': 'A', '3': 'A', '4': 'A', '5': 'A', '6': 'B' }),
      isPassed: true,
    },
    {
      studentName: 'Aditya Shinde',
      studentRollNo: 'AB-901',
      studentClass: '9th',
      testId: test9Math.id,
      score: 12,
      totalMarks: 12,
      percentage: 100.0,
      timeTakenSeconds: 780,
      answersJson: JSON.stringify({ '1': 'A', '2': 'A', '3': 'A', '4': 'A', '5': 'A', '6': 'A' }),
      isPassed: true,
    },
    {
      studentName: 'Rohan Patil',
      studentRollNo: 'AB-801',
      studentClass: '8th',
      testId: test8Math.id,
      score: 10,
      totalMarks: 12,
      percentage: 83.3,
      timeTakenSeconds: 620,
      answersJson: JSON.stringify({ '1': 'A', '2': 'A', '3': 'A', '4': 'A', '5': 'A', '6': 'B' }),
      isPassed: true,
    },
  ];

  for (const sub of sampleSubmissions) {
    await prisma.testSubmission.create({ data: sub });
  }

  console.log('Standardized 6-question (2 marks each, total 12 marks) database reset complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
