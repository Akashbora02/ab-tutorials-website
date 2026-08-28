'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  BookOpen, 
  UserCheck, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Overview Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Admissions (8th-10th)', href: '/admin/admissions', icon: <Users className="w-4 h-4" /> },
    { name: 'Student Test Results', href: '/admin/results', icon: <Award className="w-4 h-4" /> },
    { name: 'Test & Question Builder', href: '/admin/tests', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Top Results (Hall of Fame)', href: '/admin/top-results', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { name: 'Student Roster', href: '/admin/students', icon: <UserCheck className="w-4 h-4" /> },
    { name: 'Inquiries & Messages', href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('ab_admin_authenticated');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans overflow-x-hidden max-w-full">
      
      {/* Mobile Admin Top Bar (Menu on Left Hand Side) */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left Side: 3-line Menu Button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 focus:outline-hidden transition active:scale-95 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700">
              <img 
                src="/images/logo.png" 
                alt="AB Tutorials" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block leading-tight">AB Admin Command</span>
              <p className="text-[9px] text-slate-400">Classes 8th to 10th</p>
            </div>
          </div>
        </div>

        {/* Right Side: Faculty Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/30">
            Director
          </span>
        </div>

      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileNavOpen && (
        <div 
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar for Desktop & Mobile Slide-Out Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out shadow-2xl
        lg:static lg:translate-x-0
        ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-slate-700 overflow-hidden shrink-0">
                <img 
                  src="/images/logo.png" 
                  alt="AB Tutorials" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-black text-white text-sm sm:text-base tracking-tight">AB Tutorials</h2>
                <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Command</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
              Management Modules
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              AB
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="font-bold text-xs text-white truncate">Prof. Akshay Bora</div>
              <div className="text-[10px] text-slate-400 truncate">akshaybora82@gmail.com</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 border border-rose-950/60 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden min-h-screen max-w-full w-full">
        {children}
      </main>

    </div>
  );
}
