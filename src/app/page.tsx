import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Tracks from '@/components/Tracks';
import Programs from '@/components/Programs';
import About from '@/components/About';
import ArticlesSection from '@/components/ArticlesSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <Tracks />
      <Programs />
      <About />
      <ArticlesSection />
      <BookingSection />
      <Footer />
    </main>
  );
}
