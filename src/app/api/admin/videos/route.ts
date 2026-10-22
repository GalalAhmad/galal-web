import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialVideos, VideoItem } from '@/data/videos';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dataFilePath = path.join(process.cwd(), 'src/data/videos.json');

function getVideos(): VideoItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading videos:', err);
  }
  return initialVideos;
}

function saveVideos(videos: VideoItem[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving videos:', err);
    return false;
  }
}

// GET /api/admin/videos - List all videos
export async function GET() {
  const videos = getVideos();
  return NextResponse.json(
    { videos },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
  );
}

// POST /api/admin/videos - Add or delete video
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let videos = getVideos();

    if (body.action === 'delete' && body.id) {
      videos = videos.filter((v) => v.id !== body.id);
      saveVideos(videos);
      return NextResponse.json({ success: true, videos });
    }

    if (!body.title || !body.youtubeUrl) {
      return NextResponse.json({ error: 'العنوان ورابط اليوتيوب مطلوبان' }, { status: 400 });
    }

    // Extract youtube ID if possible
    let ytId = body.youtubeId || '';
    if (!ytId && body.youtubeUrl) {
      const match = body.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      ytId = match ? match[1] : 'dQw4w9WgXcQ';
    }

    const newVideo: VideoItem = {
      id: `v_${Date.now()}`,
      title: body.title,
      category: body.category || 'general',
      categoryLabel: body.categoryLabel || 'مرئيات عامة',
      youtubeId: ytId,
      youtubeUrl: body.youtubeUrl,
      duration: body.duration || '10:00',
      publishDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      viewsCount: 1,
      desc: body.desc || '',
    };

    videos.unshift(newVideo);
    saveVideos(videos);

    return NextResponse.json({ success: true, video: newVideo, videos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
