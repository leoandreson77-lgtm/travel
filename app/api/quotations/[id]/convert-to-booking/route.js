import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';

export async function POST(request, { params }) {
  const { id } = await params;
  const quote = db.findById('quotations', id);
  if (!quote) {
    return NextResponse.json({ success: false, message: 'Quotation not found' }, { status: 404 });
  }

  const booking = db.insert('bookings', {
    id: `YM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: 'usr-6',
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone,
    productId: quote.id,
    productType: 'package',
    productTitle: quote.tripTitle,
    bookingDate: new Date().toISOString().slice(0, 10),
    travelStartDate: (quote.dates || '').split('–')[0]?.trim() || new Date().toISOString().slice(0, 10),
    travelEndDate: (quote.dates || '').split('–')[1] ? quote.dates.split('–')[1].trim() : new Date().toISOString().slice(0, 10),
    travellers: quote.travellers || 2,
    basePrice: quote.subtotal,
    taxes: quote.tax,
    serviceFee: 0,
    discount: quote.discount,
    couponApplied: 'QUOTE-CONVERT',
    finalAmount: quote.totalAmount,
    paymentMethod: 'Bank Transfer / Gateway',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    cancellationStatus: 'None',
    assignedAgent: quote.assignedAgent || 'Priya Patel'
  });

  db.update('quotations', quote.id, { status: 'Converted' });
  if (quote.leadId) {
    db.update('leads', quote.leadId, { status: 'Confirmed', notes: `Converted to confirmed booking #${booking.id}` });
  }

  return NextResponse.json({
    success: true,
    booking,
    message: `Quotation #${quote.id} converted into Booking #${booking.id}`
  });
}
