'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare,
  BarChart3,
  UserCheck,
  Sparkles,
  Phone,
  Trash2,
  ShieldAlert,
  Database,
  Lock,
  X,
  RefreshCw
} from 'lucide-react';
import { formatDateTime, getClassBadgeColor, getStatusBadgeColor } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Database Flush Modal State
  const [showFlushModal, setShowFlushModal] = useState(false);
  const [flushPassword, setFlushPassword] = useState('');
  const [flushConfirmText, setFlushConfirmText] = useState('');
  const [flushStudents, setFlushStudents] = useState(true);
  const [flushAdmissions, setFlushAdmissions] = useState(true);
  const [flushSubmissions, setFlushSubmissions] = useState(true);
  const [flushMessages, setFlushMessages] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [flushError, setFlushError] = useState('');
  const [flushSuccess, setFlushSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteFlush = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlushing(true);
    setFlushError('');
    setFlushSuccess(null);

    try {
      const res = await fetch('/api/admin/flush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: flushPassword,
          confirmationText: flushConfirmText.trim(),
          flushStudents,
          flushAdmissions,
          flushSubmissions,
          flushMessages,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFlushSuccess('Student data successfully flushed! Test questions and admin accounts remain 100% intact.');
        setFlushPassword('');
        setFlushConfirmText('');
        fetchStats();
        setTimeout(() => {
          setShowFlushModal(false);
          setFlushSuccess(null);
        }, 2500);
      } else {
        setFlushError(data.error || 'Failed to execute flush.');
      }
    } catch (err) {
      setFlushError('Network error executing database flush.');
    } finally {
      setFlushing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono">Loading Real-Time Analytics...</p>
        </div>
      </div>
    );
  }

  const admissionsByClass = stats?.admissionsByClass || { '8th': 0, '9th': 0, '10th': 0 };
  const maxAdmissionCount = Math.max(...Object.values(admissionsByClass).map(v => Number(v) || 0), 1);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Academic & Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry of admissions, enrolled batches (8th-10th), test evaluations, and incoming parent inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowFlushModal(true)}
            className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-900/60 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Wipe test data and student records while preserving test bank"
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            <span>Flush Student DB</span>
          </button>

          <Link
            href="/admin/top-results"
            className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Fame</span>
          </Link>

          <Link
            href="/admin/admissions"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Admissions</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        {/* Total Admissions */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Enquiries</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-white mt-2 sm:mt-3">
            {stats?.totalAdmissions || 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 mt-1.5 sm:mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 shrink-0" /> Classes 8th-10th
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Students</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-white mt-2 sm:mt-3">
            {stats?.totalStudents || 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 sm:mt-2">
            Active Roster
          </div>
        </div>

        {/* Total Test Bank */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">CBT Tests</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-white mt-2 sm:mt-3">
            {stats?.totalTests || 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-amber-400 mt-1.5 sm:mt-2">
            Question Banks
          </div>
        </div>

        {/* Test Submissions */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Evaluations</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-white mt-2 sm:mt-3">
            {stats?.totalSubmissions || 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-purple-400 mt-1.5 sm:mt-2">
            Auto-Graded
          </div>
        </div>

      </div>

      {/* Class-Wise Admission Distribution Visualization */}
      <div className="bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Class-Wise Admission Applications</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Distribution of student registrations by standard</p>
          </div>
          <Link
            href="/admin/admissions"
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 shrink-0"
          >
            View Leads &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { key: '10th', label: '10th' },
            { key: '9th', label: '9th' },
            { key: '8th', label: '8th' }
          ].map(({ key, label }) => {
            const count = (admissionsByClass as any)[key] || 0;
            const percentage = Math.round((count / maxAdmissionCount) * 100);

            return (
              <div key={key} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${getClassBadgeColor(key, true)}`}>
                    {label}
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">{count} Applicants</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, count > 0 ? 15 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Grid: Latest Admissions & Recent Test Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Latest Admission Inquiries */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Latest Admission Inquiries</span>
              </h3>
              <Link href="/admin/admissions" className="text-xs text-blue-400 hover:text-blue-300 font-bold shrink-0">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentAdmissions || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No admission enquiries recorded yet.
                </div>
              ) : (
                (stats?.recentAdmissions || []).slice(0, 4).map((adm: any) => (
                  <div
                    key={adm.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs sm:text-sm truncate">
                        {adm.studentName}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5 truncate flex items-center gap-1.5">
                        <span>Parent: {adm.parentName}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-300">{adm.phone}</span>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${getClassBadgeColor(adm.targetClass, true)}`}>
                        {adm.targetClass}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap ${getStatusBadgeColor(adm.status, true)}`}>
                        {adm.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/admissions"
              className="text-xs text-slate-400 hover:text-white font-bold transition flex items-center justify-center gap-1"
            >
              <span>Open Class-Wise Admissions Manager</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Online CBT Submissions */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Recent Online CBT Submissions</span>
              </h3>
              <Link href="/admin/results" className="text-xs text-blue-400 hover:text-blue-300 font-bold shrink-0">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentSubmissions || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No online exam submissions recorded yet.
                </div>
              ) : (
                (stats?.recentSubmissions || []).slice(0, 4).map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs sm:text-sm truncate">
                        {sub.studentName}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                        {sub.test?.title || `${sub.studentClass} Practice Assessment`}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <div className={`font-mono font-black text-xs sm:text-sm whitespace-nowrap ${sub.isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sub.score}/{sub.totalMarks} <span className="text-[10px]">({sub.percentage}%)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap ${getClassBadgeColor(sub.studentClass, true)}`}>
                        {sub.studentClass}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/results"
              className="text-xs text-slate-400 hover:text-white font-bold transition flex items-center justify-center gap-1"
            >
              <span>Open Test Results Ledger & Answer Sheets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECURE STUDENT-ONLY DATABASE FLUSH MODAL                                  */}
      {/* ========================================================================= */}
      {showFlushModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-900/60 text-slate-100 animate-in zoom-in-95 space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-black text-base sm:text-lg text-white">Student Data Flush Engine</h3>
              </div>
              <button
                onClick={() => {
                  setShowFlushModal(false);
                  setFlushError('');
                  setFlushSuccess(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 leading-relaxed space-y-1.5">
              <div className="font-bold flex items-center gap-1 text-rose-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Risk to Questions & Tests</span>
              </div>
              <p>
                This utility will <strong>ONLY wipe student-generated records</strong> (students, admissions, test scorecards). 
                Your <strong>Test & Question Banks, Hall of Fame, and Admin credentials stay 100% preserved.</strong>
              </p>
            </div>

            {flushError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{flushError}</span>
              </div>
            )}

            {flushSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{flushSuccess}</span>
              </div>
            )}

            <form onSubmit={handleExecuteFlush} className="space-y-4 text-xs">
              
              {/* Selectable Tables to Purge */}
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Data Entities to Reset:
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={flushStudents}
                    onChange={(e) => setFlushStudents(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Student Roster & Login PINs ({stats?.totalStudents || 0} Records)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={flushAdmissions}
                    onChange={(e) => setFlushAdmissions(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Online Admission Applications ({stats?.totalAdmissions || 0} Leads)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={flushSubmissions}
                    onChange={(e) => setFlushSubmissions(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Online CBT Test Scorecards ({stats?.totalSubmissions || 0} Submissions)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={flushMessages}
                    onChange={(e) => setFlushMessages(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Website Contact Inquiries (Optional)</span>
                </label>
              </div>

              {/* Safety Confirmation Inputs */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Type <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">FLUSH</strong> to confirm: *
                </label>
                <input
                  type="text"
                  required
                  value={flushConfirmText}
                  onChange={(e) => setFlushConfirmText(e.target.value)}
                  placeholder="FLUSH"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Admin Password: *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={flushPassword}
                    onChange={(e) => setFlushPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFlushModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={flushing || flushConfirmText !== 'FLUSH' || !flushPassword}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  {flushing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Flushing Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Execute Student Flush</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
