'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  ArrowRight,
  Calculator,
  Atom,
  Calendar,
  Layers,
  Check
} from 'lucide-react';

export default function CoursesPage() {
  const [activeGrade, setActiveGrade] = useState<'10th' | '9th' | '8th'>('10th');

  const coursesData = {
    '10th': {
      title: 'Class 10th Board Booster Program',
      subtitle: 'Comprehensive Mathematics & Science Preparation for SSC State Board & CBSE',
      badge: 'Board Intensive Exam Prep',
      description:
        'Engineered for maximum scoring in Board examinations through complete textbook question coverage, diagram practice, numerical solving, past 5 years question papers, and rigorous weekly mock tests.',
      highlights: [
        'Complete coverage of Science Part 1 & Part 2 with all diagram labeling',
        'In-depth Mathematics 1 (Algebra) & Mathematics 2 (Geometry) proofs and theorems',
        'Previous 5 Years Board Question Paper solving and model answer sheets',
        'Weekly Sunday Full Portion Mock Test Series with answer paper discussions',
        'Special formulas memorization and rapid shortcut calculation methods',
      ],
      mathChapters: [
        'Linear Equations in Two Variables',
        'Quadratic Equations',
        'Arithmetic Progression (A.P.)',
        'Financial Planning & Statistics',
        'Probability',
        'Similarity & Pythagoras Theorem',
        'Circle, Geometric Constructions & Trigonometry',
        'Coordinate Geometry & Mensuration',
      ],
      scienceChapters: [
        'Gravitation & Periodic Classification of Elements',
        'Chemical Reactions & Equations',
        'Effects of Electric Current & Heat',
        'Refraction of Light & Lenses',
        'Metallurgy & Carbon Compounds',
        'Space Missions',
        'Heredity, Evolution & Life Processes',
        'Environmental Management & Biotechnology',
      ],
      batchTimings: ['Morning: 8:00 AM - 10:00 AM', 'Evening: 6:30 PM - 8:30 PM'],
    },
    '9th': {
      title: 'Class 9th Foundation Pro Program',
      subtitle: 'Conceptual Mastery & Early Foundation for 10th Board Exams',
      badge: 'Core Foundation Builder',
      description:
        'Transforms complex physics laws, chemistry reactions, and Euclidean geometry into intuitive concepts, setting up a solid platform for outstanding performance in Class 10th Boards and competitive exams.',
      highlights: [
        'Concept clarity in Physics formulas and numerical derivations',
        'Organic & Inorganic Chemistry molecular structures & balancing equations',
        'Geometry theorems step-by-step proofs and construction techniques',
        'Chapter-wise weekly diagnostic assessment tests',
        'Individual doubt-solving sessions with Prof. Akshay Bora',
      ],
      mathChapters: [
        'Sets & Real Numbers',
        'Polynomials & Ratio-Proportion',
        'Linear Equations in Two Variables',
        'Financial Planning & Statistics',
        'Lines, Angles & Triangles',
        'Constructions & Quadrilaterals',
        'Circle & Coordinate Geometry',
        'Surface Area & Volume',
      ],
      scienceChapters: [
        'Laws of Motion, Work & Energy',
        'Current Electricity',
        'Measurement of Matter & Acids, Bases, Salts',
        'Carbon: An Important Element',
        'Substances in Daily Use',
        'Information Communication Technology (ICT)',
        'Reflection of Light & Sound Studies',
        'Life Processes in Living Organisms',
      ],
      batchTimings: ['Evening: 4:30 PM - 6:30 PM', 'Evening: 6:30 PM - 8:30 PM'],
    },
    '8th': {
      title: 'Class 8th Foundation Starters Program',
      subtitle: 'Strong Conceptual Foundation & Analytical Thinking Development',
      badge: 'Junior High School Starters',
      description:
        'Designed to transition middle school students into higher-order thinking, mastering arithmetic logic, basic algebra, science experimental concepts, and building academic self-confidence.',
      highlights: [
        'Strong fundamentals in Rational Numbers, Indices & Algebraic Identities',
        'Physics & Chemistry experimental principles with real-life demonstrations',
        'Regular homework tracking and weekly performance reports to parents',
        'Olympiad & Scholarship exam logical aptitude building',
        'Small batches ensuring every student speaks up and clears doubts',
      ],
      mathChapters: [
        'Rational & Irrational Numbers',
        'Parallel Lines & Transversals',
        'Indices & Cube Root',
        'Altitudes & Medians of a Triangle',
        'Expansion Formulae & Factorisation',
        'Variation & Proportion',
        'Quadrilaterals & Circle Area',
        'Equations in One Variable',
      ],
      scienceChapters: [
        'Living World & Classification of Microbes',
        'Health & Diseases',
        'Force and Pressure',
        'Current Electricity and Magnetism',
        'Inside the Atom',
        'Composition of Matter',
        'Metals & Non-metals',
        'Pollution & Cell Structure',
      ],
      batchTimings: ['Evening: 4:30 PM - 6:30 PM'],
    },
  };

  const currentCourse = coursesData[activeGrade];

  return (
    <div className="min-h-screen bg-slate-50 py-12 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Academic Curriculum 2026-27 (Classes 8th to 10th)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Science & Mathematics Programs
          </h1>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            Building strong foundation for student success. Specialized syllabus, chapter modules, and batch schedules led by Prof. Akshay Bora at Rajuri.
          </p>
        </div>

        {/* Grade Selection Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-md inline-flex gap-2">
            {[
              { id: '10th', label: 'Class 10th (Board Booster)' },
              { id: '9th', label: 'Class 9th (Foundation Pro)' },
              { id: '8th', label: 'Class 8th (Concepts Starter)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGrade(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeGrade === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Course Overview Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                {currentCourse.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3">
                {currentCourse.title}
              </h2>
              <p className="text-slate-600 text-sm mt-1">{currentCourse.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admission?class=${activeGrade}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                Enroll in Class {activeGrade}
              </Link>
              <Link
                href={`/student/tests?class=${activeGrade}`}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition"
              >
                Try Free Mock Test
              </Link>
            </div>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {currentCourse.description}
          </p>

          {/* Program Highlights */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Program Highlights & Inclusions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentCourse.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Breakdown Columns: Mathematics & Science */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            
            {/* Mathematics Syllabus */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Mathematics Syllabus</h3>
                  <p className="text-xs text-slate-500">Algebra, Geometry & Arithmetic</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentCourse.mathChapters.map((chap, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{chap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Science Syllabus */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Atom className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Science Syllabus</h3>
                  <p className="text-xs text-slate-500">Physics, Chemistry & Biology</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentCourse.scienceChapters.map((chap, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{chap}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Batch Timings Strip */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900">Available Batch Slots:</span>
              <span>{currentCourse.batchTimings.join(' • ')}</span>
            </div>

            <Link
              href="/admission"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Check Seat Availability for Class {activeGrade} &rarr;</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
