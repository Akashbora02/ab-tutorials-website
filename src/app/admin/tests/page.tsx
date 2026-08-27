'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { getClassBadgeColor } from '@/lib/utils';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Test Form State (Standard: 6 Questions, 2 Marks Each = 12 Marks Total)
  const defaultQuestions = Array.from({ length: 6 }, () => ({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
    marks: 2,
  }));

  const [newTest, setNewTest] = useState({
    title: '',
    subject: 'Mathematics',
    class: '10th',
    durationMinutes: 20,
    passingMarks: 5,
    difficulty: 'Medium',
    description: '',
    questions: defaultQuestions,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tests');
      const data = await res.json();
      if (data.success) {
        setTests(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setNewTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctOption: 'A',
          explanation: '',
          marks: 4,
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    if (newTest.questions.length === 1) return;
    setNewTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setNewTest((prev) => {
      const updatedQ = [...prev.questions];
      updatedQ[index] = { ...updatedQ[index], [field]: value };
      return { ...prev, questions: updatedQ };
    });
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const totalMarks = newTest.questions.reduce((acc, q) => acc + Number(q.marks), 0);
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTest,
          totalMarks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        fetchTests();
        setNewTest({
          title: '',
          subject: 'Mathematics',
          class: '10th',
          durationMinutes: 20,
          passingMarks: 5,
          difficulty: 'Medium',
          description: '',
          questions: defaultQuestions,
        });
      } else {
        alert(data.error || 'Failed to create test');
      }
    } catch (err) {
      alert('Error creating test');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test and its question bank?')) return;
    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTests((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      alert('Error deleting test');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Test & Question Bank Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, publish, and manage online CBT tests for 8th, 9th, and 10th Math & Science.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-xs mt-3">Loading Question Banks...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
          No tests available. Click "Create New Test" to build one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getClassBadgeColor(test.class)}`}>
                    Class {test.class}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    test.subject === 'Mathematics'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {test.subject}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{test.title}</h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-2">{test.description}</p>

                <div className="mt-6 pt-4 border-t border-slate-900 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <div className="font-bold text-white">{test._count?.questions || 0}</div>
                    <div className="text-[10px] text-slate-500">Questions</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <div className="font-bold text-white">{test.durationMinutes}m</div>
                    <div className="text-[10px] text-slate-500">Duration</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <div className="font-bold text-amber-400">{test.totalMarks} M</div>
                    <div className="text-[10px] text-slate-500">Max Marks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Published
                </span>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
                  title="Delete Test"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Create New CBT Test</h3>
                <p className="text-xs text-slate-400">Add test metadata and multiple-choice questions</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Test Title *</label>
                  <input
                    type="text"
                    required
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                    placeholder="e.g. Class 10 - Mathematics: Linear Equations"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Target Class</label>
                  <select
                    value={newTest.class}
                    onChange={(e) => setNewTest({ ...newTest, class: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="10th">Class 10th</option>
                    <option value="9th">Class 9th</option>
                    <option value="8th">Class 8th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
                  <select
                    value={newTest.subject}
                    onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newTest.durationMinutes}
                    onChange={(e) => setNewTest({ ...newTest, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={newTest.passingMarks}
                    onChange={(e) => setNewTest({ ...newTest, passingMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  placeholder="Test syllabus coverage and difficulty instructions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Questions Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Questions ({newTest.questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {newTest.questions.map((q, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-300">Question {idx + 1}</span>
                      {newTest.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-rose-400 hover:text-rose-300 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                      placeholder="Enter question statement..."
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <div key={opt}>
                          <label className="text-[10px] text-slate-500 font-bold">Option {opt}</label>
                          <input
                            type="text"
                            required
                            value={(q as any)[`option${opt}`]}
                            onChange={(e) => handleQuestionChange(idx, `option${opt}`, e.target.value)}
                            className="w-full px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Correct Option</label>
                        <select
                          value={q.correctOption}
                          onChange={(e) => handleQuestionChange(idx, 'correctOption', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold text-emerald-400"
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold">Marks</label>
                        <input
                          type="number"
                          value={q.marks}
                          onChange={(e) => handleQuestionChange(idx, 'marks', Number(e.target.value))}
                          className="w-full px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold">Step-by-Step Explanation</label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                        placeholder="Pedagogical solution explanation for student scorecard..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {submitting ? 'Publishing Test...' : 'Publish Test'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
