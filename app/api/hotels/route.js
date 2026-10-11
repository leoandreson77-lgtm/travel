import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let list = db.get('hotels');

  const location = searchParams.get('location');
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const coupleFriendly = searchParams.get('coupleFriendly');
  const breakfast = searchParams.get('breakfast');
  const freeCancellation = searchParams.get('freeCancellation');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  if (location && location !== 'All') {
    list = list.filter(h => h.location.toLowerCase().includes(location.toLowerCase()) || (h.destinationSlug && h.destinationSlug.includes(location.toLowerCase())));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
  }
  if (type && type !== 'All') {
    list = list.filter(h => h.type.toLowerCase() === type.toLowerCase());
  }
  if (coupleFriendly === 'true') {
    list = list.filter(h => h.coupleFriendly);
  }
  if (breakfast === 'true') {
    list = list.filter(h => h.breakfastIncluded);
  }
  if (freeCancellation === 'true') {
    list = list.filter(h => h.freeCancellation);
  }
  if (minPrice) {
    list = list.filter(h => h.pricePerNight >= Number(minPrice));
  }
  if (maxPrice) {
    list = list.filter(h => h.pricePerNight <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'low') {
    list.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sort === 'high') {
    list.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hotels: paginated
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newHotel = db.insert('hotels', {
      ...body,
      pricePerNight: Number(body.pricePerNight) || 2999,
      status: body.status || 'published'
    });
    return NextResponse.json({ success: true, hotel: newHotel }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
