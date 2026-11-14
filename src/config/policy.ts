/**
 * Centralized Clinical & Platform Policies Configuration
 * Single Source of Truth for all pages, UI components, booking wizards, and notification emails.
 */

export const SITE_POLICY = {
  // Cancellation and Rescheduling Policy (Unified Single Source of Truth)
  cancellation: {
    minimumNoticeHours: 48,
    labelArabic: '48 ساعة',
    summaryArabic: 'إلغاء أو إعادة جدولة مجاني حتى 48 ساعة قبل الموعد',
    descriptionArabic: 'نقدّر ظروفك؛ إمكانية إلغاء أو إعادة جدولة جلستك مجاناً وبكل سهولة حتى 48 ساعة قبل الموعد.',
    refundTermsArabic: 'استرداد كامل للمبلغ أو إعادة جدولة مجانية عند طلب الإلغاء قبل الموعد بـ 48 ساعة على الأقل. في حال الإلغاء بأقل من 48 ساعة، يتعذر الاسترداد لتعذر حجز الموعد لعميل آخر.',
  },

  // Minimum advance notice required to book a new appointment
  bookingNotice: {
    minimumNoticeHours: 6,
    labelArabic: '6 ساعات',
    descriptionArabic: 'أقرب موعد متاح للاستشارة يبدأ بعد 6 ساعات على الأقل من وقت الحجز لضمان مراجعة الإيصال والاستعداد السريري.',
  },

  // Session Buffer Time (Rest & SOAP clinical documentation)
  buffer: {
    beforeMinutes: 5,
    afterMinutes: 15,
  },

  // Official Emergency Hotlines
  // TODO: تحقق وتأكيد دوري للأرقام مع الجهات الرسمية قبل كل إطلاق
  emergencyHotlines: {
    egyptMentalHealth: {
      number: '16328',
      labelArabic: 'الخط الساخن للأمانة العامة للصحة النفسية (مصر)',
      hoursArabic: '24/7 على مدار الساعة',
    },
    egyptAmbulance: {
      number: '123',
      labelArabic: 'الإسعاف المصري (طوارئ قصوى)',
      hoursArabic: '24/7',
    },
    saudiMentalHealth: {
      number: '920033360',
      labelArabic: 'المركز الوطني لتعزيز الصحة النفسية (السعودية)',
      hoursArabic: 'يومياً من 8 ص حتى 8 م',
    },
    generalEmergency: {
      number: '112',
      labelArabic: 'طوارئ النجدة الموحدة (دولياً وعربياً)',
      hoursArabic: '24/7',
    },
  },

  // Official Communication Channels
  contact: {
    officialWhatsAppNumber: '201014876666',
    officialWhatsAppDisplay: '+20 101 487 6666',
    officialEmail: 'appointments@galalahmad.com',
    counselorEmail: 'galalahmad1201@gmail.com',
  },
} as const;
