'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('ServiceWorker registration failed: ', err);
        });
      });
    }

    // 2. Check if already running in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already installed, do not show prompt
    }

    // 3. Check if user already dismissed the prompt
    try {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (dismissed === 'true') {
        return;
      }
    } catch (e) {}

    // 4. Detect Mobile (strictly mobile, avoid desktops)
    const mobileCheck = 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth < 768);

    if (!mobileCheck) {
      return; // Desktop device, do not show
    }

    setIsMobile(true);

    // 5. Detect iOS Safari
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosCheck);

    // 6. Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 7. Show prompt quickly after 3.5 seconds on mobile
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        try {
          localStorage.setItem('pwa_prompt_dismissed', 'true');
        } catch (e) {}
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction
      alert('لتثبيت التطبيق على جهازك: اضغط على قائمة المتصفح (ثلاث نقاط ⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».');
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    } catch (e) {}
    setShowPrompt(false);
  };

  // If not mobile or not triggered yet, render nothing
  if (!isMobile || !showPrompt) {
    return null;
  }

  return (
    <aside 
      aria-label="تثبيت التطبيق"
      className="fixed bottom-20 inset-x-4 z-50 max-w-md mx-auto p-4 rounded-3xl bg-[#0E1524]/95 dark:bg-[#121A2C]/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl animate-fadeIn text-right"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer shrink-0"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 flex-1">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>تطبيق جلال أحمد الرسمي</span>
            </div>
            
            <p className="text-xs font-bold text-slate-100 leading-snug">
              ثبّت التطبيق على هاتفك مجاناً — وصول فوري للاستشارات والمقاييس دون متصفح
            </p>

            {/* iOS Helper text */}
            {isIOS && (
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1 bg-white/5 p-2 rounded-xl mt-1">
                لتثبيت التطبيق: اضغط زر المشاركة <Share className="w-3 h-3 inline mx-1 text-blue-400" /> ثم «إضافة إلى الشاشة الرئيسية» <PlusSquare className="w-3 h-3 inline mx-1 text-emerald-400" />
              </p>
            )}
          </div>

          {/* App Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#FAFCFA] p-1 flex items-center justify-center shrink-0 shadow-md border border-white/20">
            <img src="/icon-192.png" alt="شعار تطبيق جلال أحمد" className="w-full h-full object-contain rounded-xl" />
          </div>
        </div>
      </div>

      {/* Action Button for Android */}
      {!isIOS && (
        <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4E7E76] to-[#3D655E] hover:from-[#3D655E] hover:to-[#2F4F49] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت التطبيق على هاتفك الآن</span>
          </button>
        </div>
      )}
    </aside>
  );
}
