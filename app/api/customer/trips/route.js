import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET() {
  const currentUserId = 'usr-6'; // Demo customer Sameer Sharma
  const userBookings = db.find('bookings', b => b.customerId === currentUserId || b.customerEmail === 'sameer@example.com');
  const now = new Date().toISOString().slice(0, 10);

  const upcoming = userBookings.filter(b => b.bookingStatus === 'Confirmed' && b.travelStartDate >= now);
  const completed = userBookings.filter(b => b.bookingStatus === 'Completed' || (b.bookingStatus === 'Confirmed' && b.travelStartDate < now));
  const cancelled = userBookings.filter(b => b.bookingStatus === 'Cancelled');

  return NextResponse.json({
    success: true,
    upcoming,
    completed,
    cancelled,
    all: userBookings
  });
}
