'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

interface QuizQuestion {
  class: string;
  subject: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const sampleQuestions: QuizQuestion[] = [
  {
    class: 'Class 10th',
    subject: 'Science (Physics)',
    question: 'The focal length of a concave mirror having radius of curvature 30 cm is:',
    options: ['+15 cm', '-15 cm', '+30 cm', '-30 cm'],
    correct: 1,
    explanation: 'By Cartesian sign convention, the focal length of a concave mirror is negative and f = R/2 = -15 cm.',
  },
  {
    class: 'Class 10th',
    subject: 'Mathematics',
    question: 'If sin θ + cos θ = √2 cos θ, then the value of cos θ - sin θ is:',
    options: ['√2 sin θ', '√2 cos θ', '1/√2', 'sin θ'],
    correct: 0,
    explanation: 'Squaring and applying sin²θ + cos²θ = 1 yields cos θ - sin θ = √2 sin θ.',
  },
  {
    class: 'Class 9th',
    subject: 'Science (Physics)',
    question: 'If the distance between two masses is doubled, the gravitational force becomes:',
    options: ['Double', 'One-fourth (1/4)', 'Half', 'Four times'],
    correct: 1,
    explanation: 'By Newton’s Universal Law of Gravitation, F is inversely proportional to r².',
  },
  {
    class: 'Class 8th',
    subject: 'Mathematics',
    question: 'Solve for x: 3x - 5 = 2x + 7',
    options: ['x = 2', 'x = -12', 'x = 12', 'x = 6'],
    correct: 2,
    explanation: 'Subtracting 2x from both sides and adding 5: 3x - 2x = 7 + 5 => x = 12.',
  },
];

export default function QuickQuizWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = sampleQuestions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % sampleQuestions.length);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                1-Minute Concept Teaser
              </span>
              <span className="bg-indigo-600/60 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                {currentQ.class} • {currentQ.subject}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white">Test Your Academic IQ</h4>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Next Question
        </button>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
          {currentQ.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentQ.options.map((opt, idx) => {
          let btnClass = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:border-indigo-400';
          
          if (isAnswered) {
            if (idx === currentQ.correct) {
              btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
            } else if (idx === selectedOption) {
              btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500';
            } else {
              btnClass = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-3.5 rounded-xl border text-left text-sm font-medium transition flex items-center justify-between gap-2 ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQ.correct && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correct && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 animate-in fade-in duration-300">
          <strong className="text-white block mb-1">
            {selectedOption === currentQ.correct ? '🎉 Correct Answer!' : '💡 Conceptual Explanation:'}
          </strong>
          {currentQ.explanation}
        </div>
      )}

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
        <span className="text-slate-400 text-center sm:text-left">
          Want full chapter tests with timers, leaderboards & scorecards?
        </span>
        <Link
          href="/student/tests"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg transition shadow-md whitespace-nowrap"
        >
          <span>Take Full Test Series</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
