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
  Phone
} from 'lucide-react';
import { formatDateTime, getClassBadgeColor, getStatusBadgeColor } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <Link
            href="/admin/admissions"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Admissions</span>
          </Link>

          <Link
            href="/admin/results"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Test Results</span>
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

    </div>
  );
}
