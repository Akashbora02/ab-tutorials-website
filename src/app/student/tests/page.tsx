'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Laptop, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Filter,
  Calculator,
  Atom,
  BookOpen,
  UserCircle2,
  LogOut,
  Lock,
  X,
  LogIn
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

function TestCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClass = searchParams.get('class');

  const [studentUser, setStudentUser] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state when unauthorized user tries to click "Start Examination"
  const [authModal, setAuthModal] = useState<{
    show: boolean;
    testTitle?: string;
    testClass?: string;
    testId?: string;
  }>({
    show: false,
  });

  // Load logged-in student user session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ab_student_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudentUser(parsed);
        // If student is logged in, restrict to THEIR class!
        if (parsed.class) {
          setSelectedClass(parsed.class);
          if (parsed.subjects === 'Mathematics Only') {
            setSelectedSubject('Mathematics');
          } else if (parsed.subjects === 'Science Only') {
            setSelectedSubject('Science');
          }
        }
      } else if (queryClass && queryClass !== 'ALL') {
        setSelectedClass(queryClass === '7th' ? '8th' : queryClass);
      }
    } catch (e) {
      console.error('Error loading student session:', e);
    }
  }, [queryClass]);

  useEffect(() => {
    fetchTests();
  }, [selectedClass, selectedSubject]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'ALL') params.append('class', selectedClass);
      if (selectedSubject !== 'ALL') params.append('subject', selectedSubject);

      const res = await fetch(`/api/tests?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTests(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ab_student_user');
    setStudentUser(null);
    setSelectedClass('ALL');
    setSelectedSubject('ALL');
    router.push('/');
  };

  const handleStartExamClick = (e: React.MouseEvent, test: any) => {
    // If not logged in, prevent taking exam!
    if (!studentUser) {
      e.preventDefault();
      setAuthModal({
        show: true,
        testTitle: test.title,
        testClass: test.class,
        testId: test.id,
      });
      return;
    }
    // If logged in, proceed to exam
    router.push(`/student/tests/${test.id}`);
  };

  return (
    <>
      {/* Auth Gate Modal (When non-logged-in user tries to take test) */}
      {authModal.show && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-blue-500 text-slate-900 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 font-black text-lg">
                <Lock className="w-5 h-5" />
                <span>Student Login Required</span>
              </div>
              <button
                onClick={() => setAuthModal({ show: false })}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs font-semibold text-blue-900">
                {authModal.testTitle} (Class {authModal.testClass})
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You must be logged in as an <strong>AB Tutorials</strong> student to access and submit online examinations.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/student/login"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Mobile / Roll No &rarr;</span>
              </Link>

              <Link
                href={`/admission?class=${authModal.testClass || '10th'}`}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Apply Online (Instant Roll No & PIN)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Logged-In Student Personalized Welcome Banner */}
      {studentUser ? (
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 mb-8 border border-blue-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
              <UserCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">Welcome, {studentUser.name}!</h2>
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                  Class {studentUser.class}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Roll No: <strong className="font-mono text-white">{studentUser.rollNo}</strong> • Showing only exams assigned to your standard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <Link
              href="/student/dashboard"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition border border-white/20"
            >
              My Scorecards
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-xs transition border border-rose-500/30 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> Online CBT Examinations are locked for enrolled AB Tutorials students. Please sign in or apply online to start tests.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/student/login"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/admission"
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-lg transition"
            >
              Apply Online
            </Link>
          </div>
        </div>
      )}

      {/* Filters Section (Only shown if open view) */}
      {!studentUser && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-10 space-y-4">
          
          {/* Class Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter by Standard:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: 'All Classes (8th-10th)' },
                { id: '10th', label: 'Class 10th' },
                { id: '9th', label: 'Class 9th' },
                { id: '8th', label: 'Class 8th' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClass(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedClass === c.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filter by Subject:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: 'All Subjects' },
                { id: 'Mathematics', label: 'Mathematics', icon: <Calculator className="w-3.5 h-3.5" /> },
                { id: 'Science', label: 'Science', icon: <Atom className="w-3.5 h-3.5" /> },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedSubject === s.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tests Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Loading Assessment Series...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Tests Found for Selected Filters</h3>
          <p className="text-xs text-slate-500">
            No active tests found matching your class and subject. Try selecting another filter or contact Prof. Akshay Bora.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getClassBadgeColor(test.class)}`}>
                    Class {test.class}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    test.subject === 'Mathematics'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {test.subject}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {test.title}
                </h3>

                <p className="text-slate-600 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                  {test.description || 'Comprehensive test covering key textbook questions, formulas, and diagrams.'}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="font-bold text-slate-800">{test._count?.questions || 6}</div>
                    <div className="text-[10px] text-slate-400">Questions</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="font-bold text-slate-800">{test.durationMinutes}m</div>
                    <div className="text-[10px] text-slate-400">Duration</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <div className="font-bold text-amber-600 font-mono">{test.totalMarks || 12} M</div>
                    <div className="text-[10px] text-slate-400">Max Marks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={(e) => handleStartExamClick(e, test)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs active:scale-98 cursor-pointer"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Start Examination</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function TestCatalogPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Computer-Based Test (CBT) Assessment Arena</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Science & Mathematics Online Tests
          </h1>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            Practice with timed chapter-wise and full-portion mock tests engineered for Classes 8th, 9th, and 10th. (6 Questions per Exam • 2 Marks Each • Total 12 Marks).
          </p>
        </div>

        <Suspense fallback={
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        }>
          <TestCatalogContent />
        </Suspense>

      </div>
    </div>
  );
}
