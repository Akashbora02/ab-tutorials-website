'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Camera, ArrowRight, Award, Users, BookOpen } from 'lucide-react';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const galleryItems = [
    {
      id: 1,
      title: 'Classroom Lecture & Numerical Problem Solving',
      category: 'CLASSROOM',
      image: '/images/photo1.jpg',
      caption: 'Interactive board explanation and step-by-step problem breakdown by Prof. Akshay Bora.',
    },
    {
      id: 2,
      title: 'Personal Mentoring & Doubts Solving',
      category: 'CLASSROOM',
      image: '/images/photo2.jpg',
      caption: 'Individual student attention to ensure fundamental concept mastery.',
    },
    {
      id: 3,
      title: 'Focused Classroom Learning Environment',
      category: 'CLASSROOM',
      image: '/images/photo3.jpg',
      caption: 'Discipline and academic environment tailored for high concentration.',
    },
    {
      id: 4,
      title: 'Small Batch Collaborative Study',
      category: 'BATCHES',
      image: '/images/photo4.jpg',
      caption: 'Small batch sizes (15-20 students max) for direct teacher-student interaction.',
    },
    {
      id: 5,
      title: 'Science Concepts & Real-World Demonstrations',
      category: 'CLASSROOM',
      image: '/images/photo5.jpg',
      caption: 'Connecting textbook physics and chemistry laws with practical examples.',
    },
    {
      id: 6,
      title: 'Weekly Examination & Mock Test Series',
      category: 'EXAMS',
      image: '/images/photo6.jpg',
      caption: 'Continuous evaluation under real board exam simulation conditions.',
    },
    {
      id: 7,
      title: 'Annual Felicitation of 90%+ Board Toppers',
      category: 'AWARDS',
      image: '/images/photo7.jpg',
      caption: 'Celebrating our brilliant Class 10th achievers with parents and faculty.',
    },
    {
      id: 8,
      title: 'Director Desk — Prof. Akshay Bora',
      category: 'FACULTY',
      image: '/images/sir.jpg',
      caption: 'Founder & Lead Faculty with 4+ years of dedicated teaching excellence.',
    },
    {
      id: 9,
      title: 'AB Tutorials Institute Banner at Rajuri Center',
      category: 'CAMPUS',
      image: '/images/banner.jpg',
      caption: 'Main coaching facility located at Rajuri, Tal-Rahata, Dist-Ahilyanagar.',
    },
  ];

  const filteredItems = activeFilter === 'ALL' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Campus Photo Gallery • AB Tutorials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Classroom & Academic Life
          </h1>
          <p className="text-slate-600 mt-3 text-base leading-relaxed">
            Building strong foundation for student success. Glimpses of daily lectures, doubt sessions, weekly test series, and annual topper felicitations at Rajuri.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: 'ALL', label: 'All Photos' },
            { id: 'CLASSROOM', label: 'Classroom & Teaching' },
            { id: 'BATCHES', label: 'Batch Sessions' },
            { id: 'EXAMS', label: 'Weekly Tests' },
            { id: 'AWARDS', label: 'Toppers & Felicitations' },
            { id: 'FACULTY', label: 'Faculty Spotlight' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold">Experience Our Classroom in Person</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Attend 2 free trial demo lectures with Prof. Akshay Bora at Rajuri and experience the difference.
          </p>
          <div className="pt-2">
            <Link
              href="/admission"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              <span>Book Free Demo Seat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
