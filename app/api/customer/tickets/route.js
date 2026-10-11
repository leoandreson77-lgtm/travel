import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET() {
  const tickets = db.find('tickets', t => t.customerId === 'usr-6');
  return NextResponse.json({ success: true, tickets });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newTicket = db.insert('tickets', {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'usr-6',
      customerName: 'Sameer Sharma',
      bookingId: body.bookingId || '',
      category: body.category || 'General Enquiry',
      priority: body.priority || 'Medium',
      subject: body.subject,
      message: body.message,
      status: 'Open',
      assignedAgent: 'Support Concierge',
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
