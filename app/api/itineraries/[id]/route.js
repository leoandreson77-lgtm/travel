import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const itin = db.findById('itineraries', id);
  if (!itin) {
    return NextResponse.json({ success: false, message: 'Itinerary not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, itinerary: itin });
}
