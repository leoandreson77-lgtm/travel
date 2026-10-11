import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let list = db.get('packages');

  const destination = searchParams.get('destination');
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  if (destination && destination !== 'All') {
    list = list.filter(p => p.destination.toLowerCase().includes(destination.toLowerCase()) || (p.destinationSlug && p.destinationSlug.includes(destination.toLowerCase())));
  }
  if (category && category !== 'All') {
    list = list.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== 'All') {
    list = list.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return NextResponse.json({ success: true, count: list.length, packages: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newPkg = db.insert('packages', {
      ...body,
      slug: (body.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      price: Number(body.price) || 9999,
      status: body.status || 'published'
    });
    return NextResponse.json({ success: true, package: newPkg }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
