import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { slug } = await params;
  const destination = db.findOne('destinations', d => d.id === slug || d.slug === slug);
  if (!destination) {
    return NextResponse.json({ success: false, message: 'Destination not found' }, { status: 404 });
  }

  const hotels = db.find('hotels', h => h.destinationSlug === destination.slug || h.location.toLowerCase() === destination.name.toLowerCase());
  const packages = db.find('packages', p => p.destinationSlug === destination.slug || p.destination.toLowerCase().includes(destination.name.toLowerCase()));
  const activities = db.find('activities', a => a.destinationSlug === destination.slug || a.location.toLowerCase().includes(destination.name.toLowerCase()));

  return NextResponse.json({
    success: true,
    destination,
    related: { hotels, packages, activities }
  });
}
