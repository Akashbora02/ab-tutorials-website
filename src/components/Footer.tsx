'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageSquare, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
      
      {/* Pre-Footer Callout */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Admissions Open 2026-27 (Classes 8th to 10th)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Score 90%+ in Science & Maths?
            </h3>
            <p className="text-blue-200 text-sm mt-1">
              Building strong foundation for student success with Prof. Akshay Bora at Rajuri (Near New Talathi Office), India.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/admission"
              className="px-6 py-3.5 bg-white text-slate-950 font-bold rounded-xl shadow-lg hover:bg-slate-100 active:scale-95 transition text-sm"
            >
              Enroll Now
            </Link>
            <a
              href="https://wa.me/919890724002?text=Hi%20Prof.%20Akshay%20Bora,%20I%20want%20to%20know%20more%20about%20admission%20at%20AB%20Tutorials"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition inline-flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Institute About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-700 overflow-hidden shrink-0">
                <img 
                  src="/images/logo.png" 
                  alt="AB Tutorials" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-xl font-black text-white tracking-tight">AB Tutorials</h4>
                <p className="text-xs text-blue-400 font-semibold">Science & Maths Academy</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              <strong className="text-white">Building strong foundation for student success.</strong> Dedicated coaching for Classes 8th, 9th, and 10th by <strong className="text-slate-200">Prof. Akshay Bora</strong> with concept clarity, weekly tests, and personal mentoring.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/tr_akshay_bora/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/akshay.bora1122"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919890724002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 border-l-2 border-blue-500 pl-2.5">
              Quick Navigation
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> About Prof. Akshay Bora
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Courses (8th–10th)
                </Link>
              </li>
              <li>
                <Link href="/admission" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Online Admission
                </Link>
              </li>
              <li>
                <Link href="/student/tests" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Online Test Series (CBT)
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 flex items-center gap-1.5 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Batches */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2.5">
              Academic Batches (8th-10th)
            </h5>
            <ul className="space-y-3 text-xs">
              <li className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Class 10th Board Booster</div>
                <div className="text-slate-400 mt-0.5">Maths & Science State Board / CBSE</div>
              </li>
              <li className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Class 9th Foundation Pro</div>
                <div className="text-slate-400 mt-0.5">Concept building & early 10th prep</div>
              </li>
              <li className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Class 8th Foundation Starters</div>
                <div className="text-slate-400 mt-0.5">Strong fundamentals & Olympiad logic</div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-sm mb-4 border-l-2 border-amber-500 pl-2.5">
              Center Address & Contact
            </h5>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  Rajuri (Near New Talathi Office), Tal-Rahata, Dist-Ahilyanagar, 413737
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919890724002" className="text-slate-300 hover:text-white transition font-mono font-bold">
                  +91 98907 24002
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:akshaybora82@gmail.com" className="text-slate-300 hover:text-white transition">
                  akshaybora82@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Class Timings</div>
                  <div className="text-slate-400">Mon - Sat: 8:00 AM - 9:00 PM</div>
                  <div className="text-emerald-400 font-semibold mt-0.5">Sunday: Weekly Mock Tests</div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">AB Tutorials</span>. All rights reserved. Directed by Prof. Akshay Bora.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/student/login" className="hover:text-blue-400">
              Student Assessment Portal
            </Link>
            <span>•</span>
            <Link href="/admission" className="hover:text-blue-400">
              Admission Registration
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
