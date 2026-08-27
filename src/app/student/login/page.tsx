'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCircle2, 
  Lock, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Laptop,
  CheckCircle2,
  Phone,
  ShieldCheck
} from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const [rollNoOrPhone, setRollNoOrPhone] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rollNo: rollNoOrPhone.trim(), 
          phone: rollNoOrPhone.trim(),
          pin: pin.trim() 
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ab_student_user', JSON.stringify(data.data));
        // Direct to their class-specific tests immediately!
        router.push(`/student/tests?class=${data.data.class}`);
      } else {
        setErrorMsg(data.error || 'Invalid Roll Number or PIN.');
      }
    } catch (err) {
      setErrorMsg('Login network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 flex items-center justify-center mx-auto shadow-md border border-slate-200 overflow-hidden">
            <img 
              src="/images/logo.png" 
              alt="AB Tutorials" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Student Assessment Portal</h1>
          <p className="text-xs text-slate-500">
            AB Tutorials • Building strong foundation for student success
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleStudentLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Roll Number or Registered Mobile *
            </label>
            <div className="relative">
              <UserCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={rollNoOrPhone}
                onChange={(e) => setRollNoOrPhone(e.target.value)}
                placeholder="e.g. 9890724002 or AB-1001"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Enter your mobile number or assigned roll number from admission registration.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              4-Digit Student PIN *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Student...</span>
            ) : (
              <>
                <Laptop className="w-4 h-4" />
                <span>Sign in to My Class Tests</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
          <div className="text-slate-500">Not registered as a student yet?</div>
          <Link
            href="/admission"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Online & Get Instant Exam Access &rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
