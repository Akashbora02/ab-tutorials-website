'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Send, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  Laptop,
  Lock,
  LogIn,
  Sparkles
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

export default function InteractiveTestPage() {
  const params = useParams();
  const testId = params.id as string;
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [flagged, setFlagged] = useState<{ [qId: string]: boolean }>({});
  
  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Student Identity & Auth State
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [authRequired, setAuthRequired] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Validate logged in student session
    const stored = localStorage.getItem('ab_student_user');
    if (!stored) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudentInfo(parsed);
    } catch (e) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    fetchTest();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tests/${testId}`);
      const data = await res.json();
      if (data.success) {
        setTest(data.data);
        const totalSec = (data.data.durationMinutes || 20) * 60;
        setSecondsRemaining(totalSec);
        startTimer(totalSec);
      }
    } catch (err) {
      console.error('Failed to load test:', err);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialSec: number) => {
    let timeLeft = initialSec;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setSecondsRemaining(timeLeft);

      if (timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleAutoSubmit();
      }
    }, 1000);
  };

  const handleSelectOption = (option: string) => {
    const q = test.questions[currentIdx];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: option,
    }));
  };

  const handleClearResponse = () => {
    const q = test.questions[currentIdx];
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[q.id];
      return updated;
    });
  };

  const handleToggleFlag = () => {
    const q = test.questions[currentIdx];
    setFlagged((prev) => ({
      ...prev,
      [q.id]: !prev[q.id],
    }));
  };

  const handleAutoSubmit = () => {
    submitTest();
  };

  const submitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = (test?.durationMinutes || 20) * 60 - secondsRemaining;

    try {
      const res = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentInfo?.name || 'Student',
          studentRollNo: studentInfo?.rollNo || 'AB-Student',
          studentClass: studentInfo?.class || test?.class || '10th',
          answers,
          timeTakenSeconds: timeSpent > 0 ? timeSpent : 1,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem(`scorecard_${data.data.submissionId}`, JSON.stringify(data.data));
        router.push(`/student/results/${data.data.submissionId}`);
      } else {
        alert(data.error || 'Failed to submit test');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting test.');
      setIsSubmitting(false);
    }
  };

  // Auth gate if user is not logged in
  if (authRequired) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border-2 border-blue-500 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Student Login Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only registered students of <strong>AB Tutorials</strong> have permission to take this Computer-Based Examination.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/student/login"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Mobile / Roll No &rarr;</span>
            </Link>

            <Link
              href="/admission"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Apply Online & Get Instant Roll No</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-sm font-semibold tracking-wide">Loading Test Interface...</p>
        </div>
      </div>
    );
  }

  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900">Test Not Found</h3>
          <p className="text-xs text-slate-500 mt-2">
            The requested test is not published or contains no questions.
          </p>
          <Link
            href="/student/tests"
            className="mt-6 inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Back to Test Catalog
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = test.questions[currentIdx];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const selectedOption = answers[currentQ.id];

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimerLow = secondsRemaining < 180; // 3 mins remaining

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Fixed CBT Header Bar */}
      <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Test Title & Student Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getClassBadgeColor(test.class)}`}>
                Class {test.class}
              </span>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                {test.subject} Assessment (6 Questions • 2 Marks Each)
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-md sm:max-w-xl">
              {test.title}
            </h1>
            <div className="text-[11px] text-slate-400">
              Candidate: <span className="text-slate-200 font-bold">{studentInfo?.name}</span> ({studentInfo?.rollNo})
            </div>
          </div>

          {/* Timer & Submit CTA */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-black text-base sm:text-lg border ${
              isTimerLow
                ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-slate-900 text-amber-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formattedTime}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main CBT Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Question & Options (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between min-h-[500px]">
          <div>
            
            {/* Question Header & Action Row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {currentIdx + 1}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  Marks: <strong className="text-slate-800">+{currentQ.marks || 2}</strong>
                </span>
                <button
                  onClick={handleToggleFlag}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                    flagged[currentQ.id]
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {flagged[currentQ.id] ? 'Flagged' : 'Flag for Review'}
                  </span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.questionText}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3.5">
              {[
                { label: 'A', text: currentQ.optionA },
                { label: 'B', text: currentQ.optionB },
                { label: 'C', text: currentQ.optionC },
                { label: 'D', text: currentQ.optionD },
              ].map((opt) => {
                const isSelected = selectedOption === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}>
                      {opt.label}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="mt-10 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleClearResponse}
              disabled={!selectedOption}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition border border-slate-200 disabled:opacity-40"
            >
              Clear Response
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIdx === totalQuestions - 1}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 disabled:opacity-40 shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
            <h3 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-100 pb-3">
              Question Palette (6 Questions)
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
                <span className="text-slate-600">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                <span className="text-slate-600">Flagged ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-200"></span>
                <span className="text-slate-600">Unanswered ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            {/* Question Numbers Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {test.questions.map((q: any, idx: number) => {
                const isAnswered = Boolean(answers[q.id]);
                const isFlagged = Boolean(flagged[q.id]);
                const isCurrent = currentIdx === idx;

                let colorClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isAnswered) {
                  colorClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                }
                if (isFlagged) {
                  colorClass = 'bg-amber-500 text-white border-amber-500 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-semibold transition border flex items-center justify-center relative cursor-pointer ${colorClass} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finish & Submit Exam</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold">
              <Laptop className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Ready to Submit Test?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              You will instantly receive your scorecard with detailed step-by-step explanations.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-left text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Answered</span>
                <span className="text-base font-black text-emerald-600">{answeredCount} of {totalQuestions}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Remaining</span>
                <span className="text-base font-black text-rose-600">{totalQuestions - answeredCount} Questions</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={submitTest}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Grading...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
