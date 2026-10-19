'use client';

import React from 'react';

// 1. Vector: Individual Psychological Therapy (استشارات نفسية فردية)
// Serene profile, calming waves, insight spark, peach & sage aura
export function VectorIndividualTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atIndGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4E7E76" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4E7E76" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="atIndLine" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E7E76" />
          <stop offset="1" stopColor="#CC4E46" />
        </linearGradient>
      </defs>

      {/* Aura background */}
      <circle cx="80" cy="80" r="70" fill="url(#atIndGlow)" />
      
      {/* Soft floating pastel clouds/blobs */}
      <circle cx="45" cy="50" r="22" fill="#F8DDD9" fillOpacity="0.55" />
      <circle cx="115" cy="110" r="26" fill="#D6EEEA" fillOpacity="0.55" />

      {/* Head contour of peaceful mind */}
      <path
        d="M52 125 C50 100 48 85 58 68 C68 50 92 50 102 68 C112 85 110 100 108 125"
        stroke="#4E7E76"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner peaceful thoughts / gentle wave lines */}
      <path d="M68 86 Q80 78 92 86" stroke="#4E7E76" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 98 Q80 90 96 98" stroke="#CC4E46" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M72 110 Q80 104 88 110" stroke="#4E7E76" strokeWidth="2.5" strokeLinecap="round" />

      {/* Insight spark / star of clarity */}
      <circle cx="80" cy="62" r="5" fill="#CC4E46" />
      <circle cx="80" cy="62" r="9" stroke="#CC4E46" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
      
      {/* Calm green leaf / sprouting hope */}
      <path
        d="M106 52 C116 48 122 55 120 65 C112 65 106 58 106 52 Z"
        fill="#4E7E76"
        fillOpacity="0.85"
      />
    </svg>
  );
}

// 2. Vector: Marital & Family Counseling (استشارات زوجية وأسرية)
// Two figures in safe connection, mutual heart loop, sky blue & sage
export function VectorCoupleTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atCoupleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#154F9C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#154F9C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#atCoupleGlow)" />
      
      {/* Pastel background clouds */}
      <circle cx="50" cy="65" r="28" fill="#D6E6F8" fillOpacity="0.6" />
      <circle cx="110" cy="65" r="28" fill="#D6EEEA" fillOpacity="0.6" />

      {/* Left person silhouette */}
      <circle cx="54" cy="60" r="14" stroke="#154F9C" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.8" />
      <path
        d="M34 115 C34 92 48 84 62 84 C70 84 76 88 80 94"
        stroke="#154F9C"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Right person silhouette */}
      <circle cx="106" cy="60" r="14" stroke="#4E7E76" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.8" />
      <path
        d="M126 115 C126 92 112 84 98 84 C90 84 84 88 80 94"
        stroke="#4E7E76"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Harmonious connecting heart bridge */}
      <path
        d="M80 84 C76 72 65 72 65 80 C65 88 80 98 80 98 C80 98 95 88 95 80 C95 72 84 72 80 84 Z"
        fill="#CC4E46"
        fillOpacity="0.85"
      />

      {/* Grounding home arch */}
      <path d="M42 128 Q80 114 118 128" stroke="#4E7E76" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

// 3. Vector: Premarital Preparation (الإعداد للحياة الزوجية - ميثاق)
// Foundation stones, partnership rings, rising dawn
export function VectorPremaritalTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atPreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4E7E76" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4E7E76" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#atPreGlow)" />
      
      {/* Warm amber & mint background aura */}
      <circle cx="80" cy="75" r="45" fill="#FEF9EC" fillOpacity="0.8" />

      {/* Two interlocking golden rings of conscious partnership */}
      <circle cx="70" cy="75" r="24" stroke="#4E7E76" strokeWidth="3.5" strokeOpacity="0.9" />
      <circle cx="90" cy="75" r="24" stroke="#CC4E46" strokeWidth="3.5" strokeOpacity="0.9" />

      {/* Rising sun of new beginning */}
      <path d="M60 120 Q80 105 100 120" stroke="#4E7E76" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="75" r="6" fill="#F59E0B" />

      {/* Twinkling stars of guidance */}
      <circle cx="48" cy="46" r="2.5" fill="#4E7E76" />
      <circle cx="112" cy="46" r="2.5" fill="#CC4E46" />
      <circle cx="80" cy="34" r="3" fill="#F59E0B" />
    </svg>
  );
}

