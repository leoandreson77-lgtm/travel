import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  const blogs = db.get('blogs');
  return NextResponse.json({ success: true, count: blogs.length, blogs });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newBlog = db.insert('blogs', {
      ...body,
      slug: (body.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 60),
      publishedAt: new Date().toISOString().slice(0, 10)
    });
    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
