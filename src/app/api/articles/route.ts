import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { initialArticles } from '@/data/articles';
import { requireRole } from '@/lib/serverAuth';

const filePath = path.join(process.cwd(), 'src', 'data', 'articles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readArticles() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialArticles;
  } catch {
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

// GET: Return all published articles (Public)
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
  } catch {
    return NextResponse.json({ error: 'Failed to read articles' }, { status: 500 });
  }
}

// POST: Add new article or delete by action (Admin Only)
export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();

    if (body.action === 'delete' && body.id) {
      const articles = await readArticles();
      const updated = articles.filter((a: any) => a.id !== body.id);
      await writeArticles(updated);
      return NextResponse.json({ success: true, articles: updated });
    }

    const { title, category, categoryLabel, summary, content, readTime, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'عنوان المقال والمحتوى حقول إلزامية' },
        { status: 400 }
      );
    }

    const newArticle = {
      id: `art-${Date.now()}`,
      title,
      slug: `art-${Date.now()}`,
      category: category || 'family',
      categoryLabel: categoryLabel || 'التربية واليافعين',
      summary: summary || '',
      content,
      readTime: readTime || '5 دقائق قراءة',
      author: author || 'د. جلال أحمد',
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      publishedAt: new Date().toISOString(),
    };

    const articles = await readArticles();
    articles.unshift(newArticle);
    await writeArticles(articles);

    return NextResponse.json({ success: true, article: newArticle, articles });
  } catch (error) {
    console.error('Error in POST articles:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}
