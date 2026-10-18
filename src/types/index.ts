export type TrackType = 'individual' | 'marital' | 'premarital' | 'teen' | 'corporate';

export interface IntakeRequest {
  id?: string;
  full_name: string;
  whatsapp: string;
  email: string;
  track: TrackType;
  delivery_mode: 'online' | 'in_person';
  preferred_time?: 'morning' | 'evening' | 'any';
  notes?: string;
  status?: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'quranic' | 'marital' | 'parenting' | 'educational';
  excerpt: string;
  content: string;
  reading_time_minutes: number;
  created_at: string;
}

export interface Program {
  id: string;
  title: string;
  badge: string;
  audience: string;
  description: string;
  features: string[];
  ctaText: string;
  track: TrackType;
}
