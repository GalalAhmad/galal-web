'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileAppSplash() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [showSplash, setShowSplash] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only trigger on mobile / small devices or standalone PWA
    const isMobileDevice = window.innerWidth <= 768 || window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if splash was already shown during this browser session
    const hasShown = sessionStorage.getItem('galal_splash_session_shown');

    if (isMobileDevice && !hasShown) {
      setShowSplash(true);
      sessionStorage.setItem('galal_splash_session_shown', 'true');

      // Step 1: Start fade-out after 1.3 seconds
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1300);

      // Step 2: Unmount after transition finishes (1.7s)
      const unmountTimer = setTimeout(() => {
        setShowSplash(false);
      }, 1700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-between p-8 bg-[#FAFBF9] dark:bg-[#070B11] text-slate-900 dark:text-white transition-opacity duration-500 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacer */}
      <div className="h-10" />

      {/* Center Branding Animation */}
      <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
        <div className="relative">
          {/* Subtle glowing halo behind logo */}
          <div className="absolute inset-0 rounded-full bg-[#4E7E76]/15 dark:bg-[#5E988E]/20 blur-2xl transform scale-125 animate-pulse" />
          
          <img
            src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
            alt="شعار المستشار جلال أحمد"
            className="h-20 sm:h-24 w-auto object-contain relative z-10 transition-transform duration-700 ease-out transform scale-100 animate-zoomIn"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">
            المستشار جـلال أحـمد
          </h2>
          <p className="text-xs text-[#4E7E76] dark:text-[#5E988E] font-bold">
            المنصة الرسمية للاستشارات والتمكين النفسي والأسري
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="flex flex-col items-center space-y-3 pb-6">
        <div className="w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#4E7E76] dark:bg-[#5E988E] rounded-full animate-progress" />
        </div>
        <span className="text-[11px] text-slate-400 font-medium font-sans">
          {isAuthenticated && user?.name ? `أهلاً بك أ. ${user.name.split(' ')[0]}` : 'تحميل الواجهة...'}
        </span>
      </div>
    </div>
  );
}
