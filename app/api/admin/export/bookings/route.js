import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';

export async function GET() {
  const bookings = db.get('bookings');
  const headers = ['Booking ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Travel Start', 'Travel End', 'Travellers', 'Total Amount', 'Payment Status', 'Booking Status'];
  const rows = bookings.map(b => [
    b.id,
    `"${(b.customerName || '').replace(/"/g, '""')}"`,
    b.customerEmail || '',
    b.customerPhone || '',
    `"${(b.productTitle || '').replace(/"/g, '""')}"`,
    b.travelStartDate || '',
    b.travelEndDate || '',
    b.travellers || 1,
    b.finalAmount || 0,
    b.paymentStatus || '',
    b.bookingStatus || ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=trippie_bookings.csv'
    }
  });
}
