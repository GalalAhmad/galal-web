import React from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { allCoursesData, getCourseBySlug, Course } from '@/data/coursesData';
import CoursePlayerView from '@/components/CoursePlayerView';
import CourseDetailClientView from '@/components/CourseDetailClientView';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    mode?: string;
  };
}

function getCourse(slug: string): Course | undefined {
  try {
    const catalogPath = path.join(process.cwd(), 'src', 'data', 'coursesCatalog.json');
    if (fs.existsSync(catalogPath)) {
      const raw = fs.readFileSync(catalogPath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.courses)) {
        const found = data.courses.find((c: any) => c.slug === slug || c.id === slug);
        if (found) return found;
      }
    }
  } catch (e) {}
  return getCourseBySlug(slug);
}

export function generateStaticParams() {
  try {
    const catalogPath = path.join(process.cwd(), 'src', 'data', 'coursesCatalog.json');
    if (fs.existsSync(catalogPath)) {
      const raw = fs.readFileSync(catalogPath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.courses)) {
        return data.courses.map((c: any) => ({ slug: c.slug }));
      }
    }
  } catch (e) {}

  return allCoursesData.map((course) => ({
    slug: course.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const course = getCourse(params.slug);
  if (!course) {
    return { title: 'البرنامج غير موجود | أكاديمية المستشار جلال أحمد' };
  }

  return {
    title: `${course.title} | المستشار جلال أحمد`,
    description: course.subtitle || course.overview.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.subtitle,
      type: 'website',
    },
  };
}

export default function CourseDetailPage({ params, searchParams }: PageProps) {
  const course = getCourse(params.slug);

  if (!course) {
    notFound();
  }

  // If player mode is explicitly requested
  if (searchParams?.mode === 'player') {
    return <CoursePlayerView course={course} />;
  }

  return <CourseDetailClientView course={course} />;
}
