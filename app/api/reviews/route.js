import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  const reviews = db.get('reviews');
  return NextResponse.json({ success: true, count: reviews.length, reviews });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newRev = db.insert('reviews', {
      ...body,
      author: body.author || 'Sameer Sharma',
      date: new Date().toISOString().slice(0, 10),
      status: 'approved'
    });
    return NextResponse.json({ success: true, review: newRev }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
