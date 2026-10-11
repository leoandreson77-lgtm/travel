import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  const list = db.find('itineraries', i => i.userId === 'usr-6');
  return NextResponse.json({ success: true, count: list.length, itineraries: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newItin = db.insert('itineraries', {
      ...body,
      userId: 'usr-6',
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ success: true, itinerary: newItin }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
