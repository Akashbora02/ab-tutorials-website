import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AB Tutorials | Building Strong Foundation for Student Success (8th-10th)',
  description:
    'Premier Science and Mathematics coaching institute for Classes 8th, 9th, and 10th by Prof. Akshay Bora at Rajuri, Tal-Rahata, Dist-Ahilyanagar. Conceptual clarity, weekly tests, and personal attention.',
  keywords: [
    'AB Tutorials',
    'Prof Akshay Bora',
    'Coaching classes in Rajuri',
    'Rahata coaching classes',
    'Ahilyanagar coaching classes',
    '10th SSC Maths Science',
    '9th Foundation Coaching',
    '8th Science Mathematics',
    'Online mock tests 10th board',
  ],
  authors: [{ name: 'Prof. Akshay Bora' }],
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
