import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { initialArticles } from '@/data/articles';

const filePath = path.join(process.cwd(), 'src', 'data', 'articles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readArticles() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialArticles;
  } catch (err) {
    return initialArticles;
  }
}

async function writeArticles(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing articles.json:', err);
  }
}

// GET: Return all articles
export async function GET() {
  try {
    const articles = await readArticles();
    return NextResponse.json(
      { success: true, articles },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read articles' }, { status: 500 });
  }
}

// POST: Add new article or delete by action
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'delete' && body.id) {
      const articles = await readArticles();
      const updated = articles.filter((a: any) => a.id !== body.id);
      await writeArticles(updated);
      return NextResponse.json({ success: true, articles: updated });
    }

    const { title, category, categoryLabel, summary, content, readTime, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان المقال والمحتوى مطلوبان' }, { status: 400 });
    }

    const newArticle = {
      id: body.id || `art-${Date.now()}`,
      title: title.trim(),
      category: category || 'psychology',
      categoryLabel: categoryLabel || 'صحة نفسية واتزان',
      author: author || 'جلال أحمد',
      summary: summary || (Array.isArray(content) ? content[0]?.slice(0, 160) : content.slice(0, 160)) + '...',
      content: Array.isArray(content) ? content : [content],
      readTime: readTime || '5 دقائق قراءة',
      publishDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      readersCount: 1,
      rating: 5.0,
      ratingsCount: 1,
      commentsCount: 0,
      comments: [],
    };

    const articles = await readArticles();
    const updated = [newArticle, ...articles];
    await writeArticles(updated);

    return NextResponse.json({ success: true, article: newArticle, articles: updated });
  } catch (error) {
    console.error('Articles POST error:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}

// PUT: Edit existing article
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, category, categoryLabel, summary, content, readTime } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف المقال مطلوب' }, { status: 400 });
    }

    const articles = await readArticles();
    const idx = articles.findIndex((a: any) => a.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    const existing = articles[idx];
    articles[idx] = {
      ...existing,
      title: title !== undefined ? title.trim() : existing.title,
      category: category !== undefined ? category : existing.category,
      categoryLabel: categoryLabel !== undefined ? categoryLabel : existing.categoryLabel,
      summary: summary !== undefined ? summary : existing.summary,
      content: content !== undefined ? (Array.isArray(content) ? content : [content]) : existing.content,
      readTime: readTime !== undefined ? readTime : existing.readTime,
    };

    await writeArticles(articles);
    return NextResponse.json({ success: true, article: articles[idx], articles });
  } catch (error) {
    console.error('Articles PUT error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE: Remove article by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف المقال مطلوب' }, { status: 400 });
    }

    const articles = await readArticles();
    const updated = articles.filter((a: any) => a.id !== id);
    await writeArticles(updated);

    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('Articles DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
