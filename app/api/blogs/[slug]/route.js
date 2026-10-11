import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { slug } = await params;
  const blog = db.findOne('blogs', b => b.slug === slug || b.id === slug);
  if (!blog) {
    return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
  }

  const related = db.get('blogs').filter(b => b.id !== blog.id).slice(0, 3);
  return NextResponse.json({ success: true, blog, related });
}
