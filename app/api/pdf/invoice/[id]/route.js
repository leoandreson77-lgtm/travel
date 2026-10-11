import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateTaxInvoice } from '@/pdf-service';

export async function GET(request, { params }) {
  const { id } = await params;
  const booking = db.findById('bookings', id);
  if (!booking) {
    return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
  }

  try {
    const buffer = await generateTaxInvoice(booking);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=trippie_invoice_${booking.id}.pdf`
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
