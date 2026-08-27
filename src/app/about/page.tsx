'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Target, 
  Heart, 
  GraduationCap, 
  Phone, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 bg-white py-8">
      
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>About AB Tutorials • Rajuri (Near New Talathi Office), India</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Building Strong Foundation for Student Success
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Founded by <strong className="text-slate-900">Prof. Akshay Bora</strong>, AB Tutorials is a premier coaching academy in Rajuri dedicated to turning Science & Mathematics into enjoyable, scoring subjects for students in <strong className="text-blue-600 font-bold">Classes 8th, 9th, and 10th</strong>.
          </p>
        </div>
      </section>

      {/* 2. Director Spotlight: Prof. Akshay Bora */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950">
                <img 
                  src="/images/sir.jpg" 
                  alt="Prof. Akshay Bora - Director, AB Tutorials"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <span>About Director</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Prof. Akshay Bora
              </h2>

              <p className="text-blue-300 text-sm sm:text-base font-medium italic border-l-2 border-blue-400 pl-3">
                With 4+ years of teaching experience, Prof. Akshay Bora is known for simplifying complex concepts and guiding students towards success.
              </p>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  "My name is Akshay Bora. I am a dedicated teacher with a strong passion for education. I have completed my M.Sc in Botany and B.Ed.
                </p>
                <p>
                  I am currently working as a teacher and also run coaching classes for students from 8th to 10th standard, focusing on Science and Mathematics. I believe in making learning simple, interesting, and practical for students.
                </p>
                <p>
                  I am hardworking, disciplined, and always ready to help my students achieve their goals. My aim is to guide students towards success and build a strong academic foundation for their future."
                </p>
              </div>

              {/* Verified Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">M.Sc in Botany & B.Ed</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">4+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Science & Maths (8th-10th)</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Simple & Practical Learning</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="tel:+919890724002"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: +91 98907 24002</span>
                </a>

                <a
                  href="https://wa.me/919890724002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: 9890724002</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Core Teaching Methodology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Teaching Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
            How We Build 90%+ Scorers
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Every chapter in Mathematics & Science follows our proven 4-stage pedagogical framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-base">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-900">Concept Visualization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every formula and physics law is derived logically from first principles with real-life practical examples.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-900">Step-by-Step Solving</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Handwritten numerical derivations and textbook exercise problems solved systematically in class.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-base">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-900">Weekly Testing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regular subjective and computer-based online tests with auto-graded scorecard analysis.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base">
              04
            </div>
            <h4 className="text-lg font-bold text-slate-900">1-on-1 Doubts Clinic</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Special weekend doubt-clearing sessions ensuring no student lags behind in any topic.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Classroom Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Life at AB Tutorials
          </span>
          <h2 className="text-3xl font-black text-slate-950 mt-2 tracking-tight">
            Classroom & Student Moments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
            <img src="/images/photo4.jpg" alt="Small batch learning" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
            <img src="/images/photo5.jpg" alt="Prof. Akshay Bora teaching" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
            <img src="/images/photo6.jpg" alt="Weekly test series" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
            <img src="/images/photo7.jpg" alt="Topper felicitations" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center border border-slate-800 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Join AB Tutorials for Classes 8th, 9th & 10th
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book a free trial demo lecture with Prof. Akshay Bora at Rajuri (Near New Talathi Office), India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admission"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg"
            >
              Apply Online Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition border border-slate-700"
            >
              Center Address & Map
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
