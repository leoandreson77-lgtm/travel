import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');
  let list = db.get('bookings');

  if (status && status !== 'All') {
    list = list.filter(b => b.bookingStatus.toLowerCase() === status.toLowerCase());
  }
  if (customerId) {
    list = list.filter(b => b.customerId === customerId);
  }

  list.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  return NextResponse.json({ success: true, count: list.length, bookings: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      productId,
      productType,
      productTitle,
      customerName,
      customerEmail,
      customerPhone,
      travelStartDate,
      travelEndDate,
      travellers = 2,
      basePrice,
      taxes,
      discount = 0,
      couponApplied = '',
      finalAmount,
      paymentMethod = 'UPI',
      specialRequests = ''
    } = body;

    const bookingId = `TRP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = db.insert('bookings', {
      id: bookingId,
      customerId: 'usr-6',
      customerName,
      customerEmail,
      customerPhone,
      productId,
      productType,
      productTitle: productTitle || 'Himalayan Booking',
      bookingDate: new Date().toISOString().slice(0, 10),
      travelStartDate: travelStartDate || new Date().toISOString().slice(0, 10),
      travelEndDate: travelEndDate || new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
      travellers: Number(travellers) || 2,
      basePrice: Number(basePrice) || 0,
      taxes: Number(taxes) || 0,
      serviceFee: 0,
      discount: Number(discount) || 0,
      couponApplied,
      finalAmount: Number(finalAmount) || 0,
      paymentMethod,
      paymentStatus: paymentMethod === 'Pay Later' ? 'Payment Pending' : 'Paid',
      bookingStatus: 'Confirmed',
      cancellationStatus: 'None',
      assignedAgent: 'Priya Patel',
      specialRequests
    });

    // Create automatic confirmation notification
    db.insert('notifications', {
      userId: 'usr-6',
      title: 'Booking Confirmed!',
      message: `Your booking #${newBooking.id} for ${newBooking.productTitle} has been successfully confirmed.`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Booking confirmed successfully'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
