'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  MessageSquare, 
  Award, 
  AlertCircle, 
  KeyRound, 
  ArrowRight, 
  Laptop,
  AlertTriangle,
  X,
  LogIn
} from 'lucide-react';

function AdmissionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialClass = searchParams.get('class') || '10th';

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    targetClass: initialClass === '7th' ? '8th' : initialClass,
    subjects: 'Mathematics & Science',
    schoolName: '',
    previousPercentage: '',
    preferredBatch: 'Evening (4:30 PM - 6:30 PM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentResult, setStudentResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Duplicate alert modal state
  const [duplicateModal, setDuplicateModal] = useState<{
    show: boolean;
    message: string;
    existingPhone?: string;
    existingName?: string;
    existingRollNo?: string;
  }>({
    show: false,
    message: '',
  });

  useEffect(() => {
    if (searchParams.get('class')) {
      const cls = searchParams.get('class') || '10th';
      setFormData((prev) => ({ ...prev, targetClass: cls === '7th' ? '8th' : cls }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setStudentResult(data.data);
        if (data.data) {
          localStorage.setItem('ab_student_user', JSON.stringify({
            rollNo: data.data.rollNo,
            name: data.data.studentName,
            class: data.data.class,
            subjects: data.data.subjects,
            phone: data.data.phone,
          }));
        }
      } else if (data.duplicate) {
        // Show interactive duplicate warning popup!
        setDuplicateModal({
          show: true,
          message: data.error || 'A student with this Mobile Number is already registered!',
          existingPhone: data.existingPhone || formData.phone,
          existingName: data.existingName,
          existingRollNo: data.existingRollNo,
        });
      } else {
        setErrorMsg(data.error || 'Failed to submit admission application.');
      }
    } catch (err) {
      setErrorMsg('An unexpected network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToExamPortal = () => {
    if (studentResult?.class) {
      router.push(`/student/tests?class=${studentResult.class}`);
    } else {
      router.push('/student/tests');
    }
  };

  const handleGoToLogin = () => {
    // Redirect to login prefilling their phone
    router.push('/student/login');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Duplicate Account Alert Modal */}
      {duplicateModal.show && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400 text-slate-900 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 font-black text-lg">
                <AlertTriangle className="w-6 h-6" />
                <span>Account Already Exists</span>
              </div>
              <button
                onClick={() => setDuplicateModal({ ...duplicateModal, show: false })}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {duplicateModal.message}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div><strong>Registered Mobile:</strong> {duplicateModal.existingPhone}</div>
              {duplicateModal.existingRollNo && (
                <div><strong>Assigned Roll No:</strong> {duplicateModal.existingRollNo}</div>
              )}
              <div><strong>Default PIN:</strong> 1234</div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleGoToLogin}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In Directly to Student Portal &rarr;</span>
              </button>

              <button
                onClick={() => {
                  setDuplicateModal({ ...duplicateModal, show: false });
                  setFormData({ ...formData, phone: '', email: '' });
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Register with a Different Mobile Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Form / Success Credential Card */}
      <div className="lg:col-span-7">
        {submitted && studentResult ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-300 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Registration Successful!
              </h3>
              <p className="text-slate-600 text-sm">
                Welcome to <strong>AB Tutorials</strong>, <span className="text-blue-600 font-bold">{studentResult.studentName}</span>! Your official student account and roll number have been generated.
              </p>
            </div>

            {/* Generated Student Credentials Box */}
            <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" /> Your Official Student Credentials
                </span>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Class {studentResult.class}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Assigned Roll No</div>
                  <div className="text-xl font-black text-blue-400 font-mono mt-1">{studentResult.rollNo}</div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">4-Digit PIN</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">{studentResult.pin}</div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Registered Mobile</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mt-2">{studentResult.phone}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center pt-2">
                Subjects Enrolled: <strong className="text-white">{studentResult.subjects}</strong>
              </div>
            </div>

            {/* Direct 1-Click Action to Class Exam Portal */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGoToExamPortal}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm sm:text-base active:scale-98"
              >
                <Laptop className="w-5 h-5" />
                <span>Launch Class {studentResult.class} Examination Portal &rarr;</span>
              </button>

              <a
                href={`https://wa.me/919890724002?text=Hello%20Prof.%20Akshay%20Bora,%20I%20have%20registered%20for%20admission.%20Student:%20${encodeURIComponent(studentResult.studentName)},%20Class:%20${studentResult.class},%20Roll%20No:%20${studentResult.rollNo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Confirmation to Prof. Akshay Bora on WhatsApp (+91 98907 24002)</span>
              </a>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Online Admission Application</h2>
                <p className="text-xs text-slate-500 mt-1">Get Instant Roll Number & Access to Class Tests</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Session 2026-27
              </span>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Target Class Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Target Class *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['8th', '9th', '10th'].map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => setFormData({ ...formData, targetClass: cls })}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                        formData.targetClass === cls
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Class {cls}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student & Parent Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rahul Deshmukh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Parent / Guardian Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Ramesh Deshmukh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student / Parent Mobile (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 9823401122"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">This number will be your login ID for online exams.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. student@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Choice & Batch Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject Preference *
                  </label>
                  <select
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Mathematics & Science">Mathematics & Science (Recommended)</option>
                    <option value="Mathematics Only">Mathematics Only</option>
                    <option value="Science Only">Science Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Batch Timing
                  </label>
                  <select
                    name="preferredBatch"
                    value={formData.preferredBatch}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Morning (8:00 AM - 10:00 AM)">Morning (8:00 AM - 10:00 AM)</option>
                    <option value="Evening (4:30 PM - 6:30 PM)">Evening (4:30 PM - 6:30 PM)</option>
                    <option value="Evening (6:30 PM - 8:30 PM)">Evening (6:30 PM - 8:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* School Name & Previous Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Current School Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="e.g. Rahata High School"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Previous Class Score / %
                  </label>
                  <input
                    type="text"
                    name="previousPercentage"
                    value={formData.previousPercentage}
                    onChange={handleChange}
                    placeholder="e.g. 85%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Specific Learning Goals or Weak Topics
                </label>
                <textarea
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Extra focus on Physics equations / Looking for weekend test series..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking & Generating Roll Number...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit & Get Instant Test Login Access</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Right Column: Admission Highlights & Direct WhatsApp */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Quick Summary Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
            Why Register Online?
          </span>
          <h3 className="text-2xl font-black">Instant Access to Your Class Tests</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Upon submitting the form, your Roll Number and PIN are instantly generated, allowing you to access chapter mock tests for your specific standard immediately.
          </p>

          <div className="space-y-2.5 pt-2 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Roll Number & 4-Digit Login PIN</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Class-specific CBT test portal with instant scores</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free 2-day trial lecture with Prof. Akshay Bora</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized counseling session at Rajuri</span>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">Have an immediate query?</h4>
            <p className="text-xs text-emerald-700 mt-0.5">Chat with Prof. Akshay Bora directly on WhatsApp</p>
          </div>
          <a
            href="https://wa.me/919890724002?text=Hi%20Prof.%20Akshay%20Bora,%20I%20have%20an%20admission%20enquiry%20for%20AB%20Tutorials"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp (+91 98907 24002)</span>
          </a>
        </div>

      </div>

    </div>
  );
}

export default function AdmissionPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Admissions Open for Academic Session 2026-27</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Online Admission Application
          </h1>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            Building strong foundation for student success. Apply online to get your instant Student Roll Number and access tests tailored to your class.
          </p>
        </div>

        <Suspense fallback={
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        }>
          <AdmissionForm />
        </Suspense>

      </div>
    </div>
  );
}
