'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  ChevronDown,
  Trash2,
  Edit,
  Save,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { formatDateTime, getClassBadgeColor, getStatusBadgeColor } from '@/lib/utils';

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [classCounts, setClassCounts] = useState<any>({});
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Quick edit note state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  useEffect(() => {
    fetchAdmissions();
  }, [selectedClass, selectedStatus, searchTerm]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'ALL') params.append('class', selectedClass);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/admissions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAdmissions(data.data || []);
        setClassCounts(data.classCounts || {});
      }
    } catch (err) {
      console.error('Failed to load admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmissions((prev) =>
          prev.map((adm) => (adm.id === id ? { ...adm, status: newStatus } : adm))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, staffNotes: tempNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmissions((prev) =>
          prev.map((adm) => (adm.id === id ? { ...adm, staffNotes: tempNotes } : adm))
        );
        setEditingId(null);
      }
    } catch (err) {
      alert('Failed to save staff notes');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admission record?')) return;
    try {
      const res = await fetch(`/api/admissions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdmissions((prev) => prev.filter((adm) => adm.id !== id));
      }
    } catch (err) {
      alert('Failed to delete admission record');
    }
  };

  const exportToCSV = () => {
    if (admissions.length === 0) return alert('No admission data to export.');

    const headers = [
      'ID',
      'Student Name',
      'Parent Name',
      'Phone',
      'Email',
      'Target Class',
      'Subjects',
      'School',
      'Previous %',
      'Preferred Batch',
      'Status',
      'Staff Notes',
      'Date Submitted',
    ];

    const rows = admissions.map((a) => [
      a.id,
      `"${a.studentName}"`,
      `"${a.parentName}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.targetClass}"`,
      `"${a.subjects}"`,
      `"${a.schoolName || ''}"`,
      `"${a.previousPercentage || ''}"`,
      `"${a.preferredBatch || ''}"`,
      `"${a.status}"`,
      `"${a.staffNotes || ''}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ab_tutorials_admissions_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Class-Wise Admissions Management
            </h1>
            <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {admissions.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Filter student leads by standard (8th, 9th, 10th), update counseling pipeline status, and log staff notes.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Class Tab Filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: 'ALL', label: 'All Classes', count: Object.values(classCounts).reduce((a: any, b: any) => a + b, 0) },
          { id: '10th', label: 'Class 10th', count: classCounts['10th'] || 0 },
          { id: '9th', label: 'Class 9th', count: classCounts['9th'] || 0 },
          { id: '8th', label: 'Class 8th', count: classCounts['8th'] || 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedClass(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedClass === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedClass === tab.id ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Secondary Search & Status Filter Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, parent, phone, school..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-bold shrink-0">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW LEADS</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="COUNSELING">COUNSELING</option>
            <option value="ENROLLED">ENROLLED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

      </div>

      {/* Admissions Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-xs mt-3">Loading admission records...</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No admission inquiries found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Student & Parent</th>
                  <th className="py-3.5 px-4">Class & Subjects</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">School & Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Staff Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-900/40 transition">
                    
                    {/* Student & Parent */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{adm.studentName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Parent: {adm.parentName}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5">
                        {formatDateTime(adm.createdAt)}
                      </div>
                    </td>

                    {/* Class & Subjects */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getClassBadgeColor(adm.targetClass)}`}>
                        Class {adm.targetClass}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">{adm.subjects}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5">{adm.preferredBatch}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${adm.phone}`}
                          className="font-mono text-emerald-400 hover:underline font-bold"
                        >
                          {adm.phone}
                        </a>
                        <a
                          href={`https://wa.me/91${adm.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(adm.parentName)},%20this%20is%20Prof.%20Akshay%20Bora%20from%20AB%20Tutorials.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:text-emerald-400 p-1"
                          title="WhatsApp Parent"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {adm.email && (
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                          {adm.email}
                        </div>
                      )}
                    </td>

                    {/* School & Previous Score */}
                    <td className="py-4 px-4">
                      <div className="text-slate-200">{adm.schoolName || '—'}</div>
                      <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                        Prev Score: {adm.previousPercentage || 'N/A'}
                      </div>
                    </td>

                    {/* Status Updater */}
                    <td className="py-4 px-4">
                      <select
                        value={adm.status}
                        onChange={(e) => handleStatusChange(adm.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden bg-slate-900 ${getStatusBadgeColor(
                          adm.status
                        )}`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="COUNSELING">COUNSELING</option>
                        <option value="ENROLLED">ENROLLED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>

                    {/* Staff Notes */}
                    <td className="py-4 px-4 max-w-xs">
                      {editingId === adm.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-[11px] w-full"
                          />
                          <button
                            onClick={() => handleSaveNotes(adm.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-500 hover:text-slate-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingId(adm.id);
                            setTempNotes(adm.staffNotes || '');
                          }}
                          className="cursor-pointer group flex items-center justify-between text-slate-400 hover:text-slate-200"
                        >
                          <span className="truncate text-[11px]">
                            {adm.staffNotes || <span className="italic text-slate-600">Click to add note...</span>}
                          </span>
                          <Edit className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 ml-1 shrink-0" />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(adm.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
