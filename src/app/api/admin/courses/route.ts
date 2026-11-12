import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { allCoursesData, tracksData, Course, TrackInfo } from '@/data/coursesData';
import { requireRole } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const catalogFilePath = path.join(process.cwd(), 'src', 'data', 'coursesCatalog.json');

interface CatalogData {
  tracks: TrackInfo[];
  courses: Course[];
}

async function readCatalog(): Promise<CatalogData> {
  // 1. Try local JSON first
  try {
    const raw = await fs.readFile(catalogFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.courses) && parsed.courses.length > 0) {
      return parsed;
    }
  } catch (err) {
    // If not found, fallback
  }

  // 2. Try Supabase site_settings
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'courses_catalog_v2')
        .maybeSingle();

      if (data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        if (val && Array.isArray(val.courses)) {
          // write back to local for cache
          await writeCatalog(val).catch(() => {});
          return val;
        }
      }
    } catch (e) {
      console.error('Supabase fetch courses catalog error:', e);
    }
  }

  // 3. Fallback to static data
  const initialData: CatalogData = {
    tracks: tracksData,
    courses: allCoursesData,
  };
  await writeCatalog(initialData).catch(() => {});
  return initialData;
}

async function writeCatalog(data: CatalogData) {
  // 1. Write local file
  try {
    await fs.writeFile(catalogFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing coursesCatalog.json:', err);
  }

  // 2. Write to Supabase site_settings if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: existing } = await supabaseAdmin
        .from('site_settings')
        .select('key')
        .eq('key', 'courses_catalog_v2')
        .maybeSingle();

      if (existing) {
        await supabaseAdmin
          .from('site_settings')
          .update({ value: JSON.stringify(data) })
          .eq('key', 'courses_catalog_v2');
      } else {
        await supabaseAdmin
          .from('site_settings')
          .insert({ key: 'courses_catalog_v2', value: JSON.stringify(data) });
      }
    } catch (e) {
      console.error('Supabase write courses catalog error:', e);
    }
  }
}

// GET: Fetch all courses and tracks
export async function GET() {
  try {
    const catalog = await readCatalog();
    return NextResponse.json(
      { success: true, courses: catalog.courses, tracks: catalog.tracks },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'فشل في قراءة بيانات الدورات', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Add a new course or track
export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const catalog = await readCatalog();

    // Check if adding a track
    if (body.type === 'track') {
      const newTrack: TrackInfo = {
        id: body.id || `track-${Date.now()}`,
        title: body.title || 'مسار تدريبي جديد',
        subtitle: body.subtitle || '',
        description: body.description || '',
        color: body.color || 'text-[#154F9C]',
        bgColor: body.bgColor || 'bg-[#EDF5FD]',
        borderColor: body.borderColor || 'border-[#D6E6F8]',
        icon: body.icon || 'Compass',
        coursesCount: 0,
      };

      catalog.tracks.push(newTrack);
      await writeCatalog(catalog);
      return NextResponse.json({ success: true, track: newTrack, tracks: catalog.tracks });
    }

    // Otherwise, adding a new Course
    const courseData = body.course || body;
    const generatedId = courseData.id || `course-${Date.now().toString().slice(-6)}`;
    const generatedSlug = courseData.slug || generatedId;

    const newCourse: Course = {
      id: generatedId,
      slug: generatedSlug,
      title: courseData.title || 'دورة تدريبية جديدة',
      subtitle: courseData.subtitle || '',
      trackId: courseData.trackId || 'family',
      trackLabel: courseData.trackLabel || 'مسار تدريبي',
      instructor: courseData.instructor || {
        name: 'جلال أحمد',
        title: 'أخصائي نفسي وأسري',
      },
      badge: courseData.badge || 'برنامج جديد',
      level: courseData.level || 'شامل لكافة المستويات',
      duration: courseData.duration || '6 أسابيع',
      format: courseData.format || 'محطات تفاعلية وتطبيقات عملية',
      rating: courseData.rating || 5.0,
      reviewsCount: courseData.reviewsCount || 0,
      studentsCount: courseData.studentsCount || 0,
      price: courseData.price || 'متاح للتسجيل',
      overview: courseData.overview || 'نبذة تعريفية عن البرنامج ومحتواه الإرشادي...',
      targetAudience: Array.isArray(courseData.targetAudience) && courseData.targetAudience.length > 0
        ? courseData.targetAudience
        : ['المهتمون بتطوير العلاقات والاتزان النفسي'],
      learningOutcomes: Array.isArray(courseData.learningOutcomes) && courseData.learningOutcomes.length > 0
        ? courseData.learningOutcomes
        : [{ title: 'اكتساب المهارات الأساسية', desc: 'تطبيق عملي مباشر على أدوات البرنامج.' }],
      syllabus: Array.isArray(courseData.syllabus) && courseData.syllabus.length > 0
        ? courseData.syllabus
        : [
            {
              id: 'station-1',
              num: '01',
              title: 'المحطة الافتتاحية والتأسيس',
              description: 'مقدمة البرنامج وتحديد أهداف المسار.',
              icon: '🌱',
              badgeColor: 'text-[#154F9C]',
              lessons: [
                {
                  id: `${generatedId}-l1`,
                  title: 'الدرس الأول: خريطة الطريق والمنطلقات الأساسية',
                  duration: '25 دقيقة',
                  type: 'video',
                  summary: 'استعراض أهداف ومحاور هذه المحطة وكيفية تطبيقها في الحياة اليومية.',
                  keyTakeaways: ['الوعي هو الخطوة الأولى للتغيير والاتزان.'],
                },
              ],
            },
          ],
      faqs: Array.isArray(courseData.faqs) ? courseData.faqs : [],
    };

    // Prepend or append
    catalog.courses.unshift(newCourse);
    await writeCatalog(catalog);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الدورة التدريبية بنجاح ✓',
      course: newCourse,
      courses: catalog.courses,
    });
  } catch (error: any) {
    console.error('Error adding course:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ الدورة الجديدة', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing course
export async function PUT(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const catalog = await readCatalog();
    const updatedCourse: Course = body.course || body;

    const index = catalog.courses.findIndex(
      (c) => c.id === updatedCourse.id || c.slug === updatedCourse.slug
    );

    if (index === -1) {
      return NextResponse.json(
        { error: 'الدورة المطلوبة غير موجودة في النظام' },
        { status: 404 }
      );
    }

    catalog.courses[index] = {
      ...catalog.courses[index],
      ...updatedCourse,
    };

    await writeCatalog(catalog);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات ومنهج الدورة بنجاح ✓',
      course: catalog.courses[index],
      courses: catalog.courses,
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث بيانات الدورة', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a course
export async function DELETE(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرّف الدورة مطلوب للحذف' }, { status: 400 });
    }

    const catalog = await readCatalog();
    const initialLen = catalog.courses.length;
    catalog.courses = catalog.courses.filter((c) => c.id !== id && c.slug !== id);

    if (catalog.courses.length === initialLen) {
      return NextResponse.json({ error: 'الدورة المراد حذفها غير موجودة' }, { status: 404 });
    }

    await writeCatalog(catalog);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدورة بنجاح من الأكاديمية ✓',
      courses: catalog.courses,
    });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الدورة', details: error.message },
      { status: 500 }
    );
  }
}
