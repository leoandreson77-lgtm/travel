import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  let list = db.get('leads');

  if (status && status !== 'All') {
    list = list.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json({ success: true, count: list.length, leads: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newLead = db.insert('leads', {
      ...body,
      status: 'New',
      assignedAgent: body.assignedAgent || 'Priya Patel (Travel Agent)',
      createdAt: new Date().toISOString()
    });

    db.insert('notifications', {
      userId: 'usr-2', // Agent Priya
      title: 'New Lead Received!',
      message: `${newLead.name} enquired for ${newLead.destination || 'a Himalayan Trip'}. Phone: ${newLead.phone}`,
      type: 'lead',
      read: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: 'Travel enquiry received. An expert agent has been assigned.'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
