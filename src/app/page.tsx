import React from 'react';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServiceFinder from '@/components/ServiceFinder';
import Tracks from '@/components/Tracks';
import InitiativesSection from '@/components/InitiativesSection';
import Programs from '@/components/Programs';
import SelfAssessments from '@/components/SelfAssessments';
import BooksSection from '@/components/BooksSection';
import VideosSection from '@/components/VideosSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import About from '@/components/About';
import ArticlesSection from '@/components/ArticlesSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <AnnouncementBanner />
      <Navbar />
      <Hero />
      <ServiceFinder />
      <Tracks />
      <InitiativesSection />
      <Programs />
      <SelfAssessments />
      <BooksSection />
      <VideosSection />
      <TestimonialsSection />
      <About />
      <ArticlesSection />
      <BookingSection />
      <Footer />
    </main>
  );
}
