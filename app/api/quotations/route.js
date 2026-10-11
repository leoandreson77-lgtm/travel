import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  const list = db.get('quotations');
  return NextResponse.json({ success: true, count: list.length, quotations: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      leadId,
      customerName,
      customerPhone,
      customerEmail,
      tripTitle,
      destination,
      dates,
      travellers = 2,
      items = [],
      discount = 0,
      tax = 0,
      status = 'Sent',
      assignedAgent = 'Priya Patel'
    } = body;

    let subtotal = 0;
    const lineItems = items.map(it => {
      const cost = Number(it.cost) || 0;
      subtotal += cost;
      return { ...it, cost };
    });

    const totalAmount = Math.max(0, subtotal + Number(tax) - Number(discount));

    const quote = db.insert('quotations', {
      leadId: leadId || null,
      customerName,
      customerPhone,
      customerEmail,
      tripTitle,
      destination,
      dates,
      travellers: Number(travellers) || 2,
      items: lineItems,
      subtotal,
      discount: Number(discount),
      tax: Number(tax),
      totalAmount,
      status,
      assignedAgent,
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
    });

    if (leadId) {
      db.update('leads', leadId, { status: 'Quotation Sent', notes: `Quotation #${quote.id} created for ₹${quote.totalAmount.toLocaleString('en-IN')}` });
    }

    return NextResponse.json({ success: true, quotation: quote }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
