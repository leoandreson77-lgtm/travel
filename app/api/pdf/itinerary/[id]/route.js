import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateItineraryPdf } from '@/pdf-service';

export async function GET(request, { params }) {
  const { id } = await params;
  const itin = db.findById('itineraries', id);
  if (!itin) {
    return NextResponse.json({ success: false, message: 'Itinerary not found' }, { status: 404 });
  }

  try {
    const buffer = await generateItineraryPdf(itin);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=trippie_itinerary_${itin.id}.pdf`
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
