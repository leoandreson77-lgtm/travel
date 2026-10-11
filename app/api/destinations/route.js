import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  let list = db.get('destinations');

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));
  }

  return NextResponse.json({ success: true, count: list.length, destinations: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = db.insert('destinations', {
      ...body,
      slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      status: body.status || 'published'
    });
    return NextResponse.json({ success: true, destination: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
