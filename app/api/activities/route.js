import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let list = db.get('activities');

  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const search = searchParams.get('search');
  const difficulty = searchParams.get('difficulty');
  const sort = searchParams.get('sort');

  if (category && category !== 'All') {
    list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
  if (location && location !== 'All') {
    list = list.filter(a => a.location.toLowerCase().includes(location.toLowerCase()) || (a.destinationSlug && a.destinationSlug.includes(location.toLowerCase())));
  }
  if (difficulty && difficulty !== 'All') {
    list = list.filter(a => a.difficulty && a.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a => a.name.toLowerCase().includes(q) || a.highlights.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'high') {
    list.sort((a, b) => b.price - a.price);
  }

  return NextResponse.json({ success: true, count: list.length, activities: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newAct = db.insert('activities', {
      ...body,
      price: Number(body.price) || 1499,
      status: body.status || 'published'
    });
    return NextResponse.json({ success: true, activity: newAct }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
