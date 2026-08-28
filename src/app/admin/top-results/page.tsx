'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Download, 
  GraduationCap, 
  Star,
  Quote,
  School
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

export default function AdminTopResultsPage() {
  const [topResults, setTopResults] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResult, setEditingResult] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    class: '10th',
    percentage: '',
    score: '',
    schoolName: 'SYCV Rajuri',
    year: '2024-25',
    subject: 'Mathematics & Science',
    rank: 'Board Distinction',
    testimonial: '',
    isFeatured: true,
  });

  useEffect(() => {
    fetchTopResults();
  }, [selectedClass]);

  const fetchTopResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'ALL') params.append('class', selectedClass);

      const res = await fetch(`/api/top-results?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTopResults(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching top results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTopper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = Boolean(editingResult);
      const res = await fetch('/api/top-results', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { id: editingResult.id, ...formData } : formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setEditingResult(null);
        fetchTopResults();
        setFormData({
          studentName: '',
          class: '10th',
          percentage: '',
          score: '',
          schoolName: 'SYCV Rajuri',
          year: '2024-25',
          subject: 'Mathematics & Science',
          rank: 'Board Distinction',
          testimonial: '',
          isFeatured: true,
        });
      } else {
        alert(data.error || 'Failed to save topper');
      }
    } catch (err) {
      alert('Network error saving topper record');
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingResult(item);
    setFormData({
      studentName: item.studentName,
      class: item.class,
      percentage: item.percentage,
      score: item.score || '',
      schoolName: item.schoolName || 'SYCV Rajuri',
      year: item.year || '2024-25',
      subject: item.subject || 'Mathematics & Science',
      rank: item.rank || 'Board Distinction',
      testimonial: item.testimonial || '',
      isFeatured: item.isFeatured !== false,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this Top Result record?')) return;
    try {
      const res = await fetch(`/api/top-results?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTopResults((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      alert('Failed to delete topper record');
    }
  };

  const exportCSV = () => {
    if (topResults.length === 0) return alert('No top results to export.');
    const headers = ['ID', 'Student Name', 'Class', 'Percentage', 'Highlight/Score', 'School', 'Year', 'Rank/Title', 'Featured'];
    const rows = topResults.map((r) => [
      r.id,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.class}"`,
      `"${r.percentage}"`,
      `"${(r.score || '').replace(/"/g, '""')}"`,
      `"${(r.schoolName || '').replace(/"/g, '""')}"`,
      `"${r.year}"`,
      `"${(r.rank || '').replace(/"/g, '""')}"`,
      r.isFeatured ? 'YES' : 'NO'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ab_tutorials_top_results_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = topResults.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(term) ||
      (r.schoolName && r.schoolName.toLowerCase().includes(term)) ||
      (r.rank && r.rank.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Top Board & School Results
            </h1>
            <span className="bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {topResults.length} Hall of Fame Achievers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage top percentage performers and distinction holders dynamically showcased on the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingResult(null);
              setFormData({
                studentName: '',
                class: '10th',
                percentage: '',
                score: '',
                schoolName: 'SYCV Rajuri',
                year: '2024-25',
                subject: 'Mathematics & Science',
                rank: 'Board Distinction',
                testimonial: '',
                isFeatured: true,
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Top Achiever</span>
          </button>
        </div>
      </div>

      {/* Class Tabs & Search Filter */}
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

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or school..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Hall of Fame Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xs mt-3">Loading Hall of Fame records...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-slate-950 p-16 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
          No top results recorded yet. Click "Add Top Achiever" to highlight student successes!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${getClassBadgeColor(item.class, true)}`}>
                    {item.class}
                  </span>
                  
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                    {item.year || '2024-25'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-emerald-400 tracking-tight">
                    {item.percentage}
                  </span>
                  {item.rank && (
                    <span className="text-xs font-bold text-amber-300">
                      {item.rank}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white mt-2">
                  {item.studentName}
                </h3>

                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <School className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{item.schoolName || 'SYCV Rajuri'}</span>
                </div>

                {item.score && (
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium mt-3">
                    💡 {item.score}
                  </div>
                )}

                {item.testimonial && (
                  <p className="text-[11px] text-slate-400 italic mt-3 line-clamp-2">
                    "{item.testimonial}"
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {item.isFeatured ? '⭐ Featured on Home' : 'Archive'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Edit Achiever"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Delete Achiever"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Achiever Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-white">
                  {editingResult ? 'Edit Top Result' : 'Add New Top Achiever'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTopper} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Standard / Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10th">10th</option>
                    <option value="9th">9th</option>
                    <option value="8th">8th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Percentage Achieved *</label>
                  <input
                    type="text"
                    required
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="e.g. 95% or 98.4%"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Academic Batch / Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024-25"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Highlight / Improvement</label>
                  <input
                    type="text"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="e.g. Improved from 60% to 95%"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Rank / Distinction Title</label>
                  <input
                    type="text"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="e.g. 1st in Rajuri / 100 in Maths"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">School / College Name</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="e.g. SYCV Rajuri"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Student Quote / Feedback</label>
                <textarea
                  rows={3}
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  placeholder="e.g. Prof. Akshay Bora's coaching made Science & Mathematics very clear and easy to score..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingResult ? 'Update Achiever' : 'Save Topper Record'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
