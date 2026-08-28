'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  Phone, 
  MessageSquare,
  HelpCircle,
  PlayCircle,
  FileCheck,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [topResults, setTopResults] = useState<any[]>([
    { id: '1', studentName: 'Rahul', class: '10th', percentage: '95%', score: 'Improved from 60% to 95%', rank: 'Class 10th Board Topper' },
    { id: '2', studentName: 'Sneha', class: '10th', percentage: '92%', score: 'Concepts became very easy', rank: 'Board Distinction' },
    { id: '3', studentName: 'Amit', class: '10th', percentage: '90%', score: 'Weekly tests helped a lot', rank: 'Top Scorer in Science' },
  ]);

  React.useEffect(() => {
    fetch('/api/top-results?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setTopResults(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Quick concept questions
  const sampleQuestions = [
    {
      grade: 'Class 10th - Mathematics',
      question: 'What are the roots of the quadratic equation 2x² - 7x + 3 = 0?',
      options: ['3 and 1/2', '-3 and -1/2', '2 and 3', '1/3 and 2'],
      correct: 0,
      explanation: '2x² - 6x - x + 3 = 0 -> (2x - 1)(x - 3) = 0 -> x = 3, 1/2',
    },
    {
      grade: 'Class 10th - Science',
      question: 'When light enters glass from air (n = 1.5), its speed in glass becomes:',
      options: ['2.0 × 10⁸ m/s', '3.0 × 10⁸ m/s', '2.25 × 10⁸ m/s', '1.5 × 10⁸ m/s'],
      correct: 0,
      explanation: 'v = c/n = (3 × 10⁸) / 1.5 = 2.0 × 10⁸ m/s',
    },
    {
      grade: 'Class 9th - Science',
      question: 'If the distance between two masses is doubled, gravitational force becomes:',
      options: ['One-fourth (1/4)', 'Half (1/2)', 'Double (2x)', 'Four times (4x)'],
      correct: 0,
      explanation: 'F ∝ 1/r². When r is doubled, force becomes F/4.',
    },
    {
      grade: 'Class 8th - Mathematics',
      question: 'The sum of all interior angles of a regular hexagon (6 sides) is:',
      options: ['720°', '540°', '360°', '1080°'],
      correct: 0,
      explanation: '(n - 2) * 180° = (6 - 2) * 180° = 720°',
    },
  ];

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setActiveQuizIndex((prev) => (prev + 1) % sampleQuestions.length);
  };

  return (
    <div className="space-y-16 sm:space-y-24 bg-white">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH BANNER & EDUCATOR SPOTLIGHT          */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-8 pb-16 lg:py-20">
        
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Top Coaching for 8th–10th Science & Maths</span>
              </div>

              {/* Slogan & Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Building Strong Foundation for <span className="text-blue-400">Student Success</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Score <strong className="text-amber-400 font-bold">90%+</strong> with expert teaching by <strong className="text-white">Prof. Akshay Bora</strong>, weekly chapter-wise tests, small batch sizes & personal attention at Rajuri (Near New Talathi Office), India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/admission"
                  className="px-7 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-600/30 active:scale-95 transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  <span>Enroll for 2026-27</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/student/tests"
                  className="px-7 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-95 transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Take Mock Test</span>
                </Link>
              </div>

              {/* Key Trust Signals from Old Website */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">4+ Years</div>
                  <div className="text-xs text-slate-400 mt-0.5">Proven Teaching Experience</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Concept Clarity Success</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">95%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Top Board Result (Rahul)</div>
                </div>
              </div>

            </div>

            {/* Right Column: Original Educator Photo & Banner Card */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Primary Image Card: Prof. Akshay Bora */}
              <div className="bg-slate-800/90 rounded-3xl p-3 border border-slate-700 shadow-2xl overflow-hidden group">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900">
                  <img 
                    src="/images/sir.jpg" 
                    alt="Prof. Akshay Bora - Director, AB Tutorials"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      Founder & Lead Faculty
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">Prof. Akshay Bora</h3>
                    <p className="text-xs text-slate-300">Science & Maths Expert • Rajuri (Near New Talathi Office), India</p>
                  </div>
                </div>
              </div>

              {/* Classroom Photo Thumbnail Banner */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden border border-slate-700 h-28 bg-slate-900 relative group">
                  <img 
                    src="/images/banner.jpg" 
                    alt="AB Tutorials Classroom Banner" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-2">
                    <span className="text-[11px] font-bold text-white">Classroom Hub</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-700 h-28 bg-slate-900 relative group">
                  <img 
                    src="/images/photo7.jpg" 
                    alt="Student Felicitation" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-2">
                    <span className="text-[11px] font-bold text-amber-300">Annual Toppers</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. STATS SECTION (FROM OLD WEBSITE)                       */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            
            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-blue-600">50+</div>
              <div className="text-sm font-bold text-slate-800 mt-2">Active Students</div>
              <p className="text-xs text-slate-500 mt-0.5">Classes 8th to 10th</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-emerald-600">100%</div>
              <div className="text-sm font-bold text-slate-800 mt-2">Success Rate</div>
              <p className="text-xs text-slate-500 mt-0.5">In School & Board Exams</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-amber-500">4+</div>
              <div className="text-sm font-bold text-slate-800 mt-2">Years Experience</div>
              <p className="text-xs text-slate-500 mt-0.5">Dedicated Academic Mentorship</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-indigo-600">50+</div>
              <div className="text-sm font-bold text-slate-800 mt-2">Top Results</div>
              <p className="text-xs text-slate-500 mt-0.5">Distinction & 90%+ Scorers</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. WHY CHOOSE US (FROM OLD WEBSITE)                       */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Our Core Strengths
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
            Why Choose AB Tutorials?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Concept clarity with simple explanation, structured weekly tests, and personal mentoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Teaching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Concept clarity with simple, practical explanation. Formulas and theorems explained with step-by-step logic.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Weekly Tests</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track your performance regularly with chapter-wise and full-portion mock exams on both paper and online CBT.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Personal Attention</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Small batches for better learning. Every student receives individual doubt solving and customized guidance.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. DIRECTOR SECTION (AUTHENTIC INTRO FROM OLD SITE)       */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950">
                <img 
                  src="/images/sir.jpg" 
                  alt="Prof. Akshay Bora" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <span>About Director</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Prof. Akshay Bora
              </h2>

              <p className="text-blue-300 text-sm sm:text-base font-medium italic border-l-2 border-blue-400 pl-3">
                With 4+ years of teaching experience, Prof. Akshay Bora is known for simplifying complex concepts and guiding students towards success.
              </p>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  "My name is Akshay Bora. I am a dedicated teacher with a strong passion for education. I have completed my M.Sc in Botany and B.Ed.
                </p>
                <p>
                  I am currently working as a teacher and also run coaching classes for students from 8th to 10th standard, focusing on Science and Mathematics. I believe in making learning simple, interesting, and practical for students.
                </p>
                <p>
                  I am hardworking, disciplined, and always ready to help my students achieve their goals. My aim is to guide students towards success and build a strong academic foundation for their future."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">M.Sc Botany & B.Ed</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">4+ Years Teaching Experience</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Science & Maths (8th-10th)</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Simple & Practical Learning</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="tel:+919890724002"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: +91 98907 24002</span>
                </a>

                <a
                  href="https://wa.me/919890724002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: 9890724002</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TOP BOARD RESULTS (DYNAMICALLY MANAGED THROUGH DB)     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Board Hall of Fame
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
            Our Top Results
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Consistent top percentages achieved by our students under Prof. Akshay Bora's mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topResults.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-7 rounded-3xl border-2 border-emerald-200/80 shadow-md hover:shadow-xl transition-all text-center space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Class {item.class}
                  </span>
                  {item.year && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.year}
                    </span>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mt-1">
                  <Award className="w-6 h-6" />
                </div>

                <div className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mt-3">
                  {item.percentage}
                </div>

                <h4 className="text-lg font-bold text-slate-900 mt-1">{item.studentName}</h4>
                
                {item.rank && (
                  <div className="text-xs font-bold text-amber-600">
                    {item.rank}
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-1">
                  {item.score || `Class ${item.class} Board Achiever`}
                </p>

                {item.testimonial && (
                  <p className="text-[11px] text-slate-500 italic mt-2.5 pt-2.5 border-t border-slate-100 line-clamp-2">
                    "{item.testimonial}"
                  </p>
                )}
              </div>

              {item.schoolName && (
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  {item.schoolName}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CLASSROOM PHOTO GALLERY STRIP (AUTHENTIC IMAGES)       */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Campus Tour
            </span>
            <h2 className="text-3xl font-black text-slate-950 mt-2 tracking-tight">
              Our Classroom & Test Center
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Photo Gallery ({'>'})</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100 group">
            <img 
              src="/images/photo1.jpg" 
              alt="Classroom Lecture Session" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100 group">
            <img 
              src="/images/photo2.jpg" 
              alt="Interactive Doubts Solving" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100 group">
            <img 
              src="/images/photo3.jpg" 
              alt="Classroom Study Environment" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE 1-MINUTE CONCEPT QUIZ WIDGET               */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Concept Check</span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {sampleQuestions[activeQuizIndex].grade}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {sampleQuestions[activeQuizIndex].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {sampleQuestions[activeQuizIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between ${
                    showResult
                      ? idx === sampleQuestions[activeQuizIndex].correct
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : selectedAnswer === idx
                        ? 'bg-rose-950 border-rose-500 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : 'bg-slate-950 border-slate-800 hover:border-blue-500 text-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                  {showResult && idx === sampleQuestions[activeQuizIndex].correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>

            {showResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2 animate-in fade-in">
                <div className="font-bold text-amber-300">💡 Step-by-Step Rationale:</div>
                <div className="text-slate-300">{sampleQuestions[activeQuizIndex].explanation}</div>
                <div className="pt-2 text-right">
                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                  >
                    Next Question &rarr;
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/student/tests"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-bold"
              >
                <span>Take Full Timed Online Mock Test (8th to 10th)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. BOTTOM CALL TO ACTION                                  */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-10 sm:p-14 text-center shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Score 90%+ in 8th, 9th or 10th?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Join AB Tutorials today and start your success journey. Building strong foundation for student success with Prof. Akshay Bora.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/admission"
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl shadow-lg hover:bg-slate-100 active:scale-95 transition text-base"
            >
              🚀 Apply for Admission
            </Link>

            <a
              href="https://wa.me/919890724002"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition text-base flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Talk to Prof. Akshay Bora</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
