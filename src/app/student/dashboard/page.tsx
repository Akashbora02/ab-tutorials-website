'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Laptop, 
  ArrowRight,
  UserCircle2,
  LogOut,
  Sparkles
} from 'lucide-react';
import { formatDateTime, getClassBadgeColor } from '@/lib/utils';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ab_student_user');
    if (!stored) {
      router.push('/student/login');
      return;
    }
    const user = JSON.parse(stored);
    setStudent(user);
    fetchStudentData(user);
  }, []);

  const fetchStudentData = async (user: any) => {
    try {
      setLoading(true);
      // Fetch test submissions matching this student
      const [resResults, resTests] = await Promise.all([
        fetch(`/api/results?search=${encodeURIComponent(user.name)}`),
        fetch(`/api/tests?class=${user.class}`),
      ]);

      const dataResults = await resResults.json();
      const dataTests = await resTests.json();

      if (dataResults.success) {
        setRecentSubmissions(dataResults.data || []);
      }
      if (dataTests.success) {
        setAvailableTests(dataTests.data || []);
      }
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ab_student_user');
    router.push('/');
  };

  if (loading || !student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Loading Your Performance Dashboard...</p>
        </div>
      </div>
    );
  }

  const totalTests = recentSubmissions.length;
  const passedTests = recentSubmissions.filter((s) => s.isPassed).length;
  const avgScore = totalTests > 0 
    ? Math.round(recentSubmissions.reduce((acc, s) => acc + s.percentage, 0) / totalTests)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Profile Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-lg shrink-0">
              <UserCircle2 className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{student.name}</h1>
                <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full uppercase">
                  Class {student.class}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Roll Number: <strong className="font-mono text-blue-400 font-bold">{student.rollNo}</strong> • Registered Mobile: <strong className="font-mono text-emerald-400">{student.phone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/student/tests?class=${student.class}`}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              <Laptop className="w-4 h-4" />
              <span>Take Class {student.class} Test</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Tests Attempted</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalTests}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Passed Tests</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{passedTests}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Average Accuracy</div>
            <div className="text-3xl font-black text-blue-600 mt-1">{avgScore}%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Assigned Tests</div>
            <div className="text-3xl font-black text-amber-500 mt-1">{availableTests.length}</div>
          </div>
        </div>

        {/* Two Column Layout: Assigned Tests & Past Scorecards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Assigned Tests for Student's Class */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Assigned Class {student.class} Mock Tests</span>
                </h3>
                <Link href={`/student/tests?class=${student.class}`} className="text-xs text-blue-600 font-bold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {availableTests.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {t.subject} • {t.durationMinutes} Mins • {t.totalMarks} Marks
                      </div>
                    </div>

                    <Link
                      href={`/student/tests/${t.id}`}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-xs shrink-0"
                    >
                      Start Test
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Test Scorecards */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>My Past Scorecards</span>
                </h3>
              </div>

              {recentSubmissions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No tests attempted yet. Start your first practice test above!
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSubmissions.slice(0, 4).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{sub.test?.title || 'Practice Test'}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {formatDateTime(sub.submittedAt)}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-mono font-black text-sm ${sub.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.score}/{sub.totalMarks} ({sub.percentage}%)
                        </div>
                        <Link
                          href={`/student/results/${sub.id}`}
                          className="text-[11px] font-bold text-blue-600 hover:underline block mt-0.5"
                        >
                          View Solutions &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
