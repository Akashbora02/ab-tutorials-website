'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  UserCircle2, 
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide public navbar on admin pages
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Admission', href: '/admission' },
    { name: 'Online Tests', href: '/student/tests' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Notice Bar */}
      <div className="bg-slate-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 sm:gap-2">
          
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start text-center md:text-left">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shadow-xs shrink-0">
              Admissions 2026-27
            </span>
            <span className="text-slate-200 text-xs font-medium">
              Classes 8th, 9th & 10th (Science & Maths) • Rajuri (Near New Talathi Office), India
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <a 
              href="https://wa.me/919890724002?text=Hello%20Prof.%20Akshay%20Bora,%20I%20am%20interested%20in%20AB%20Tutorials%20Admission" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="tel:+919890724002" 
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition font-mono"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 98907 24002</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 sm:h-20">
          
          {/* Brand Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-200 p-1 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img 
                src="/images/logo.png" 
                alt="AB Tutorials Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="truncate">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-950 block leading-tight">
                AB <span className="text-blue-600">Tutorials</span>
              </span>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate leading-none mt-0.5">
                Building strong foundation for student success
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/90 shadow-xs'
                      : 'text-slate-800 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            <Link
              href="/student/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl transition border border-slate-200 whitespace-nowrap"
            >
              <UserCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Student Portal</span>
            </Link>

            <Link
              href="/admission"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Apply Online</span>
            </Link>
          </div>

          {/* Tablet & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/student/login"
              className="px-2.5 py-1.5 text-blue-600 bg-blue-50 rounded-xl text-xs font-bold flex items-center gap-1 border border-blue-200"
            >
              <UserCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Portal</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-hidden border border-slate-200"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {isOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <Link
              href="/student/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
            >
              Student Portal
            </Link>
            <Link
              href="/admission"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition"
            >
              Apply Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