// 4. Vector: Parenting & Educational Guidance (الاستشارات التربوية - رحلة رفق)
// Parent and child hand-in-hand, nurturing sprout, mint & sage
export function VectorParentingTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atParentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4E7E76" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#4E7E76" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#atParentGlow)" />
      <circle cx="80" cy="80" r="50" fill="#EDF7F5" fillOpacity="0.75" />

      {/* Parent figure (tall) */}
      <circle cx="58" cy="52" r="12" stroke="#4E7E76" strokeWidth="3" fill="#FFFFFF" />
      <path
        d="M40 115 C40 86 52 75 66 75 C74 75 79 78 84 84"
        stroke="#4E7E76"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Child figure (small & protected) */}
      <circle cx="102" cy="72" r="9" stroke="#CC4E46" strokeWidth="2.5" fill="#FFFFFF" />
      <path
        d="M86 115 C86 95 95 88 106 88 C115 88 122 95 122 115"
        stroke="#CC4E46"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Meeting hands / gentle touch in middle */}
      <circle cx="82" cy="94" r="4" fill="#4E7E76" />

      {/* Sprout of growth above child */}
      <path
        d="M102 46 C98 38 106 32 106 32 C106 32 114 38 110 46 Z"
        fill="#4E7E76"
      />
    </svg>
  );
}

// 5. Vector: Urgent 24h Booking / Emergency Support (الحجز الطارئ خلال 24 ساعة)
// 24h clock, lightning care badge, reassuring lavender & violet
export function VectorEmergencyTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atEmerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#atEmerGlow)" />
      <circle cx="80" cy="80" r="48" fill="#F4EFFC" />

      {/* Clock dial */}
      <circle cx="80" cy="80" r="36" stroke="#7C3AED" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.9" />
      
      {/* Clock hands pointing urgently and calmly */}
      <path d="M80 56 V80 H96" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="80" r="4" fill="#CC4E46" />

      {/* Urgent 24H badge */}
      <rect x="100" y="32" width="42" height="22" rx="11" fill="#CC4E46" />
      <text x="121" y="47" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="Cairo, sans-serif">24h</text>

      {/* Calming wave below */}
      <path d="M50 126 Q80 116 110 126" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// 6. Vector: Educational & Institutional Consulting (استشارات وتطوير المؤسسات)
// School academy, pillars of knowledge, olive branches
export function VectorInstitutionalTherapy({ className = 'w-32 h-32 sm:w-40 sm:h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="atInstGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4E7E76" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4E7E76" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#atInstGlow)" />
      <circle cx="80" cy="80" r="50" fill="#FEF9EC" fillOpacity="0.8" />

      {/* Academy pediment / roof */}
      <path d="M80 44 L46 62 H114 L80 44 Z" fill="#4E7E76" />
      <rect x="52" y="62" width="56" height="4" fill="#3D655E" />

      {/* Classical pillars */}
      <rect x="56" y="66" width="6" height="36" rx="2" fill="#4E7E76" />
      <rect x="70" y="66" width="6" height="36" rx="2" fill="#4E7E76" />
      <rect x="84" y="66" width="6" height="36" rx="2" fill="#4E7E76" />
      <rect x="98" y="66" width="6" height="36" rx="2" fill="#4E7E76" />

      {/* Base steps */}
      <rect x="48" y="102" width="64" height="5" rx="2" fill="#4E7E76" />
      <rect x="42" y="107" width="76" height="6" rx="3" fill="#3D655E" />

      {/* Open book / knowledge symbol */}
      <circle cx="80" cy="84" r="8" fill="#FFFFFF" />
      <circle cx="80" cy="84" r="4" fill="#CC4E46" />
    </svg>
  );
}

// Backward compatibility aliases
export const VectorDialogue = VectorIndividualTherapy;
export const VectorHarmony = VectorCoupleTherapy;
export const VectorGrowth = VectorParentingTherapy;
export const VectorUrgent = VectorEmergencyTherapy;

export function VectorBookCover({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="15" width="60" height="70" rx="6" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.8" />
      <line x1="32" y1="15" x2="32" y2="85" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="56" cy="45" r="12" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.7" />
      <path d="M44 65 H68" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M48 72 H64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}
