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
  FileSpreadsheet,
  BarChart3,
  UserCheck,
  Plus
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
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic & Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry of admissions, enrolled batches (8th-10th), test evaluations, and incoming parent inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/admissions"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Admissions</span>
          </Link>

          <Link
            href="/admin/results"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Test Results</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Admissions */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-3">
            {stats?.totalAdmissions || 0}
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> Classes 8th to 10th
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Students</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-3">
            {stats?.totalStudents || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Enrolled in Batches
          </div>
        </div>

        {/* Total Test Bank */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CBT Tests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-3">
            {stats?.totalTests || 0}
          </div>
          <div className="text-[11px] text-amber-400 mt-2">
            Active Question Banks
          </div>
        </div>

        {/* Test Submissions */}
        <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tests Evaluated</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white mt-3">
            {stats?.totalSubmissions || 0}
          </div>
          <div className="text-[11px] text-purple-400 mt-2">
            Auto-Graded Scorecards
          </div>
        </div>

      </div>

      {/* Class-Wise Admission Distribution Visualization */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Class-Wise Admission Applications (8th to 10th)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of student registrations by standard</p>
          </div>
          <Link
            href="/admin/admissions"
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
          >
            View Details &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['10th', '9th', '8th'].map((cls) => {
            const count = (admissionsByClass as any)[cls] || 0;
            const percentage = Math.round((count / maxAdmissionCount) * 100);

            return (
              <div key={cls} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getClassBadgeColor(cls)}`}>
                    Class {cls}
                  </span>
                  <span className="text-base font-black text-white">{count} Applicants</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Grid: Recent Admissions & Recent Test Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Admissions */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Latest Admission Inquiries</h3>
              <Link href="/admin/admissions" className="text-xs text-blue-400 hover:underline">
                All Admissions
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentAdmissions || []).slice(0, 4).map((adm: any) => (
                <div
                  key={adm.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{adm.studentName}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Parent: {adm.parentName} • {adm.phone}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getClassBadgeColor(adm.targetClass)}`}>
                      Class {adm.targetClass}
                    </span>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeColor(adm.status)}`}>
                        {adm.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/admissions"
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Open Class-Wise Admissions Manager &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Test Submissions */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Recent Online CBT Submissions</h3>
              <Link href="/admin/results" className="text-xs text-blue-400 hover:underline">
                All Results
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentSubmissions || []).slice(0, 4).map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{sub.studentName}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 truncate max-w-xs">
                      {sub.test?.title || 'Practice Test'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-mono font-black text-sm ${sub.isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sub.score}/{sub.totalMarks} ({sub.percentage}%)
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-0.5 inline-block ${getClassBadgeColor(sub.studentClass)}`}>
                      Class {sub.studentClass}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/results"
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Open Test Results Ledger & Answer Sheets &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
