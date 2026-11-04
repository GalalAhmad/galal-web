import React from 'react';
import { notFound } from 'next/navigation';
import { allCoursesData, getCourseBySlug } from '@/data/coursesData';
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

export function generateStaticParams() {
  return allCoursesData.map((course) => ({
    slug: course.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const course = getCourseBySlug(params.slug);
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
  const course = getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  // If player mode is explicitly requested
  if (searchParams?.mode === 'player') {
    return <CoursePlayerView course={course} />;
  }

  return <CourseDetailClientView course={course} />;
}
