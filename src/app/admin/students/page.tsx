'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Trash2, 
  KeyRound, 
  X,
  CheckCircle2,
  Users
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    class: '10th',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    pin: '1234',
  });

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'ALL') params.append('class', selectedClass);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchStudents();
        setNewStudent({
          name: '',
          rollNo: '',
          class: '10th',
          phone: '',
          email: '',
          parentName: '',
          parentPhone: '',
          pin: '1234',
        });
      } else {
        alert(data.error || 'Failed to add student');
      }
    } catch (err) {
      alert('Error saving student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student record?')) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Failed to remove student');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Enrolled Student Roster
            </h1>
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {students.length} Active Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student roll numbers, enrolled standards (8th-10th), and login PIN credentials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Class Tabs & Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Standards' },
            { id: '10th', label: '10th' },
            { id: '9th', label: '9th' },
            { id: '8th', label: '8th' },
          ].map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedClass === cls.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cls.label}
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
            placeholder="Search by student name, roll no, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Students Table (Clean Fixed Widths, min-w-[720px]) */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-xs mt-3">Loading Students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No enrolled students found. Click "Enroll New Student" to add one!
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[720px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 min-w-[110px]">Roll No</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Student Name</th>
                  <th className="py-3.5 px-4 min-w-[80px]">Class</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Parent Details</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4 min-w-[90px]">Student PIN</th>
                  <th className="py-3.5 px-4 text-right min-w-[70px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {s.rollNo}
                    </td>
                    <td className="py-4 px-4 font-bold text-white text-sm">
                      {s.name}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border whitespace-nowrap ${getClassBadgeColor(s.class, true)}`}>
                        {s.class}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div>{s.parentName || '—'}</div>
                      <div className="text-[10px] text-slate-500 whitespace-nowrap">{s.parentPhone}</div>
                    </td>
                    <td className="py-4 px-4 font-mono whitespace-nowrap">
                      {s.phone}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono bg-slate-900 px-2 py-1 rounded text-amber-400 border border-slate-800">
                        {s.pin}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        title="Delete student"
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

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-white">Enroll New Student</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Akash Bora"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Assigned Roll No *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value.toUpperCase() })}
                    placeholder="e.g. AB-1001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Standard / Class *</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10th">10th</option>
                    <option value="9th">9th</option>
                    <option value="8th">8th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student 4-Digit PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newStudent.pin}
                    onChange={(e) => setNewStudent({ ...newStudent, pin: e.target.value })}
                    placeholder="1234"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold tracking-widest focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Student Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="e.g. 9890724002"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    placeholder="e.g. Rajesh Bora"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Parent Mobile Number</label>
                  <input
                    type="tel"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    placeholder="e.g. 9890724002"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  Save & Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
