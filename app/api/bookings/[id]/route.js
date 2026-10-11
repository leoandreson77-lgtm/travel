import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const booking = db.findById('bookings', id);
  if (!booking) {
    return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, booking });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const updates = await request.json();
    const updated = db.update('bookings', id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
