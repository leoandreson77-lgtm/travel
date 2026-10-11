import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let list = db.get('vehicles');

  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const location = searchParams.get('location');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  if (category && category !== 'All') {
    list = list.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== 'All') {
    list = list.filter(v => v.type.toLowerCase() === type.toLowerCase());
  }
  if (location && location !== 'All') {
    list = list.filter(v => v.availableLocations && v.availableLocations.some(l => l.toLowerCase().includes(location.toLowerCase())));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sort === 'high') {
    list.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  return NextResponse.json({ success: true, count: list.length, vehicles: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newV = db.insert('vehicles', {
      ...body,
      pricePerDay: Number(body.pricePerDay) || 1299,
      status: body.status || 'available'
    });
    return NextResponse.json({ success: true, vehicle: newV }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
