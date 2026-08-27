'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ArrowRight, 
  BookOpen, 
  RotateCcw, 
  UserCircle2,
  Sparkles,
  Share2
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

export default function TestResultScorecardPage() {
  const params = useParams();
  const submissionId = params.id as string;
  const router = useRouter();

  const [scorecard, setScorecard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session storage has scorecard from instant submit
    const sessionData = sessionStorage.getItem(`scorecard_${submissionId}`);
    if (sessionData) {
      try {
        setScorecard(JSON.parse(sessionData));
        setLoading(false);
        return;
      } catch (e) {}
    }

    // Otherwise fetch from database
    fetchScorecard();
  }, [submissionId]);

  const fetchScorecard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/results`);
      const data = await res.json();
      if (data.success) {
        const found = data.data.find((s: any) => s.id === submissionId);
        if (found) {
          // Parse questions and answers
          let parsedAnswers: any = {};
          try {
            parsedAnswers = JSON.parse(found.answersJson);
          } catch (e) {}

          // Fetch test details for explanation
          const testRes = await fetch(`/api/tests/${found.testId}?admin=true`);
          const testData = await testRes.json();
          
          if (testData.success) {
            const questionResults = testData.data.questions.map((q: any) => {
              const selected = parsedAnswers[q.id] || null;
              const isCorrect = selected === q.correctOption;
              return {
                questionId: q.id,
                questionText: q.questionText,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                selectedOption: selected,
                correctOption: q.correctOption,
                isCorrect,
                isAnswered: Boolean(selected),
                explanation: q.explanation,
                marksAwarded: isCorrect ? q.marks : 0,
                maxMarks: q.marks,
              };
            });

            setScorecard({
              testTitle: found.test.title,
              subject: found.test.subject,
              class: found.studentClass,
              studentName: found.studentName,
              score: found.score,
              totalMarks: found.totalMarks,
              percentage: found.percentage,
              isPassed: found.isPassed,
              timeTakenSeconds: found.timeTakenSeconds,
              questionResults,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load scorecard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!scorecard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-md">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900">Scorecard Not Available</h3>
          <p className="text-xs text-slate-500 mt-2">
            Could not retrieve the requested test result scorecard.
          </p>
          <Link
            href="/student/dashboard"
            className="mt-6 inline-block px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Go to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const mins = Math.floor(scorecard.timeTakenSeconds / 60);
  const secs = scorecard.timeTakenSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scorecard Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-indigo-500/30 mb-10 relative overflow-hidden text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getClassBadgeColor(scorecard.class)}`}>
                  Class {scorecard.class}
                </span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {scorecard.subject}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {scorecard.testTitle}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Candidate: <strong className="text-white">{scorecard.studentName}</strong>
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 text-center shrink-0 min-w-[160px] shadow-inner">
              <div className="text-4xl font-black text-amber-400">
                {scorecard.score}<span className="text-lg text-slate-400">/{scorecard.totalMarks}</span>
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {scorecard.percentage}% Aggregate
              </div>
              <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                scorecard.isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {scorecard.isPassed ? 'QUALIFIED (PASS)' : 'NEEDS REVISION'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400">Time Taken</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> {timeFormatted}
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
              <div className="text-slate-400">Performance Tier</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {scorecard.percentage >= 90
                  ? '🌟 Outstanding'
                  : scorecard.percentage >= 75
                  ? '🏆 First Class'
                  : scorecard.percentage >= 50
                  ? '👍 Good'
                  : '📖 Needs Practice'}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex items-center justify-between">
              <div>
                <div className="text-slate-400">Want Mentoring?</div>
                <Link href="/admission" className="text-xs font-bold text-amber-300 hover:underline">
                  Enroll with Akshay Sir &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Solutions Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Question-by-Question Solution Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your answers against verified step-by-step solutions
            </p>
          </div>
          <Link
            href="/student/tests"
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 shadow-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Take Another Test</span>
          </Link>
        </div>

        {/* Question Solutions List */}
        <div className="space-y-6">
          {scorecard.questionResults?.map((item: any, idx: number) => {
            const isCorrect = item.isCorrect;
            const isAnswered = item.isAnswered;

            return (
              <div
                key={item.questionId || idx}
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition ${
                  isCorrect
                    ? 'border-emerald-200'
                    : isAnswered
                    ? 'border-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Question Top Row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Marks: {item.marksAwarded}/{item.maxMarks}
                    </span>
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : isAnswered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-base font-semibold text-slate-900 mb-5 leading-relaxed">
                  {item.questionText}
                </p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {[
                    { label: 'A', text: item.optionA },
                    { label: 'B', text: item.optionB },
                    { label: 'C', text: item.optionC },
                    { label: 'D', text: item.optionD },
                  ].map((opt) => {
                    const isSelected = item.selectedOption === opt.label;
                    const isRightAnswer = item.correctOption === opt.label;

                    let optClass = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isRightAnswer) {
                      optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected && !isRightAnswer) {
                      optClass = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-500';
                    }

                    return (
                      <div
                        key={opt.label}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${optClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {opt.label}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isRightAnswer && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isRightAnswer && (
                          <span className="text-[10px] uppercase font-bold text-rose-700 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-Step Pedagogical Explanation */}
                {item.explanation && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                    <strong className="text-indigo-900 block font-bold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Step-by-Step Conceptual Solution:
                    </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons at Bottom */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/student/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-md text-center"
          >
            Back to Student Dashboard
          </Link>
          <Link
            href="/admission"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md text-center inline-flex items-center justify-center gap-1.5"
          >
            <span>Enroll for Classroom Coaching</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
