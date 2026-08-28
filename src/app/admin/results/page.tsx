'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileSpreadsheet, 
  Eye, 
  Filter, 
  X 
} from 'lucide-react';
import { formatDateTime, getClassBadgeColor } from '@/lib/utils';

export default function AdminResultsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modal inspection state
  const [inspectSubmission, setInspectSubmission] = useState<any | null>(null);

  useEffect(() => {
    fetchResults();
  }, [selectedClass, searchTerm]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'ALL') params.append('class', selectedClass);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/results?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data || []);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load test results:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return alert('No test results to export.');

    const headers = [
      'Submission ID',
      'Student Name',
      'Roll No',
      'Class',
      'Test Title',
      'Subject',
      'Score',
      'Max Marks',
      'Percentage',
      'Result Status',
      'Time Taken (Sec)',
      'Submission Date',
    ];

    const rows = submissions.map((s) => [
      s.id,
      `"${(s.studentName || '').replace(/"/g, '""')}"`,
      `"${(s.studentRollNo || 'GUEST').replace(/"/g, '""')}"`,
      `"${s.studentClass}"`,
      `"${(s.test?.title || '').replace(/"/g, '""')}"`,
      `"${(s.test?.subject || '').replace(/"/g, '""')}"`,
      s.score,
      s.totalMarks,
      `${s.percentage}%`,
      s.isPassed ? 'PASSED' : 'FAILED',
      s.timeTakenSeconds,
      `"${formatDateTime(s.submittedAt)}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ab_tutorials_test_results_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Student Test Results Ledger
            </h1>
            <span className="bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {submissions.length} Submissions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time CBT evaluation records across Classes 8th, 9th, and 10th for Mathematics & Science.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Results CSV</span>
        </button>
      </div>

      {/* Aggregate Stats Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Total Tests Taken</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{stats.totalSubmissions}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Passing Rate</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{stats.passRate}%</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Average Score</div>
            <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">{stats.avgPercentage}%</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Passed Count</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{stats.passedCount} Students</div>
          </div>
        </div>
      )}

      {/* Class Tabs & Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Class Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Standards' },
            { id: '10th', label: '10th' },
            { id: '9th', label: '9th' },
            { id: '8th', label: '8th' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedClass === c.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Results Ledger Table (Clean Fixed Widths, min-w-[780px]) */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-xs mt-3">Loading assessment results...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No test evaluations found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 min-w-[170px]">Student Details</th>
                  <th className="py-3.5 px-4 min-w-[80px]">Class</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Test Title</th>
                  <th className="py-3.5 px-4 min-w-[100px]">Score / Max</th>
                  <th className="py-3.5 px-4 min-w-[90px]">Percentage</th>
                  <th className="py-3.5 px-4 min-w-[100px]">Time Taken</th>
                  <th className="py-3.5 px-4 min-w-[90px]">Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/40 transition">
                    
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{sub.studentName}</div>
                      <div className="font-mono text-blue-400 text-[11px] mt-0.5 whitespace-nowrap">
                        Roll: {sub.studentRollNo || 'GUEST'}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5 whitespace-nowrap">
                        {formatDateTime(sub.submittedAt)}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border whitespace-nowrap ${getClassBadgeColor(sub.studentClass, true)}`}>
                        {sub.studentClass}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-white truncate max-w-[200px]">{sub.test?.title || 'Online Test'}</div>
                      <div className="text-slate-400 text-[11px] whitespace-nowrap">{sub.test?.subject}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-sm whitespace-nowrap">
                      <span className={sub.isPassed ? 'text-emerald-400' : 'text-rose-400'}>
                        {sub.score}
                      </span>
                      <span className="text-slate-500"> / {sub.totalMarks}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        sub.percentage >= 80
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : sub.percentage >= 50
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {sub.percentage}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {Math.floor(sub.timeTakenSeconds / 60)}m {sub.timeTakenSeconds % 60}s
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {sub.isPassed ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> FAILED
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectSubmission(sub)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition inline-flex items-center gap-1 text-[11px] font-bold border border-slate-800 cursor-pointer"
                        title="View detailed scorecard"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Answer Sheet Inspector Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Scorecard Details</h3>
                <p className="text-xs text-slate-400">{inspectSubmission.studentName} ({inspectSubmission.studentRollNo || 'GUEST'})</p>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Test Name</div>
                  <div className="text-white font-bold mt-0.5 truncate">{inspectSubmission.test?.title}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Score Achieved</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">
                    {inspectSubmission.score} / {inspectSubmission.totalMarks} ({inspectSubmission.percentage}%)
                  </div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Selected Student Answers (Raw Payload)</div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto max-h-48">
                  {JSON.stringify(JSON.parse(inspectSubmission.answersJson || '{}'), null, 2)}
                </pre>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setInspectSubmission(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
