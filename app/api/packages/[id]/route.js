import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const pkg = db.findOne('packages', p => p.id === id || p.slug === id);
  if (!pkg) {
    return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
  }

  const reviews = db.find('reviews', r => r.productId === pkg.id && r.status === 'approved');
  return NextResponse.json({ success: true, package: pkg, reviews });
}
