export interface SocialLink {
  name: string;
  url: string;
  icon: 'youtube' | 'instagram' | 'x' | 'linkedin';
}

export interface SiteConfig {
  name: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLinks: SocialLink[];
}

export const siteConfig: SiteConfig = {
  name: 'جلال أحمد',
  title: 'استشارات وبناء الإنسان والأسرة',
  phone: '+20 101 487 6666',
  whatsapp: '201014876666',
  email: 'info@galalahmad.com',
  socialLinks: [
    {
      name: 'لينكد إن',
      url: 'https://linkedin.com/in/galal3hmad/',
      icon: 'linkedin',
    },
    {
      name: 'منصة X',
      url: 'https://x.com/galal3hmad',
      icon: 'x',
    },
    {
      name: 'يوتيوب',
      url: 'https://youtube.com/@galal3hmad',
      icon: 'youtube',
    },
    {
      name: 'انستجرام',
      url: 'https://instagram.com/galal3hmad',
      icon: 'instagram',
    },
  ],
};
